"""
BERT authenticity classifier wrapper.

Loads the fine-tuned model from the Hugging Face Hub (settings.model_repo) once,
lazily, and scores comments in batches. If loading fails for ANY reason (no
torch, download error, offline), `available` stays False and the pipeline falls
back to rules-only — the endpoint must never hard-fail because of the model.
"""
from __future__ import annotations

import threading

from .config import settings

_LABELS_FALLBACK = {0: "bot", 1: "authentic"}


class BertClassifier:
    def __init__(self, repo: str):
        self.repo = repo
        self._tokenizer = None
        self._model = None
        self._torch = None
        self._id2label = _LABELS_FALLBACK
        self._loaded = False
        self._failed = False
        self._lock = threading.Lock()

    @property
    def available(self) -> bool:
        if self._failed:
            return False
        if not self._loaded:
            self._load()
        return not self._failed

    def _load(self) -> None:
        with self._lock:
            if self._loaded or self._failed:
                return
            try:
                import torch
                from transformers import (
                    AutoTokenizer,
                    AutoModelForSequenceClassification,
                )

                self._torch = torch
                self._tokenizer = AutoTokenizer.from_pretrained(self.repo)
                self._model = AutoModelForSequenceClassification.from_pretrained(self.repo)
                self._model.eval()
                cfg_map = getattr(self._model.config, "id2label", None)
                if cfg_map:
                    # config keys can be str -> normalize to int
                    self._id2label = {int(k): v for k, v in cfg_map.items()}
                self._loaded = True
                print(f"[kratt] BERT loaded from {self.repo!r}")
            except Exception as exc:  # noqa: BLE001 - any failure => fallback
                self._failed = True
                print(f"[kratt] BERT unavailable ({type(exc).__name__}: {exc}) "
                      f"-- falling back to rules-only scoring.")

    def predict(self, texts: list[str], batch_size: int = 32) -> list[str] | None:
        """Return a 'bot'/'authentic' label per text, or None if unavailable."""
        if not self.available:
            return None
        torch = self._torch
        out: list[str] = []
        for start in range(0, len(texts), batch_size):
            batch = texts[start:start + batch_size]
            enc = self._tokenizer(
                batch, truncation=True, max_length=128,
                padding=True, return_tensors="pt",
            )
            with torch.no_grad():
                logits = self._model(**enc).logits
            for row in logits.argmax(dim=-1).tolist():
                out.append(self._id2label.get(int(row), "bot"))
        return out


classifier = BertClassifier(settings.model_repo)
