# Stage 1: Builder
FROM python:3.10-slim as builder
WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api/export_model.py .
RUN python export_model.py

# Stage 2: Final Image
FROM python:3.10-slim
WORKDIR /app
COPY api/requirements-runtime.txt .
RUN pip install --no-cache-dir -r requirements-runtime.txt
COPY --from=builder /app/risk_model.onnx .
COPY api/main.py .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]