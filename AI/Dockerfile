# Stage 1: Builder
# This stage installs all dependencies, including build-time ones, and generates the model.
FROM python:3.10-slim as builder

WORKDIR /app

# Install all dependencies needed for model creation
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the model export script and run it
COPY api/export_model.py .
RUN python export_model.py

# Stage 2: Final Image
# This stage creates the final, optimized image for production.
FROM python:3.10-slim

WORKDIR /app

# Copy runtime requirements and install
COPY api/requirements-runtime.txt .
RUN pip install --no-cache-dir -r requirements-runtime.txt

# Copy only the essential files from the builder stage
COPY --from=builder /app/risk_model.onnx .
COPY api/main.py .

# Expose Port
EXPOSE 8000

# Run Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]