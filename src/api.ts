// ==============================
// API Base URL
// ==============================

const BASE_URL = "http://localhost:8000";

// ==============================
// Predict Sanction Impact
// ==============================

export async function analyzeSanction(policy: any) {
  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policy),
    });

    if (!response.ok) {
      throw new Error("Prediction request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in analyzeSanction:", error);
    throw error;
  }
}


// ==============================
// Explain Specific Metric Dip
// ==============================

export async function explainMetric(payload: {
  metric: string;
  value: number;
  context: any;
}) {
  try {
    const response = await fetch(`${BASE_URL}/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Explanation request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in explainMetric:", error);
    throw error;
  }
}
// ==============================
// Macro Risk API
// ==============================

export async function getMacroRisk(countryCode: string) {
  const response = await fetch("http://localhost:8000/macro-risk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country_code: countryCode }),
  });

  if (!response.ok) {
    throw new Error("Macro risk request failed");
  }

  return await response.json();
}