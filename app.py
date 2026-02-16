from fastapi import FastAPI
from pydantic import BaseModel
import torch
from torch_geometric.data import Data
from model import SanctionImpactGNN
from utils import load_trade_graph

# --------------------------------------------------
# 1️⃣ Create FastAPI app
# --------------------------------------------------
app = FastAPI(title="Sanction Impact Analyzer API")

# --------------------------------------------------
# 2️⃣ Load trained model
# --------------------------------------------------
model = SanctionImpactGNN(in_dim=8)  # adjust if your feature dim is different
model.load_state_dict(torch.load("saved_model.pt", map_location="cpu"))
model.eval()

# --------------------------------------------------
# 3️⃣ Define Input Schema (what API expects)
# --------------------------------------------------
class PolicyInput(BaseModel):
    severity: float
    financial: int
    trade: int
    technology: int
    energy: int
    issuer_strength: float
    binding: int


# --------------------------------------------------
# 4️⃣ Prediction Endpoint
# --------------------------------------------------
@app.post("/predict")
def predict(policy: PolicyInput):

    policy_vector = torch.tensor([
        policy.severity,
        policy.financial,
        policy.trade,
        policy.technology,
        policy.energy,
        policy.issuer_strength,
        policy.binding
    ], dtype=torch.float32)

    data = load_trade_graph(policy_vector, feature_dim=8)
    # Model expects list of yearly graphs
    preds = model([data])

    return preds
