# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend & Static Server
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for OpenCV headless
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (default 8000, or dynamic $PORT on Render/Railway)
ENV PORT=8000
EXPOSE 8000

WORKDIR /app/backend
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
