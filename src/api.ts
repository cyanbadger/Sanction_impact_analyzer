export async function analyzeSanction(country: string, sanction: string) {
  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country, sanction }),
  });

  return response.json();
}
