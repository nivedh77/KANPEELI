import json
import os
import threading
from datetime import datetime

DATA_DIR = os.path.join(
    os.path.dirname(__file__),
    "data"
)

DATA_FILE = os.path.join(
    DATA_DIR,
    "leaderboard.json"
)

LOCK = threading.Lock()


def ensure_data_file():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump([], file)


def load_leaderboard():
    ensure_data_file()
    with LOCK:
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as file:
                data = json.load(file)
                if isinstance(data, list):
                    return data
                if isinstance(data, dict) and "scores" in data and isinstance(data["scores"], list):
                    return data["scores"]
                return []
        except Exception:
            return []


def save_leaderboard(data):
    ensure_data_file()
    with LOCK:
        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=2)


def add_score(name, score, total, classification, movie_character=None, character_movie=None, character_image=None):
    name = str(name).strip() if name else ""
    if not name:
        name = "Anonymous Eyelash"

    now = datetime.now()
    time_str = now.strftime("%b %d, %H:%M")

    entry = {
        "id": f"lash-{int(now.timestamp() * 1000)}",
        "name": name[:30],
        "score": int(score),
        "lashes": int(total),
        "classification": str(classification or "Citizen"),
        "movie_character": str(movie_character or "Dashamoolam Damu"),
        "character_movie": str(character_movie or "Chattambinadu"),
        "character_image": str(character_image or "/memes/damu_eyes.jpg"),
        "timestamp": time_str
    }

    leaderboard = load_leaderboard()
    leaderboard.append(entry)

    leaderboard.sort(key=lambda item: (item.get("lashes", 0), item.get("score", 0)), reverse=True)
    leaderboard = leaderboard[:100]

    for index, item in enumerate(leaderboard):
        item["rank"] = index + 1

    save_leaderboard(leaderboard)

    for item in leaderboard:
        if item.get("id") == entry["id"]:
            return item

    entry["rank"] = len(leaderboard)
    return entry


def clear_leaderboard():
    with LOCK:
        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump([], file)
    return []


def get_top_scores(limit=30):
    leaderboard = load_leaderboard()
    leaderboard.sort(key=lambda item: (item.get("lashes", 0), item.get("score", 0)), reverse=True)
    leaderboard = leaderboard[:limit]

    for index, item in enumerate(leaderboard):
        item["rank"] = index + 1

    return leaderboard