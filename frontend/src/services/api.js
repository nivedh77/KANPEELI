import { analyzeImageClient } from "./ocularAnalyzer";

const API_URL = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" ? "/api" : "http://127.0.0.1:8000");

// Initial diverse seed entries covering Kerala cinema icons for the public record
export const DEFAULT_LEADERBOARD = [
  {
    id: "seed-1",
    name: "Shobana Thekkini",
    score: 99,
    lashes: 212,
    classification: "Thekkini Calamity",
    movie_character: "Nagavalli (Ganga)",
    character_movie: "Manichitrathazhu",
    character_image: "/memes/nagavalli_eyes.jpg",
    timestamp: "Earlier today"
  },
  {
    id: "seed-2",
    name: "Spadikam George",
    score: 97,
    lashes: 195,
    classification: "Mass Lash Power",
    movie_character: "Aadu Thoma",
    character_movie: "Spadikam",
    character_image: "/memes/aadu_thoma_eyes.jpg",
    timestamp: "Earlier today"
  },
  {
    id: "seed-3",
    name: "Kumbalangi Barber",
    score: 96,
    lashes: 178,
    classification: "Psycho Symmetry",
    movie_character: "Shammi The Hero",
    character_movie: "Kumbalangi Nights",
    character_image: "/memes/shammi_eyes.jpg",
    timestamp: "1 hr ago"
  },
  {
    id: "seed-4",
    name: "Gulf Returnee",
    score: 92,
    lashes: 165,
    classification: "Dubai Gulf Flutter",
    movie_character: "Manavalan & Co.",
    character_movie: "Pulival Kalyanam",
    character_image: "/memes/manavalan_eyes.jpg",
    timestamp: "2 hrs ago"
  },
  {
    id: "seed-5",
    name: "Nandanam Devotee",
    score: 89,
    lashes: 155,
    classification: "Quantum Disappearance",
    movie_character: "Kumbidi",
    character_movie: "Nandanam",
    character_image: "/memes/kumbidi_eyes.jpg",
    timestamp: "3 hrs ago"
  },
  {
    id: "seed-6",
    name: "Damu's Apprentice",
    score: 84,
    lashes: 142,
    classification: "Extreme Panic Flutter",
    movie_character: "Dashamoolam Damu",
    character_movie: "Chattambinadu",
    character_image: "/memes/damu_eyes.jpg",
    timestamp: "4 hrs ago"
  },
  {
    id: "seed-7",
    name: "Reel Enthusiast Naslen",
    score: 79,
    lashes: 130,
    classification: "18hr Reel Rot",
    movie_character: "The Gen-Z Zoomer",
    character_movie: "Premalu / Reel Culture",
    character_image: "/memes/zoomer_eyes.svg",
    timestamp: "5 hrs ago"
  },
  {
    id: "seed-8",
    name: "Punjabi House Steward",
    score: 72,
    lashes: 88,
    classification: "Unpaid Wage Fatigue",
    movie_character: "Ramanan",
    character_movie: "Punjabi House",
    character_image: "/memes/ramanan_eyes.jpg",
    timestamp: "Yesterday"
  }
];

export async function analyzeImage(file) {
  // First attempt backend API with an abort timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.success) {
        return data;
      }
    }
  } catch (backendError) {
    console.warn("Backend API unavailable or unreachable, utilizing in-browser ocular CV engine:", backendError);
  }

  // Resilient client-side fallback: ensures image analysis NEVER fails on Vercel or offline
  return await analyzeImageClient(file);
}

export async function getLeaderboard() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_URL}/leaderboard`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const list = data.entries || data.scores || [];
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.debug("Backend leaderboard offline, reading local repository:", err);
  }

  // Fallback to local storage or default seed entries
  try {
    const local = JSON.parse(localStorage.getItem("kannpeeli_leaderboard") || "null");
    if (Array.isArray(local) && local.length > 0) {
      return local;
    }
  } catch (e) {
    // Ignore JSON parsing errors
  }

  return DEFAULT_LEADERBOARD;
}

export async function submitScore(name, score, lashes, classification, movieData = {}) {
  const payload = {
    id: `lash-${Date.now()}`,
    name: name || "Anonymous Eyelash",
    score: Number(score) || 0,
    lashes: Number(lashes) || 0,
    classification: classification || "Certified Citizen",
    movie_character: movieData.character || "Dashamoolam Damu",
    character_movie: movieData.movie || "Chattambinadu",
    character_image: movieData.image || "/memes/damu_eyes.jpg",
    timestamp: "Just now"
  };

  // Always save locally first for instant, guaranteed persistence
  try {
    const current = JSON.parse(localStorage.getItem("kannpeeli_leaderboard") || "null") || DEFAULT_LEADERBOARD;
    const updated = [payload, ...current.filter(item => item.id !== payload.id)].slice(0, 40);
    localStorage.setItem("kannpeeli_leaderboard", JSON.stringify(updated));
  } catch (storageErr) {
    console.warn("Local storage error:", storageErr);
  }

  // Also attempt sending to remote server
  try {
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return data.entries || data.leaderboard || [];
    }
  } catch (err) {
    console.debug("Remote leaderboard sync omitted:", err);
  }

  const local = JSON.parse(localStorage.getItem("kannpeeli_leaderboard") || "[]");
  return local;
}

export async function clearLeaderboardApi() {
  try {
    localStorage.removeItem("kannpeeli_leaderboard");
  } catch (e) {}

  try {
    const response = await fetch(`${API_URL}/leaderboard`, {
      method: "DELETE"
    });
    const data = await response.json();
    return data.entries || [];
  } catch (e) {
    return [];
  }
}