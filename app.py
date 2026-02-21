from fastapi import FastAPI
from pydantic import BaseModel
import torch
from model import SanctionImpactGNN
from utils import load_trade_graph

app = FastAPI(title="Sanction Impact Analyzer API")

# 8 economic + 7 sanction = 15
model = SanctionImpactGNN(in_dim=15)
model.load_state_dict(torch.load("saved_model.pt", map_location="cpu"))
model.eval()

class PolicyInput(BaseModel):
    severity: float
    financial: int
    trade: int
    technology: int
    energy: int
    issuer_strength: float
    binding: int


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

    # build temporal graph sequence
    graphs = []
    for _ in range(5):  # last 5 years
        graphs.append(load_trade_graph(policy_vector))

    with torch.no_grad():
        preds = model(graphs)

    # convert tensors to numbers
    output = {k: float(v.item()) for k, v in preds.items()}
    return output