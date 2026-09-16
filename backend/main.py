import sys
import os

# Ensure current directory is on sys.path for Vercel Serverless execution
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

from eyelash_detector import analyze_image
from analysis_engine import analyze_results
from roast_engine import generate_roast, generate_verdict
from data_store import add_score, get_top_scores, clear_leaderboard

app = FastAPI(
    title="KANPEELI",
    description="കൺപീലി (Kanpeeli) - Ocular Hair Quantification & Movie Eye Doppelgänger - TinkerHub 3.0",
    version="3.3.0"
)

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Root & Health
# --------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "KANPEELI online.",
        "brand": "കൺപീലി",
        "purpose": "Counting things nobody asked us to count.",
        "status": "operational",
        "version": "3.3.0"
    }


@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "online",
        "detector": "operational",
        "analysis_engine": "operational",
        "meme_engine": "operational",
        "roast_engine": "armed",
        "leaderboard": "online"
    }


# --------------------------------------------------
# Analyze Endpoint
# --------------------------------------------------
@app.post("/analyze")
@app.post("/api/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not contents:
            return {
                "success": False,
                "message": "Empty file received. Please provide a photo containing eyes."
            }

        array = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(array, cv2.IMREAD_COLOR)

        if image is None:
            return {
                "success": False,
                "message": "Could not decode image. Please provide a valid JPEG or PNG."
            }

        detector_result = analyze_image(image)
        if not detector_result.get("success", False):
            return detector_result

        analysis = analyze_results(detector_result)
        roast = generate_roast(detector_result, analysis)
        verdict = generate_verdict(detector_result, analysis)

        return {
            "success": True,
            "lashes": detector_result["lashes"],
            "symmetry": detector_result["symmetry"],
            "metrics": {
                **detector_result["metrics"],
                **analysis["metrics"]
            },
            "classification": analysis["classification"],
            "personality": analysis["personality"],
            "lash_score": analysis["lash_score"],
            "meme_match": analysis.get("meme_match"),
            "roast": roast,
            "verdict": verdict,
            "face": detector_result["face"],
            "eyes": detector_result["eyes"],
            "detection": detector_result["detection"],
            "image": detector_result["image"]
        }

    except Exception as error:
        print("ANALYSIS ERROR:", error)
        return {
            "success": False,
            "message": "The KANPEELI core suffered an ocular overload.",
            "error": str(error)
        }


# --------------------------------------------------
# Leaderboard Endpoints
# --------------------------------------------------
@app.get("/leaderboard")
@app.get("/api/leaderboard")
def get_leaderboard_endpoint():
    scores = get_top_scores(30)
    return {
        "success": True,
        "entries": scores,
        "scores": scores
    }


@app.post("/leaderboard")
@app.post("/api/leaderboard")
async def submit_score_endpoint(request: Request):
    try:
        payload = await request.json()
    except Exception:
        payload = {}

    name = payload.get("name", "Anonymous Eyelash")
    score = payload.get("score", 0)
    lashes = payload.get("lashes", payload.get("total", 0))
    classification = payload.get("classification", "Certified Citizen")
    movie_character = payload.get("movie_character")
    character_movie = payload.get("character_movie")
    character_image = payload.get("character_image")

    entry = add_score(
        name, score, lashes, classification,
        movie_character=movie_character,
        character_movie=character_movie,
        character_image=character_image
    )
    scores = get_top_scores(30)

    return {
        "success": True,
        "message": "Your ocular metrics and cinema twin have been recorded.",
        "entry": entry,
        "leaderboard": scores,
        "entries": scores
    }


@app.delete("/leaderboard")
@app.delete("/api/leaderboard")
def reset_leaderboard_endpoint():
    scores = clear_leaderboard()
    return {
        "success": True,
        "message": "Leaderboard wiped clean.",
        "entries": scores
    }