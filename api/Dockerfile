FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apt-get update \
    && apt-get install -y --no-install-recommends libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project

COPY . .

RUN useradd --create-home appuser \
    && mkdir -p /app/images \
    && chown -R appuser:appuser /app/images
USER appuser

ENV PATH="/app/.venv/bin:$PATH" \
    IMAGES_DIR=/app/images/ \
    OBJECTS_DIR=/app/objects/

EXPOSE 5001
CMD ["python", "main.py"]
