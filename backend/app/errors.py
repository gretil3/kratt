"""Typed pipeline errors that map 1:1 to the codes in docs/api-contract.md."""


class KrattError(Exception):
    """A user-facing failure with a contract error code and HTTP status."""

    def __init__(self, code: str, message: str, status: int):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status


def invalid_url() -> KrattError:
    return KrattError(
        "invalid_url",
        "The provided URL is not a valid YouTube video link.",
        400,
    )


def video_not_found() -> KrattError:
    return KrattError(
        "video_not_found",
        "This video doesn't exist or is private.",
        404,
    )


def no_comments() -> KrattError:
    return KrattError(
        "no_comments",
        "This video has comments disabled or has zero comments.",
        422,
    )


def youtube_quota_exceeded() -> KrattError:
    return KrattError(
        "youtube_quota_exceeded",
        "YouTube's API quota has been hit. Please try again in a bit.",
        503,
    )


def internal_error() -> KrattError:
    return KrattError(
        "internal_error",
        "Something went wrong on our end. Please try again.",
        500,
    )
