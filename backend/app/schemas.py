"""Request/response models — the wire shapes in docs/api-contract.md."""
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    video_url: str = Field(..., description="Full YouTube video URL")


class Breakdown(BaseModel):
    ads_spam: int
    copy_paste: int
    low_effort: int
    genuine: int


class AnalyzeResponse(BaseModel):
    bot_percentage: int
    breakdown: Breakdown
    total_comments_analyzed: int
    sample_flagged_comments: list[str]


class ErrorResponse(BaseModel):
    error: str
    message: str
