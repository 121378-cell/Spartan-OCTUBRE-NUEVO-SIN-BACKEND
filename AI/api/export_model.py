import numpy as np
from sklearn.linear_model import LogisticRegression
import skl2onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# This script creates a placeholder scikit-learn model, trains it,
# and exports it to the ONNX format for use in the FastAPI service.

def export_risk_model():
    """
    Trains a simple risk classification model and exports it to ONNX format.
    """
    # 1. Create a placeholder dataset
    # Simulating a dataset with 100 samples and 4 features for risk assessment.
    X_train = np.random.rand(100, 4).astype(np.float32)
    # Binary classification: 0 (low risk), 1 (high risk)
    y_train = (X_train.sum(axis=1) > 2).astype(int) # Simple rule for reproducibility

    # 2. Train a simple scikit-learn model (Logistic Regression)
    model = LogisticRegression()
    model.fit(X_train, y_train)
    print("Model trained successfully.")

    # 3. Define the input type for the ONNX model
    # The first dimension (None) allows for a variable batch size.
    # The second dimension (4) is the number of features.
    initial_type = [('float_input', FloatTensorType([None, 4]))]

    # 4. Convert the scikit-learn model to ONNX format
    try:
        onnx_model = convert_sklearn(model, initial_types=initial_type)

        # 5. Save the ONNX model to a file
        model_path = "risk_model.onnx"
        with open(model_path, "wb") as f:
            f.write(onnx_model.SerializeToString())

        print(f"Model successfully exported to {model_path}")
    except Exception as e:
        print(f"An error occurred during ONNX conversion: {e}")


if __name__ == "__main__":
    export_risk_model()