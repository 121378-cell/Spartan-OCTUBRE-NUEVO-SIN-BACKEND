from fastapi import FastAPI
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
import os

class PredictionRequest(BaseModel):
    features: list[list[float]]

app = FastAPI()

model_path = "risk_model.onnx"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"'{model_path}' not found. Please run 'export_model.py' first.")

ort_session = ort.InferenceSession(model_path)
input_name = ort_session.get_inputs()[0].name

@app.get("/")
def read_root():
    return {"message": "AI Risk Classification Service is running"}

@app.post("/predict_alert")
def predict_alert(request: PredictionRequest):
    input_data = np.array(request.features, dtype=np.float32)
    pred_onx = ort_session.run(None, {input_name: input_data})
    alert_triggered = bool(1 in pred_onx[0])
    return {"AlertaRoja": alert_triggered}