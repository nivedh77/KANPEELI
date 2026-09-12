from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

from eyelash_detector import analyze_image
from analysis_engine import analyze_results
from roast_engine import generate_roast, generate_verdict
from data_store import add_score, get_top_scores, clear_leaderboard

app = FastAPI(
    title="KANNPEELI",
    description="കൺപീലി (Kannpeeli) - Ocular Hair Quantification & Movie Eye Doppelgänger - TinkerHub 3.0",
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

import os
from starlette.responses import FileResponse

DIST_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

# --------------------------------------------------
# Root & Health
# --------------------------------------------------
@app.get("/")
def root():
    index_file = os.path.join(DIST_PATH, "index.html")
    if os.path.isfile(index_file):
        return FileResponse(index_file)
    return {
        "message": "KANNPEELI online.",
        "brand": "കൺപീലി",
        "purpose": "Counting things nobody asked us to count.",
        "status": "operational",
        "version": "3.3.0"
    }



@app.get("/health")
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
            "message": "The KANNPEELI core suffered an ocular overload.",
            "error": str(error)
        }


# --------------------------------------------------
# Leaderboard Endpoints
# --------------------------------------------------
@app.get("/leaderboard")
def get_leaderboard_endpoint():
    scores = get_top_scores(30)
    return {
        "success": True,
        "entries": scores,
        "scores": scores
    }


@app.post("/leaderboard")
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
def reset_leaderboard_endpoint():
    scores = clear_leaderboard()
    return {
        "success": True,
        "message": "Leaderboard wiped clean.",
        "entries": scores
    }


# --------------------------------------------------
# Static Frontend Serving (All-in-One Deployment)
# --------------------------------------------------
from fastapi.staticfiles import StaticFiles

if os.path.isdir(DIST_PATH):
    assets_dir = os.path.join(DIST_PATH, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    memes_dir = os.path.join(DIST_PATH, "memes")
    if os.path.isdir(memes_dir):
        app.mount("/memes", StaticFiles(directory=memes_dir), name="memes")

    audio_dir = os.path.join(DIST_PATH, "audio")
    if os.path.isdir(audio_dir):
        app.mount("/audio", StaticFiles(directory=audio_dir), name="audio")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        # Don't intercept API routes
        if full_path in ["analyze", "leaderboard", "health", "metrics", "docs", "openapi.json"]:
            return {"error": "Endpoint not found"}
        target = os.path.join(DIST_PATH, full_path)
        if full_path and os.path.isfile(target):
            return FileResponse(target)
        index_file = os.path.join(DIST_PATH, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build not found"}