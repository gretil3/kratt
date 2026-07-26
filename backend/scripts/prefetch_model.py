"""
Pre-downloads the trained classifier at DOCKER BUILD time (see ../Dockerfile),
so the running container never waits on a ~1GB Hub download on cold start.

Reuses the exact same env vars app/model.py reads (KRATT_MODEL_REPO /
KRATT_MODEL_CACHE_DIR) -- one source of truth for "which model, cached where",
not a second copy of that decision.

Run manually to warm a local cache too:
    KRATT_MODEL_CACHE_DIR=./model_cache python scripts/prefetch_model.py
"""
import os

from transformers import AutoModelForSequenceClassification, AutoTokenizer

repo = os.environ.get("KRATT_MODEL_REPO", "geraldadli/Kratt")
cache_dir = os.environ.get("KRATT_MODEL_CACHE_DIR") or None

print(f"[prefetch] downloading {repo!r} into {cache_dir or '(default HF cache)'} ...")
AutoTokenizer.from_pretrained(repo, cache_dir=cache_dir)
AutoModelForSequenceClassification.from_pretrained(repo, cache_dir=cache_dir)
print("[prefetch] done.")
