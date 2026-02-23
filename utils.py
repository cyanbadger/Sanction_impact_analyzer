import requests
import torch
from torch_geometric.data import Data

COUNTRIES = ["India", "USA", "China", "EU", "Russia"]
country_to_idx = {c: i for i, c in enumerate(COUNTRIES)}

def fetch_trade_edges():
    """
    Example stub using synthetic mapping.
    Replace endpoint with UN Comtrade or World Bank API.
    """

    # Placeholder values — simulate API response
    trade_flows = [
        ("India", "USA", 0.45),
        ("India", "China", 0.32),
        ("USA", "India", 0.40),
        ("Russia", "India", 0.20),
    ]

    edge_list = []
    weights = []

    for src, tgt, w in trade_flows:
        if src in country_to_idx and tgt in country_to_idx:
            edge_list.append([country_to_idx[src], country_to_idx[tgt]])
            weights.append(w)

    edge_index = torch.tensor(edge_list, dtype=torch.long).t().contiguous()
    edge_weight = torch.tensor(weights, dtype=torch.float)

    return edge_index, edge_weight


def load_trade_graph(policy_vector, feature_dim=8):

    edge_index, edge_weight = fetch_trade_edges()

    num_nodes = len(COUNTRIES)
    x = torch.zeros(num_nodes, feature_dim)

    india_idx = country_to_idx["India"]
    x[india_idx, :len(policy_vector)] = policy_vector

    return Data(x=x, edge_index=edge_index, edge_weight=edge_weight)
