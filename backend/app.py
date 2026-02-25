from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

from model import SanctionImpactGNN
from utils import load_trade_graph

# ==============================
# Initialize FastAPI
# ==============================

app = FastAPI(title="Sanction Impact Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Load GNN Model
# ==============================

print("Loading GNN model...")

gnn_model = SanctionImpactGNN(in_dim=15)
gnn_model.load_state_dict(torch.load("saved_model.pt", map_location="cpu"))
gnn_model.eval()

print("GNN loaded.")

graph_cache = torch.load("trade_graph.pt")
print("Graph cache loaded.")

# ==============================
# Load NLP Model (FLAN-T5)
# ==============================

print("Loading NLP model...")

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
nlp_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

print("NLP model ready.")

# ==============================
# Request Schemas
# ==============================

class PolicyInput(BaseModel):
    severity: float
    financial: int
    trade: int
    technology: int
    energy: int
    issuer_strength: float
    binding: int


class ExplanationInput(BaseModel):
    metric: str
    value: float
    context: dict


# ==============================
# Prediction Endpoint
# ==============================

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

    graphs = []
    for _ in range(5):
        graphs.append(load_trade_graph(policy_vector))

    with torch.no_grad():
        preds = gnn_model(graphs)

    output = {k: float(v.item()) for k, v in preds.items()}

    return output


# ==============================
# NLP Explanation Endpoint
# ==============================

@app.post("/explain")
def explain_metric(data: ExplanationInput):

    prompt = f"""
Task: Explain why there is a dip in {data.metric.upper()}.

Predicted value: {data.value:.2f}

Sanction context:
Severity: {data.context.get('severity')}
Financial sanctions: {data.context.get('financial')}
Trade restrictions: {data.context.get('trade')}
Technology restrictions: {data.context.get('technology')}
Energy sanctions: {data.context.get('energy')}

Explain clearly using macroeconomic transmission channels such as:
- Trade disruption
- Capital flow restrictions
- Investment decline
- Energy supply shocks
- Technology constraints

Keep explanation concise (4–6 sentences).
"""

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = nlp_model.generate(
        **inputs,
        max_new_tokens=120,
        do_sample=True,
        temperature=0.3,
        top_p=0.9,
        repetition_penalty=1.3,
        no_repeat_ngram_size=4,
        early_stopping=True,
    )

    explanation = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {"explanation": explanation}