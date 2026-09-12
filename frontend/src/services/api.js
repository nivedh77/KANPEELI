const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }

  return await response.json();
}

export async function getLeaderboard() {
  const response = await fetch(`${API_URL}/leaderboard`);

  if (!response.ok) {
    throw new Error("Could not load leaderboard from KANNPEELI network.");
  }

  const data = await response.json();
  return data.entries || data.scores || [];
}

export async function submitScore(name, score, lashes, classification, movieData = {}) {
  const response = await fetch(`${API_URL}/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name || "Anonymous Eyelash",
      score: Number(score) || 0,
      lashes: Number(lashes) || 0,
      classification: classification || "Certified Citizen",
      movie_character: movieData.character || "Dashamoolam Damu",
      character_movie: movieData.movie || "Chattambinadu",
      character_image: movieData.image || "/memes/damu_eyes.jpg"
    })
  });

  if (!response.ok) {
    throw new Error("Could not register score to leaderboard.");
  }

  const data = await response.json();
  return data.entries || data.leaderboard || [];
}

export async function clearLeaderboardApi() {
  const response = await fetch(`${API_URL}/leaderboard`, {
    method: "DELETE"
  });
  const data = await response.json();
  return data.entries || [];
}