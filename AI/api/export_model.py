import numpy as np
from sklearn.linear_model import LogisticRegression
import skl2onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

def export_risk_model():
    X_train = np.random.rand(100, 4).astype(np.float32)
    y_train = (X_train.sum(axis=1) > 2).astype(int)
    model = LogisticRegression()
    model.fit(X_train, y_train)
    initial_type = [('float_input', FloatTensorType([None, 4]))]
    onnx_model = convert_sklearn(model, initial_types=initial_type)
    with open("risk_model.onnx", "wb") as f:
        f.write(onnx_model.SerializeToString())

if __name__ == "__main__":
    export_risk_model()