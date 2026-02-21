import torch
import random
from utils import load_trade_graph
from model import SanctionImpactGNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# model: 8 economic + 7 sanction = 15 features
model = SanctionImpactGNN(in_dim=15).to(device)

optimizer = torch.optim.Adam(model.parameters(), lr=0.003)
loss_fn = torch.nn.MSELoss()

EPOCHS = 120

print("Starting training on:", device)

# -----------------------------
# synthetic sanction generator
# -----------------------------
def random_policy():

    return torch.tensor([
        random.uniform(0, 1),     # severity
        random.randint(0, 1),     # financial
        random.randint(0, 1),     # trade
        random.randint(0, 1),     # technology
        random.randint(0, 1),     # energy
        random.uniform(0, 1),     # issuer strength
        random.randint(0, 1)      # binding
    ], dtype=torch.float32)


# -----------------------------
# fake target impact generator
# (teaches the network relationships)
# -----------------------------
def simulate_impact(policy):

    severity = policy[0]
    financial = policy[1]
    trade = policy[2]
    technology = policy[3]
    energy = policy[4]
    issuer = policy[5]
    binding = policy[6]

    # macroeconomic logic (synthetic but realistic)

    gdp = 0.4*severity + 0.3*trade + 0.2*financial
    cpi = 0.35*energy + 0.25*severity + 0.2*trade
    fx = 0.4*financial + 0.2*severity + 0.2*issuer
    trade_loss = 0.5*trade + 0.2*binding + 0.2*severity
    fdi = 0.4*financial + 0.3*severity + 0.2*issuer
    reserves = 0.3*financial + 0.2*energy + 0.2*severity
    score = (gdp + cpi + fx + trade_loss)/4
    duration = 0.5*binding + 0.3*issuer + 0.2*severity

    return {
        "gdp": torch.tensor([[gdp]], dtype=torch.float32),
        "cpi": torch.tensor([[cpi]], dtype=torch.float32),
        "fx": torch.tensor([[fx]], dtype=torch.float32),
        "trade": torch.tensor([[trade_loss]], dtype=torch.float32),
        "fdi": torch.tensor([[fdi]], dtype=torch.float32),
        "res": torch.tensor([[reserves]], dtype=torch.float32),
        "score": torch.tensor([[score]], dtype=torch.float32),
        "duration": torch.tensor([[duration]], dtype=torch.float32),
    }

# -----------------------------
# Training loop
# -----------------------------
for epoch in range(EPOCHS):

    model.train()
    total_loss = 0

    for _ in range(25):   # 25 scenarios per epoch

        policy_vector = random_policy()

        # build temporal sequence (5 years)
        graphs = []
        for _ in range(5):
            g = load_trade_graph(policy_vector)
            g = g.to(device)
            graphs.append(g)

        target = simulate_impact(policy_vector)

        optimizer.zero_grad()

        pred = model(graphs)

        loss = 0
        for key in pred:
            loss += loss_fn(pred[key], target[key].to(device))

        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS}  |  Loss: {total_loss:.4f}")


# -----------------------------
# Save model
# -----------------------------
torch.save(model.state_dict(), "saved_model.pt")
print("\nTraining complete! saved_model.pt created.")