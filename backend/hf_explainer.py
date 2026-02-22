from transformers import pipeline

# Load once (important)
generator = pipeline("text-generation",model="google/flan-t5-small")

def explain_dip(policy, preds):

    prompt = f"""
    Explain why GDP might decline under this sanction scenario:

    severity={policy.severity}
    financial={policy.financial}
    trade={policy.trade}
    technology={policy.technology}
    energy={policy.energy}

    Model prediction GDP impact={preds['gdp']}

    Give a short economic explanation.
    """

    result = generator(prompt, max_length=100, do_sample=False)

    return result[0]["generated_text"]