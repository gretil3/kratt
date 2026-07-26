"""
Kratt backend entry point.

Run locally:
    cd backend
    cp .env.example .env      # then put your YOUTUBE_API_KEY in .env
    pip install -r requirements.txt
    uvicorn app.main:app --reload

Implements POST /analyze per docs/api-contract.md.
"""
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()  # read backend/.env before anything reads settings

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402

from . import errors  # noqa: E402
from .config import settings  # noqa: E402
from .model import classifier  # noqa: E402
from .schemas import AnalyzeRequest, AnalyzeResponse, ErrorResponse  # noqa: E402
from .pipeline import analyze  # noqa: E402


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Using the `lifespan` API (not the deprecated @app.on_event("startup"))
    # so this doesn't depend on the on_startup/on_shutdown routing kwargs that
    # broke entirely on a mismatched fastapi/starlette pair during dev here.
    if settings.enable_bert and settings.warm_up_model:
        classifier.warm_up()
    yield


app = FastAPI(title="Kratt API", lifespan=lifespan)

_origins = ["*"] if settings.cors_origins.strip() == "*" else [
    o.strip() for o in settings.cors_origins.split(",") if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "Kratt backend is running",
        "bert_enabled": settings.enable_bert,
        "model_repo": settings.model_repo,
    }


@app.post(
    "/analyze",
    response_model=AnalyzeResponse,
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse},
               422: {"model": ErrorResponse}, 500: {"model": ErrorResponse},
               503: {"model": ErrorResponse}},
)
def analyze_endpoint(req: AnalyzeRequest):
    try:
        return analyze(req.video_url)
    except errors.KrattError as e:
        return JSONResponse(
            status_code=e.status,
            content={"error": e.code, "message": e.message},
        )
    except Exception as exc:  # noqa: BLE001 - never leak a stack trace to the app
        print(f"[kratt] unhandled error: {type(exc).__name__}: {exc}")
        err = errors.internal_error()
        return JSONResponse(
            status_code=err.status,
            content={"error": err.code, "message": err.message},
        )
