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

    def warm_up(self) -> None:
        """
        Kick off model loading in a background thread so it's (usually) ready
        before the first real request arrives, instead of that request paying
        for the full download + load inline. Safe to call even if a request
        beats it to `_load()` first -- both go through the same lock, so only
        one actual load happens either way.
        """
        threading.Thread(target=lambda: self.available, daemon=True).start()

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

                cache_dir = settings.model_cache_dir or None  # None = library default
                self._torch = torch
                self._tokenizer = AutoTokenizer.from_pretrained(self.repo, cache_dir=cache_dir)
                self._model = AutoModelForSequenceClassification.from_pretrained(
                    self.repo, cache_dir=cache_dir
                )
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

    def predict_proba(self, texts: list[str], batch_size: int = 32) -> list[float] | None:
        """Return P(authentic) in [0, 1] per text, or None if unavailable.
        Exposing the probability (not just argmax) is what lets the pipeline
        apply a TUNABLE bot threshold (settings.bot_threshold) instead of the
        model's raw, non-adjustable 0.5 decision boundary."""
        if not self.available:
            return None
        torch = self._torch
        # id2label keys/order aren't guaranteed -- find which output column is
        # 'authentic' explicitly rather than assuming index 1.
        authentic_idx = next(
            (i for i, lab in self._id2label.items() if lab == "authentic"), 1
        )
        total_batches = (len(texts) + batch_size - 1) // batch_size
        print(f"[kratt] BERT scoring {len(texts)} comments "
              f"({total_batches} batches of {batch_size}) ...")
        out: list[float] = []
        for start in range(0, len(texts), batch_size):
            batch = texts[start:start + batch_size]
            enc = self._tokenizer(
                batch, truncation=True, max_length=128,
                padding=True, return_tensors="pt",
            )
            with torch.no_grad():
                logits = self._model(**enc).logits
            probs = torch.softmax(logits, dim=-1)
            out.extend(probs[:, authentic_idx].tolist())
            batch_num = start // batch_size + 1
            if batch_num % 100 == 0 or batch_num == total_batches:
                print(f"[kratt]   BERT batch {batch_num}/{total_batches} "
                      f"({len(out)}/{len(texts)} scored)")
        print(f"[kratt] BERT scoring complete.")
        return out

    def predict(self, texts: list[str], batch_size: int = 32,
                threshold: float = 0.5) -> list[str] | None:
        """Return a 'bot'/'authentic' label per text at a fixed 0.5 threshold
        (kept for any caller that just wants a label). The pipeline uses
        predict_proba() directly so it can apply a tunable threshold instead."""
        probs = self.predict_proba(texts, batch_size=batch_size)
        if probs is None:
            return None
        return ["authentic" if p >= threshold else "bot" for p in probs]


classifier = BertClassifier(settings.model_repo)
