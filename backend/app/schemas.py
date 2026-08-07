"""Request/response models — the wire shapes in docs/api-contract.md."""
from typing import Literal

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    video_url: str = Field(..., description="Full YouTube video URL")


class Breakdown(BaseModel):
    ads_spam: int
    copy_paste: int
    low_effort: int
    genuine: int


class FlaggedComment(BaseModel):
    """One evidence row: the comment text plus the bucket the pipeline put it in.

    The category ships from the backend so the UI renders it directly instead of
    re-guessing it from the text client-side. `genuine` is deliberately not a
    valid value — only flagged comments appear in the sample.
    """

    text: str
    category: Literal["ads_spam", "copy_paste", "low_effort"]


class AnalyzeResponse(BaseModel):
    bot_percentage: int
    breakdown: Breakdown
    total_comments_analyzed: int
    sample_flagged_comments: list[FlaggedComment]


class ErrorResponse(BaseModel):
    error: str
    message: str
