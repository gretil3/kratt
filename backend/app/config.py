"""Runtime configuration, all from environment variables (never hardcode secrets)."""
import os


def _flag(name: str, default: str = "0") -> bool:
    return os.environ.get(name, default).strip().lower() in ("1", "true", "yes", "on")


class Settings:
    # --- secrets / external services ---
    youtube_api_key: str = os.environ.get("YOUTUBE_API_KEY", "")

    # --- model ---
    # The trained authenticity classifier on the Hugging Face Hub.
    model_repo: str = os.environ.get("KRATT_MODEL_REPO", "geraldadli/Kratt")
    # Load BERT at all? Turn off for a fast rules-only dev loop.
    enable_bert: bool = _flag("KRATT_ENABLE_BERT", "1")
    # P(authentic) at or above this is called "genuine"; below it is "bot"
    # (subdivided into low_effort by the rules). Training's own threshold sweep
    # showed this materially trades false positives against false negatives --
    # tune it here instead of retraining. Lower = catches more bots, flags more
    # authentic comments too; higher = fewer false positives, more bots slip by.
    bot_threshold: float = float(os.environ.get("KRATT_BOT_THRESHOLD", "0.5"))
    # Where to cache the downloaded model. Empty = huggingface_hub's own default
    # (~/.cache/huggingface/hub). Set this to a PERSISTENT volume path on hosts
    # that wipe local disk on every restart/redeploy (most PaaS free tiers),
    # or the ~1GB model re-downloads on every cold start.
    model_cache_dir: str = os.environ.get("KRATT_MODEL_CACHE_DIR", "").strip()
    # Load the model in a background thread at startup instead of lazily on
    # the first /analyze call, so that request isn't the one paying for the
    # download + load.
    warm_up_model: bool = _flag("KRATT_WARM_UP_MODEL", "1")

    # --- niche inference (the model needs a niche the raw video doesn't carry) ---
    # If set, every video is forced to this niche (handy for testing / demos).
    force_niche: str = os.environ.get("KRATT_FORCE_NICHE", "").strip()
    # Fallback when metadata inference can't decide.
    default_niche: str = os.environ.get("KRATT_DEFAULT_NICHE", "genuine").strip()

    # --- limits ---
    # Cap comments fetched + scored so latency stays bounded (BERT on CPU is slow).
    max_comments: int = int(os.environ.get("KRATT_MAX_COMMENTS", "300"))
    # How many example comments to return as evidence.
    max_samples: int = int(os.environ.get("KRATT_MAX_SAMPLES", "6"))
    # Replies cost one full API call PER THREAD regardless of that thread's
    # reply count (YouTube's comments.list takes a single parentId -- there is
    # no endpoint to batch-fetch replies across multiple parents). Skip threads
    # with fewer replies than this so quota isn't spent 1-call-for-1-reply.
    min_replies_to_fetch: int = int(os.environ.get("KRATT_MIN_REPLIES_TO_FETCH", "2"))

    # --- optional LLM pattern pass (flowchart's "LLM pattern pass") ---
    enable_llm_pass: bool = _flag("KRATT_ENABLE_LLM_PASS", "0")

    # --- CORS (mobile web hits this cross-origin) ---
    cors_origins: str = os.environ.get("KRATT_CORS_ORIGINS", "*")


settings = Settings()

VALID_NICHES = ("genuine", "copycat", "low-effort")
