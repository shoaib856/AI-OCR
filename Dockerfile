
# Multi-stage build for document digitizer application

# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY frontend-react/package*.json ./frontend-react/

# Install all dependencies (including dev dependencies for build)
RUN cd frontend-react && npm ci

# Copy frontend source
COPY frontend-react/ ./frontend-react/

# Build frontend (this will output to ../dist relative to frontend-react)
RUN cd frontend-react && npm run build

# Stage 2: Python backend with built frontend
FROM python:3.13-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY app ./app

# Copy built frontend from stage 1 (now in /app/dist)
COPY --from=frontend-build /app/dist ./dist

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/docs || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
