from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from model import SanctionImpactGNN
from utils import load_trade_graph
from fastapi.middleware.cors import CORSMiddleware

# Hugging Face
from transformers import pipeline

# ---------------- Initialize API ----------------
app = FastAPI(title="Sanction Impact Analyzer API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("Loading GNN model...")

# ---------------- Load GNN ----------------
model = SanctionImpactGNN(in_dim=15)
model.load_state_dict(torch.load("saved_model.pt", map_location="cpu"))
model.eval()

print("GNN loaded.")
# ---------------- Load graph cache ----------------
graph_cache = torch.load("trade_graph.pt")
print("Graph cache loaded.")

# ---------------- Load NLP model ----------------
print("Loading NLP model (FLAN-T5)...")

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
nlp_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")

print("NLP model ready.")

# ---------------- Request schema ----------------
class PolicyInput(BaseModel):
    severity: float
    financial: int
    trade: int
    technology: int
    energy: int
    issuer_strength: float
    binding: int

# ---------------- Explanation function ----------------
def generate_explanation(policy, preds):

    prompt = f"""
You are a macroeconomic analyst.

Explain why GDP changes under sanctions using economic reasoning.

Sanction severity: {policy.severity}
Financial sanctions: {policy.financial}
Trade restrictions: {policy.trade}
Technology restrictions: {policy.technology}
Energy sanctions: {policy.energy}

Predicted GDP impact score: {preds['gdp']:.3f}

Focus on transmission channels like trade disruption, capital flows, and energy shocks.
Give a concise explanation.
"""

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = nlp_model.generate(
        **inputs,
        max_new_tokens=100,
        temperature=0.7,
        top_p=0.9,
        repetition_penalty=1.2,
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# ---------------- Prediction endpoint ----------------
@app.post("/predict")
def predict(policy: PolicyInput):

    # Build policy vector
    policy_vector = torch.tensor([
        policy.severity,
        policy.financial,
        policy.trade,
        policy.technology,
        policy.energy,
        policy.issuer_strength,
        policy.binding
    ], dtype=torch.float32)

    # Build temporal graphs
    graphs = []
    for _ in range(5):
        graphs.append(load_trade_graph(policy_vector))

    # Run GNN
    with torch.no_grad():
        preds = model(graphs)

    # Convert outputs
    output = {k: float(v.item()) for k, v in preds.items()}

    # Generate NLP explanation
    explanation = generate_explanation(policy, output)

    output["explanation"] = explanation

    return output