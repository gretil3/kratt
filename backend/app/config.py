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

    # --- optional LLM pattern pass (flowchart's "LLM pattern pass") ---
    enable_llm_pass: bool = _flag("KRATT_ENABLE_LLM_PASS", "0")

    # --- CORS (mobile web hits this cross-origin) ---
    cors_origins: str = os.environ.get("KRATT_CORS_ORIGINS", "*")


settings = Settings()

VALID_NICHES = ("genuine", "copycat", "low-effort")
