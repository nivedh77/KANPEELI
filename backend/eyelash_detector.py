import cv2
import numpy as np
import os

# ---------------------------------------------------------
# Haar cascade paths bundled with OpenCV
# ---------------------------------------------------------
CASCADE_DIR = cv2.data.haarcascades

FACE_CASCADE_PATH = os.path.join(
    CASCADE_DIR,
    "haarcascade_frontalface_default.xml"
)

EYE_CASCADE_PATH = os.path.join(
    CASCADE_DIR,
    "haarcascade_eye_tree_eyeglasses.xml"
)

EYE_ALT_PATH = os.path.join(
    CASCADE_DIR,
    "haarcascade_eye.xml"
)

FACE_CASCADE = cv2.CascadeClassifier(FACE_CASCADE_PATH)
EYE_CASCADE = cv2.CascadeClassifier(EYE_CASCADE_PATH)
EYE_ALT_CASCADE = cv2.CascadeClassifier(EYE_ALT_PATH)


def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def preprocess_eye(eye):
    """
    Preprocess eye image with CLAHE and bilateral filtering to isolate dark lash fibers.
    """
    if eye is None or eye.size == 0:
        return None

    if len(eye.shape) == 3:
        gray = cv2.cvtColor(eye, cv2.COLOR_BGR2GRAY)
    else:
        gray = eye.copy()

    h, w = gray.shape[:2]
    if w < 160 or h < 110:
        gray = cv2.resize(
            gray,
            None,
            fx=2.5,
            fy=2.5,
            interpolation=cv2.INTER_CUBIC
        )

    clahe = cv2.createCLAHE(
        clipLimit=2.8,
        tileGridSize=(8, 8)
    )
    gray = clahe.apply(gray)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    return gray


def count_lashes(eye):
    """
    Deterministic eyelash counter using Blackhat morphology and contour extraction.
    No randomness - identical images yield identical results.
    """
    processed = preprocess_eye(eye)

    if processed is None:
        return {
            "count": 25,
            "density": 40.0,
            "confidence": 60,
            "length_score": 45.0
        }

    # Morphological Blackhat
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    blackhat = cv2.morphologyEx(processed, cv2.MORPH_BLACKHAT, kernel)

    _, threshold = cv2.threshold(
        blackhat,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    small_kernel = np.ones((2, 2), np.uint8)
    threshold = cv2.morphologyEx(threshold, cv2.MORPH_OPEN, small_kernel)

    contours, _ = cv2.findContours(
        threshold,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    candidates = []
    height, width = processed.shape[:2]

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        area = cv2.contourArea(contour)

        if area < 3 or area > width * height * 0.08:
            continue

        aspect_ratio = max(w, h) / max(1, min(w, h))
        if aspect_ratio < 1.3:
            continue

        if y > height * 0.85:
            continue

        candidates.append({
            "x": x, "y": y, "w": w, "h": h, "area": area
        })

    raw_count = len(candidates)

    # Completely deterministic mapping
    if raw_count > 0:
        estimated_count = int(round(raw_count * 0.72 + 14))
    else:
        # Fallback to dark pixel density measurement
        dark_pixels = cv2.countNonZero(threshold)
        estimated_count = int(round((dark_pixels / max(1, width * height)) * 120 + 18))

    estimated_count = clamp(estimated_count, 14, 68)

    occupied = cv2.countNonZero(threshold)
    density = (occupied / float(max(1, width * height))) * 100
    density = clamp(density * 4.5, 10, 95)

    if candidates:
        avg_len = float(np.mean([max(item["w"], item["h"]) for item in candidates]))
    else:
        avg_len = 10.0
    length_score = clamp(avg_len * 4.2, 15, 95)

    confidence = clamp(35 + raw_count * 2, 40, 98)

    return {
        "count": int(estimated_count),
        "density": round(float(density), 1),
        "confidence": int(confidence),
        "length_score": round(float(length_score), 1)
    }


def detect_face(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    faces = FACE_CASCADE.detectMultiScale(
        gray,
        scaleFactor=1.12,
        minNeighbors=4,
        minSize=(90, 90)
    )

    if len(faces) > 0:
        face = max(faces, key=lambda item: item[2] * item[3])
        x, y, w, h = face
        return {
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h),
            "fallback": False
        }

    # Center crop fallback
    ih, iw = image.shape[:2]
    fw = int(iw * 0.65)
    fh = int(ih * 0.75)
    fx = int((iw - fw) / 2)
    fy = int((ih - fh) / 2)

    return {
        "x": fx,
        "y": fy,
        "width": fw,
        "height": fh,
        "fallback": True
    }


def detect_eyes(image, face):
    x, y, w, h = face["x"], face["y"], face["width"], face["height"]
    face_crop = image[max(0, y):min(image.shape[0], y + h), max(0, x):min(image.shape[1], x + w)]
    if face_crop.size == 0:
        return []

    gray = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    upper_h = int(h * 0.65)
    upper_face = gray[0:upper_h, :]

    eyes = EYE_CASCADE.detectMultiScale(
        upper_face,
        scaleFactor=1.08,
        minNeighbors=4,
        minSize=(25, 18)
    )

    if len(eyes) < 2:
        alt_eyes = EYE_ALT_CASCADE.detectMultiScale(
            upper_face,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(22, 16)
        )
        if len(alt_eyes) >= len(eyes):
            eyes = alt_eyes

    detected = []
    for ex, ey, ew, eh in eyes:
        detected.append({
            "x": int(x + ex),
            "y": int(y + ey),
            "width": int(ew),
            "height": int(eh)
        })

    detected.sort(key=lambda eye: eye["x"])
    return detected[:2]


def fallback_eyes(image, face):
    x, y, w, h = face["x"], face["y"], face["width"], face["height"]

    eye_y = int(y + h * 0.28)
    eye_width = int(w * 0.26)
    eye_height = int(h * 0.16)

    left_x = int(x + w * 0.16)
    right_x = int(x + w * 0.58)

    return [
        {
            "x": left_x,
            "y": eye_y,
            "width": eye_width,
            "height": eye_height
        },
        {
            "x": right_x,
            "y": eye_y,
            "width": eye_width,
            "height": eye_height
        }
    ]


import random

NO_EYES_ERRORS = [
    {
        "character": "Dashamoolam Damu",
        "movie": "Chattambinadu",
        "quote": "Ente ammove... kannillaatha aale aadyamaayi kaanuva! Enne thallalle, please show your eyes!",
        "advice": "Dashamoolam Damu searched the entire frame and found ZERO eyes! Are you hiding them from the police?! Please show your eyes clearly.",
        "image": "/memes/damu_eyes.jpg"
    },
    {
        "character": "Shammi The Hero",
        "movie": "Kumbalangi Nights",
        "quote": "Shammi hero aada... direct kannil nokkeda! Kannu kaanikkathe enikku asukham varum!",
        "advice": "Shammi expects an unblinking, direct stare into the camera. No eyes were detected. Stand in good lighting and look into the lens!",
        "image": "/memes/shammi_eyes.jpg"
    },
    {
        "character": "Aadu Thoma",
        "movie": "Spadikam",
        "quote": "Ithu kannaano atho Ray-Ban polum illatha blank space-o?! Kannu nere kaanickeda!",
        "advice": "Aadu Thoma took off his Ray-Bans and still couldn't spot your ocular follicles. Center your eyes inside the viewfinder!",
        "image": "/memes/aadu_thoma_eyes.jpg"
    },
    {
        "character": "Ramanan",
        "movie": "Punjabi House",
        "quote": "Mudalali... idhil kannu thanne illa! Njan veruthe enthu peeliya ennunne?!",
        "advice": "Ramanan is already working overtime for zero salary. He refuses to count eyelashes on a photo with no eyes!",
        "image": "/memes/ramanan_eyes.jpg"
    },
    {
        "character": "Nagavalli",
        "movie": "Manichitrathazhu",
        "quote": "Vidamaatte?! Gangaude kannu polum ithilum vyakthamaanu! Show your eyes before midnight!",
        "advice": "Nagavalli demands pure theatrical ocular drama. She found nothing to gaze into. Please show your eyes!",
        "image": "/memes/nagavalli_eyes.jpg"
    },
    {
        "character": "Manavalan & Co.",
        "movie": "Pulival Kalyanam",
        "quote": "Kannaano atho vere enthenkilumo? Dubai-il inganathe aalkkarillallo!",
        "advice": "Manavalan checked his international ocular manifest and found zero eyes. Please align your face with the camera!",
        "image": "/memes/manavalan_eyes.jpg"
    }
]


def detect_macro_eyes(image):
    """
    Detect eyes across the full image when a close-up macro eye photo is submitted.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    
    eyes = EYE_CASCADE.detectMultiScale(
        gray,
        scaleFactor=1.08,
        minNeighbors=3,
        minSize=(30, 20)
    )
    if len(eyes) < 2:
        alt_eyes = EYE_ALT_CASCADE.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(25, 18)
        )
        if len(alt_eyes) >= len(eyes):
            eyes = alt_eyes

    detected = []
    for ex, ey, ew, eh in eyes:
        detected.append({
            "x": int(ex),
            "y": int(ey),
            "width": int(ew),
            "height": int(eh)
        })
    detected.sort(key=lambda item: item["x"])
    return detected[:2]


def analyze_image(image):
    if image is None or image.size == 0:
        err = random.choice(NO_EYES_ERRORS)
        return {
            "success": False,
            "error_type": "NO_IMAGE_DATA",
            "title": "No Image Received",
            "movie_error": err,
            "message": f"{err['character']}: \"{err['quote']}\""
        }

    # Normalize image dimensions for consistent detection
    ih, iw = image.shape[:2]
    max_dim = max(ih, iw)
    if max_dim > 1280:
        scale = 1280.0 / max_dim
        image = cv2.resize(image, (int(iw * scale), int(ih * scale)), interpolation=cv2.INTER_AREA)

    height, width = image.shape[:2]
    face = detect_face(image)

    eyes = []
    used_fallback = False

    if not face["fallback"]:
        # Face was detected, locate eyes within the face
        eyes = detect_eyes(image, face)
        if len(eyes) < 1:
            # Face found but eyes might be closed or covered
            macro = detect_macro_eyes(image)
            if len(macro) > 0:
                eyes = macro
            else:
                # Check for basic ocular dark contour contrast in upper face
                x, y, w, h = face["x"], face["y"], face["width"], face["height"]
                upper_h = int(h * 0.55)
                upper_face = image[max(0, y):min(image.shape[0], y + upper_h), max(0, x):min(image.shape[1], x + w)]
                if upper_face.size > 0:
                    gray_uf = cv2.cvtColor(upper_face, cv2.COLOR_BGR2GRAY)
                    blur = cv2.GaussianBlur(gray_uf, (7, 7), 0)
                    _, thresh = cv2.threshold(blur, 60, 255, cv2.THRESH_BINARY_INV)
                    dark_ratio = cv2.countNonZero(thresh) / float(max(1, upper_face.shape[0] * upper_face.shape[1]))
                    if dark_ratio > 0.05:
                        eyes = fallback_eyes(image, face)
                        used_fallback = True
    else:
        # No face detected: check if this is a macro eye close-up
        macro = detect_macro_eyes(image)
        if len(macro) >= 1:
            eyes = macro
        else:
            # Check if there is high dark pixel contrast and horizontal ocular features
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            # Threshold to check if image is just blank or non-face
            std_dev = np.std(gray)
            if std_dev > 28:
                # Image has enough texture, check for eye-like dark contours
                blur = cv2.GaussianBlur(gray, (9, 9), 0)
                _, thresh = cv2.threshold(blur, 70, 255, cv2.THRESH_BINARY_INV)
                contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                eye_like = [c for c in contours if 80 < cv2.contourArea(c) < (width * height * 0.25)]
                if len(eye_like) >= 2:
                    eyes = fallback_eyes(image, face)
                    used_fallback = True

    # If STILL no eyes detected -> trigger movie dialogue error!
    if len(eyes) == 0:
        err = random.choice(NO_EYES_ERRORS)
        return {
            "success": False,
            "error_type": "NO_EYES_DETECTED",
            "title": "OCULAR RECOGNITION FAILED // NO EYES DETECTED",
            "movie_error": err,
            "message": f"{err['character']}: \"{err['quote']}\" — {err['advice']}"
        }

    results = []
    for eye in eyes[:2]:
        ex, ey, ew, eh = eye["x"], eye["y"], eye["width"], eye["height"]

        px = int(ew * 0.15)
        py = int(eh * 0.25)

        x1 = clamp(ex - px, 0, width)
        y1 = clamp(ey - py, 0, height)
        x2 = clamp(ex + ew + px, 0, width)
        y2 = clamp(ey + eh + py, 0, height)

        crop = image[y1:y2, x1:x2]
        lash_result = count_lashes(crop)

        results.append({
            **eye,
            **lash_result
        })

    while len(results) < 2:
        results.append({
            "x": 0, "y": 0, "width": 50, "height": 30,
            "count": 26, "density": 35.0, "confidence": 50, "length_score": 45.0
        })

    left = results[0]
    right = results[1]

    total = left["count"] + right["count"]
    difference = abs(left["count"] - right["count"])
    max_count = max(left["count"], right["count"], 1)

    symmetry = (1.0 - (difference / float(max_count))) * 100.0
    symmetry = clamp(symmetry, 15.0, 99.5)

    confidence = (left["confidence"] + right["confidence"]) / 2.0
    density = (left["density"] + right["density"]) / 2.0
    length_score = (left["length_score"] + right["length_score"]) / 2.0

    return {
        "success": True,
        "lashes": {
            "total": int(total),
            "left": int(left["count"]),
            "right": int(right["count"])
        },
        "symmetry": {
            "difference": int(difference),
            "score": round(float(symmetry), 1)
        },
        "metrics": {
            "density": round(float(density), 1),
            "length_score": round(float(length_score), 1),
            "confidence": int(round(confidence))
        },
        "face": face,
        "eyes": results,
        "detection": {
            "used_fallback": used_fallback
        },
        "image": {
            "width": int(width),
            "height": int(height)
        }
    }