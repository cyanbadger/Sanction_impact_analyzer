import torch
from model import SanctionImpactGNN

# 8 economic + 7 sanction
model = SanctionImpactGNN(in_dim=15)
model.load_state_dict(torch.load("saved_model.pt", map_location="cpu"))
model.eval()

def run_prediction(data_list):
    with torch.no_grad():
        outputs = model(data_list)

    return {k: float(v.item()) for k, v in outputs.items()}