import json
import os
import shutil
import tempfile
import threading
from datetime import datetime

ORIGINAL_DATA_FILE = os.path.join(
    os.path.dirname(__file__),
    "data",
    "leaderboard.json"
)

# On serverless platforms like Vercel Lambda, the deployed app directory is read-only.
# We store dynamic data in /tmp, seeding from bundled data if available.
IS_SERVERLESS = bool(os.environ.get("VERCEL")) or not os.access(os.path.dirname(__file__), os.W_OK)

if IS_SERVERLESS:
    DATA_DIR = os.path.join(tempfile.gettempdir(), "kannpeeli_data")
    DATA_FILE = os.path.join(DATA_DIR, "leaderboard.json")
else:
    DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
    DATA_FILE = ORIGINAL_DATA_FILE

LOCK = threading.Lock()
_IN_MEMORY_CACHE = None


def ensure_data_file():
    global _IN_MEMORY_CACHE
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(DATA_FILE):
            if os.path.exists(ORIGINAL_DATA_FILE):
                try:
                    shutil.copyfile(ORIGINAL_DATA_FILE, DATA_FILE)
                except Exception:
                    with open(DATA_FILE, "w", encoding="utf-8") as file:
                        json.dump([], file)
            else:
                with open(DATA_FILE, "w", encoding="utf-8") as file:
                    json.dump([], file)
    except Exception as err:
        print(f"Notice: Read-only or restricted filesystem ({err}). Using in-memory store.")
        if _IN_MEMORY_CACHE is None:
            if os.path.exists(ORIGINAL_DATA_FILE):
                try:
                    with open(ORIGINAL_DATA_FILE, "r", encoding="utf-8") as f:
                        _IN_MEMORY_CACHE = json.load(f)
                except Exception:
                    _IN_MEMORY_CACHE = []
            else:
                _IN_MEMORY_CACHE = []


def load_leaderboard():
    global _IN_MEMORY_CACHE
    ensure_data_file()
    with LOCK:
        try:
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    if isinstance(data, list):
                        _IN_MEMORY_CACHE = data
                        return data
                    if isinstance(data, dict) and "scores" in data and isinstance(data["scores"], list):
                        _IN_MEMORY_CACHE = data["scores"]
                        return data["scores"]
        except Exception:
            pass
        if _IN_MEMORY_CACHE is not None:
            return list(_IN_MEMORY_CACHE)
        return []


def save_leaderboard(data):
    global _IN_MEMORY_CACHE
    ensure_data_file()
    with LOCK:
        _IN_MEMORY_CACHE = list(data)
        try:
            with open(DATA_FILE, "w", encoding="utf-8") as file:
                json.dump(data, file, indent=2)
        except Exception as err:
            print(f"Notice: Leaderboard saved to memory cache ({err})")


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