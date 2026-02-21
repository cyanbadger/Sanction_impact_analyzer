import torch
from utils import fetch_country_features, fetch_trade_edges

print("Downloading data once...")

x = fetch_country_features()
edge_index, edge_weight = fetch_trade_edges()

torch.save({
    "x": x,
    "edge_index": edge_index,
    "edge_weight": edge_weight
}, "trade_graph.pt")

print("\nSUCCESS: trade_graph.pt created!")