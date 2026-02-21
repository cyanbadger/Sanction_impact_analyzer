import torch
import torch.nn as nn
import pandas as pd
from tqdm import tqdm

from model import SanctionImpactGNN
from utils import load_trade_graph, COUNTRY_CODES

# -----------------------------
# Training configuration
# -----------------------------
YEARS = list(range(2008, 2022))  # training years
WINDOW = 5                       # GRU time window
LR = 0.001
EPOCHS = 25

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# model input: 8 economic + 7 sanction
model = SanctionImpactGNN(in_dim=15).to(device)

optimizer = torch.optim.Adam(model.parameters(), lr=LR)
loss_fn = nn.MSELoss()

# -------------------------------------------------
# Fetch India's macroeconomic ground truth (World Bank)
# -------------------------------------------------
import requests

INDIA_CODE = "IND"

TARGET_INDICATORS = {
    "gdp": "NY.GDP.MKTP.KD.ZG",      # GDP growth
    "cpi": "FP.CPI.TOTL.ZG",         # inflation
    "fx": "PA.NUS.FCRF",             # exchange rate
    "trade": "NE.TRD.GNFS.ZS",       # trade % GDP
    "fdi": "BX.KLT.DINV.CD.WD",      # FDI
    "res": "FI.RES.TOTL.CD"          # reserves
}


def fetch_indicator(indicator, year):
    try:
        url = f"https://api.worldbank.org/v2/country/{INDIA_CODE}/indicator/{indicator}?date={year}:{year}&format=json"
        r = requests.get(url, timeout=10)
        data = r.json()
        val = data[1][0]["value"]
        if val is None:
            return 0.0
        return float(val)
    except:
        return 0.0


def get_label(year):
    """Next-year economic values (prediction target)"""
    label = {}
    for k, ind in TARGET_INDICATORS.items():
        label[k] = fetch_indicator(ind, year+1)
    return label


# -------------------------------------------------
# Training Loop
# -------------------------------------------------
print("Starting training...")

for epoch in range(EPOCHS):

    total_loss = 0

    for i in tqdm(range(WINDOW, len(YEARS)-1)):

        # -------------------------
        # Build temporal graph seq
        # -------------------------
        graphs = []

        # simulate neutral policy during training
        policy_vector = torch.zeros(7)

        for y in YEARS[i-WINDOW:i]:
            g = load_trade_graph(policy_vector)
            g = g.to(device)
            graphs.append(g)

        # -------------------------
        # Forward pass
        # -------------------------
        outputs = model(graphs)

        # -------------------------
        # True label (India next year)
        # -------------------------
        target_year = YEARS[i]
        label = get_label(target_year)

        loss = 0
        for key in ["gdp","cpi","fx","trade","fdi","res"]:
            pred = outputs[key]
            true = torch.tensor([[label[key]]], dtype=torch.float32).to(device)
            loss += loss_fn(pred, true)

        # -------------------------
        # Backprop
        # -------------------------
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS} Loss: {total_loss:.4f}")

# -----------------------------
# Save trained model
# -----------------------------
torch.save(model.state_dict(), "saved_model.pt")
print("Model saved as saved_model.pt")