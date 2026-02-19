export async function analyzeSanction() {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      severity: 0.8,
      financial: 1,
      trade: 1,
      technology: 0,
      energy: 1,
      issuer_strength: 0.7,
      binding: 1,
    }),
  });

  return response.json();
}
