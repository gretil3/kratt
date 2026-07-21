# Kratt backend -- serves POST /analyze (see ../docs/api-contract.md).
#
# The model is baked into the image at BUILD time (scripts/prefetch_model.py),
# so a cold container starts instantly with zero network dependency for the
# ~1GB model -- rebuild this image whenever geraldadli/Kratt changes on the Hub.
#
# Build:  docker build -t kratt-backend .
# Run:    docker run -p 7860:7860 --env-file .env kratt-backend
#
# Works unmodified on HF Spaces (Docker SDK, expects port 7860) AND on hosts
# that inject their own $PORT (Render/Railway/Fly) -- the CMD below respects
# either, since a runtime -e PORT=... overrides the ENV default at container
# start.
FROM python:3.11-slim

WORKDIR /app

# CPU-only torch explicitly -- the default PyPI wheel bundles a multi-GB CUDA
# build that's dead weight for CPU inference on a Space/Render/Fly box.
COPY requirements-serve.txt .
RUN pip install --no-cache-dir torch==2.4.1 --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements-serve.txt

COPY app ./app
COPY scripts/prefetch_model.py ./scripts/prefetch_model.py

# Bake the trained model into the image (needs network access at BUILD time only).
ENV KRATT_MODEL_REPO=geraldadli/Kratt \
    KRATT_MODEL_CACHE_DIR=/app/model_cache
RUN python scripts/prefetch_model.py

# From here on the model is already on disk -- HF_HUB_OFFLINE guarantees the
# running container never touches the network for it, so a cold start is fast
# and doesn't depend on the host's network reaching huggingface.co.
ENV HF_HUB_OFFLINE=1 \
    KRATT_WARM_UP_MODEL=1 \
    KRATT_CORS_ORIGINS=* \
    PORT=7860

# YOUTUBE_API_KEY is deliberately NOT set here -- provide it as a secret /
# environment variable on whatever host runs this image, never bake it into
# the image (see the "Deploying" section in README.md).

EXPOSE 7860
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
