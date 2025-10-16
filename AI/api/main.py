from fastapi import FastAPI
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
import os

# Define the input data model using Pydantic for request body validation
class PredictionRequest(BaseModel):
    # Expects a list of lists, e.g., [[1.0, 2.0, 3.0, 4.0]]
    features: list[list[float]]

# Initialize the FastAPI application
app = FastAPI()

# Load the ONNX model at startup
# This ensures the model is loaded only once and is ready for inference.
model_path = "risk_model.onnx"
if not os.path.exists(model_path):
    # This is a fallback for local development. In production, the Docker
    # image should always contain the model.
    raise FileNotFoundError(f"'{model_path}' not found. Please run 'export_model.py' first.")

# Create an ONNX Runtime inference session
ort_session = ort.InferenceSession(model_path)
input_name = ort_session.get_inputs()[0].name

@app.get("/")
def read_root():
    """A root endpoint for basic health checks."""
    return {"message": "AI Risk Classification Service is running"}

@app.post("/predict_alert")
def predict_alert(request: PredictionRequest):
    """
    Performs inference using the loaded ONNX model and returns a boolean alert.
    Accepts a list of feature sets and returns whether an alert should be triggered.
    """
    # Convert the input list to a NumPy array of type float32
    input_data = np.array(request.features, dtype=np.float32)

    # Run inference
    # The model returns a list of labels and a list of probabilities
    pred_onx = ort_session.run(None, {input_name: input_data})

    # The first output of the model is the predicted label (e.g., 0 or 1)
    # We assume '1' signifies high risk and should trigger an alert.
    # We check if any prediction in the batch is '1'.
    alert_triggered = bool(1 in pred_onx[0])

    return {"AlertaRoja": alert_triggered}