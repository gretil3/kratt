"""
Optional "LLM pattern pass" from the flowchart — a second look at AMBIGUOUS
comments to catch coordinated bursts / paraphrased duplicates that per-comment
rules + BERT miss.

This is a STUB by default (KRATT_ENABLE_LLM_PASS off): it returns buckets
unchanged so the pipeline is complete without requiring an LLM dependency. Wire
a real model here (e.g. Gemini via a GOOGLE/GEMINI key, or a hosted endpoint)
when ready; the signature is intentionally simple.
"""
from .config import settings


def refine_ambiguous(comments: list[dict], buckets: list[str],
                     bot_probs: list[float] | None) -> list[str]:
    """
    Given per-comment buckets, optionally re-label the uncertain ones.
    `bot_probs` is reserved for a future confidence-gated implementation.
    Returns buckets unchanged unless an LLM pass is enabled AND implemented.
    """
    if not settings.enable_llm_pass:
        return buckets
    # No real LLM is wired in this build; keep behavior identical but leave the
    # seam obvious. Implement clustering / coordinated-burst detection here.
    return buckets
