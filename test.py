import torch
from model import SanctionImpactGNN
from utils import load_trade_graph

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = SanctionImpactGNN(in_dim=15).to(device)
model.load_state_dict(torch.load("saved_model.pt", map_location=device))
model.eval()

# example policy
policy = torch.tensor([0.8,1,1,0,1,0.9,1], dtype=torch.float32)

graphs = []
for _ in range(5):
    g = load_trade_graph(policy)
    g = g.to(device)
    graphs.append(g)

with torch.no_grad():
    output = model(graphs)

print("\nPredicted Economic Impact:\n")
for k,v in output.items():
    print(k, ":", v.item())