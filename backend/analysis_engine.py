"""
LASH-3000 / KANNPEELI Analysis Engine
Computes deterministic pseudo-scientific scores, archetypal classifications, and satirical metrics.
Matches subjects to iconic Malayalam/Indian cinema movie character eye crops.
"""

def clamp(val, low, high):
    return max(low, min(val, high))


def calculate_lash_score(total, symmetry, density, length):
    score = (
        (total * 0.45) +
        (symmetry * 0.35) +
        (density * 0.12) +
        (length * 0.08)
    )
    return int(clamp(round(score), 7, 99))


def determine_classification(total, symmetry, density, difference):
    if difference >= 14:
        return "Asymmetrical Rebel"
    elif symmetry >= 95 and total >= 40:
        return "Suspiciously Symmetrical Android"
    elif total >= 65:
        return "Spider Leg Overlord"
    elif total >= 50 and density >= 60:
        return "Aristocratic Whisps of Glory"
    elif total >= 45 and symmetry < 75:
        return "Chaotic Caterpillar Canopy"
    elif density >= 75:
        return "Dense Ocular Rainforest"
    elif total <= 18:
        return "Desert Tumbleweed Whispers"
    elif density <= 20:
        return "Minimalist Aerodynamic Lashes"
    elif symmetry >= 90:
        return "Architecturally Sound Follicles"
    else:
        return "Certified Ocular Hair Enthusiast"


def determine_personality(total, symmetry, drama_index, suspicion_level):
    if drama_index > 75:
        return "Extreme Main Character Blink Energy"
    elif suspicion_level > 80:
        return "Clinically Deceptive Flutter Frequency"
    elif symmetry > 92:
        return "Terrifyingly Orderly Perfectionist"
    elif total > 60:
        return "Unregulated Draft & Breeze Provoker"
    elif symmetry < 65:
        return "Chaotic Neutral Ocular Anarchist"
    elif total < 22:
        return "Humble Low-Drag Aerodynamicist"
    else:
        return "Standard-Issue Biological Observer"


def determine_density_rating(density):
    if density >= 75:
        return "Event Horizon (Impenetrable)"
    elif density >= 55:
        return "Lush Amazonian Canopy"
    elif density >= 35:
        return "Suburban Botanical Garden"
    elif density >= 18:
        return "Modest Shrubbery"
    else:
        return "Barren Tundra"


def match_movie_meme(total, symmetry, drama_index, suspicion_level, difference):
    """
    Matches the user's ocular profile to iconic cinema movie character eye crops.
    """
    # 1. High Drama -> Nagavalli (Shobana in Manichitrathazhu)
    if drama_index >= 70:
        return {
            "id": "nagavalli",
            "character": "Nagavalli (Ganga)",
            "movie": "Manichitrathazhu",
            "actor": "Shobana",
            "quote": "Vidamaatte? Pure Ocular Drama!",
            "match_pct": int(clamp(drama_index + 6, 88, 99)),
            "reason": f"Your extreme Drama Index ({drama_index}%) matched the legendary classical eyes of Nagavalli.",
            "image": "/memes/nagavalli_eyes.jpg"
        }

    # 2. High Suspicion -> Dashamoolam Damu (Suraj Venjaramoodu in Chattambinadu)
    if suspicion_level >= 65:
        return {
            "id": "damu",
            "character": "Dashamoolam Damu",
            "movie": "Chattambinadu",
            "actor": "Suraj Venjaramoodu",
            "quote": "Enne thallalle ammove... ith ente natural peeliya!",
            "match_pct": int(clamp(suspicion_level + 8, 88, 98)),
            "reason": f"Suspicion Level ({suspicion_level}%) detected. Your rapid blink rate matches Damu's nervous eyes under police interrogation.",
            "image": "/memes/damu_eyes.jpg"
        }

    # 3. Terrifying High Symmetry -> Shammi The Hero (Fahadh Faasil in Kumbalangi Nights)
    if symmetry >= 90:
        return {
            "id": "shammi",
            "character": "Shammi The Hero",
            "movie": "Kumbalangi Nights",
            "actor": "Fahadh Faasil",
            "quote": "Shammi hero aada... hero!",
            "match_pct": int(clamp(symmetry, 91, 99)),
            "reason": f"Your terrifyingly perfect {symmetry}% symmetry matches Shammi's unblinking mirror psycho stare.",
            "image": "/memes/shammi_eyes.jpg"
        }

    # 4. Large Disparity / Rebel -> Aadu Thoma (Mohanlal in Spadikam)
    if difference >= 8:
        return {
            "id": "aadu_thoma",
            "character": "Aadu Thoma",
            "movie": "Spadikam",
            "actor": "Mohanlal",
            "quote": "Ray-Ban vechu nokkiyatha... Mass!",
            "match_pct": 95,
            "reason": f"Follicle disparity of {difference} lashes. One eye carries pure renegade Ray-Ban mass attitude.",
            "image": "/memes/aadu_thoma_eyes.jpg"
        }

    # 5. Heavy Count / Volume -> Manavalan (Salim Kumar in Pulival Kalyanam)
    if total >= 48:
        return {
            "id": "manavalan",
            "character": "Manavalan & Co.",
            "movie": "Pulival Kalyanam",
            "actor": "Salim Kumar",
            "quote": "Dubai-il ithokke regular peeliya!",
            "match_pct": 94,
            "reason": f"A lavish {total} lashes detected. International business-class follicular swagger.",
            "image": "/memes/manavalan_eyes.jpg"
        }

    # 6. Low Count / Minimalist -> Ramanan (Harisree Ashokan in Punjabi House)
    if total <= 24:
        return {
            "id": "ramanan",
            "character": "Ramanan",
            "movie": "Punjabi House",
            "actor": "Harisree Ashokan",
            "quote": "Mudalali... idhellam kanakkano?!",
            "match_pct": 93,
            "reason": f"Only {total} eyelashes found. Overworked and underpaid follicles enduring life's turbulence.",
            "image": "/memes/ramanan_eyes.jpg"
        }

    # 7. Reel Culture / Modern Screen Wear -> The Gen-Z Zoomer
    if suspicion_level <= 45 or (total >= 28 and total <= 38 and difference <= 3):
        return {
            "id": "zoomer",
            "character": "The Gen-Z Zoomer",
            "movie": "Premalu / Reel Culture",
            "actor": "Naslen / Modern Youth",
            "quote": "Bro ith real peeliya bro... literally no cap fr fr!",
            "match_pct": 91,
            "reason": "Infinite scroll ocular wear detected. 18 hours of continuous reel exposure.",
            "image": "/memes/zoomer_eyes.svg"
        }

    # 8. Default -> Kumbidi (Jagathy Sreekumar in Nandanam)
    return {
        "id": "kumbidi",
        "character": "Kumbidi",
        "movie": "Nandanam",
        "actor": "Jagathy Sreekumar",
        "quote": "Evide nokkiyaalum Kumbidi!",
        "match_pct": 89,
        "reason": "Mysterious, elusive ocular energy that defies standard optical science.",
        "image": "/memes/kumbidi_eyes.jpg"
    }


def analyze_results(detector_result):
    lashes = detector_result.get("lashes", {"total": 30, "left": 15, "right": 15})
    symmetry = detector_result.get("symmetry", {"score": 85.0, "difference": 2})
    metrics = detector_result.get("metrics", {"density": 40.0, "length_score": 45.0, "confidence": 75})

    total = lashes.get("total", 30)
    left = lashes.get("left", 15)
    right = lashes.get("right", 15)
    sym_score = symmetry.get("score", 85.0)
    difference = symmetry.get("difference", abs(left - right))
    density = metrics.get("density", 40.0)
    length = metrics.get("length_score", 45.0)

    drama_index = int(clamp(round((difference * 4.2) + (length * 0.5) + (total * 0.3)), 12, 99))
    suspicion_level = int(clamp(round(abs(sym_score - 82.5) * 2.8 + (100 - metrics.get("confidence", 70)) * 0.4), 8, 97))
    density_rating = determine_density_rating(density)

    lash_score = calculate_lash_score(total, sym_score, density, length)
    classification = determine_classification(total, sym_score, density, difference)
    personality = determine_personality(total, sym_score, drama_index, suspicion_level)

    meme_match = match_movie_meme(total, sym_score, drama_index, suspicion_level, difference)

    return {
        "lash_score": lash_score,
        "classification": classification,
        "personality": personality,
        "meme_match": meme_match,
        "metrics": {
            "density_rating": density_rating,
            "drama_index": drama_index,
            "suspicion_level": suspicion_level
        }
    }