"""
Kratt backend entry point.

Run locally:
    uvicorn app.main:app --reload
"""
from fastapi import FastAPI

app = FastAPI(title="Kratt API")


@app.get("/")
def health_check():
    return {"status": "Kratt backend is running"}


# TODO: add POST /analyze endpoint per docs/api-contract.md
