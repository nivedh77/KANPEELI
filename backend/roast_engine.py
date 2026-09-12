"""
LASH-3000 Roast Engine
Produces merciless, highly specific roasts and official tribunal decrees
based on eyelash geometry, asymmetry, and drama.
"""

import random


def generate_roast(detector_result, analysis):
    """
    Produces a targeted comedic roast with a punchy title and message.
    """
    total = detector_result.get("lashes", {}).get("total", 30)
    left = detector_result.get("lashes", {}).get("left", 15)
    right = detector_result.get("lashes", {}).get("right", 15)
    diff = detector_result.get("symmetry", {}).get("difference", 0)
    symmetry = detector_result.get("symmetry", {}).get("score", 85.0)
    drama = analysis.get("metrics", {}).get("drama_index", 50)
    classification = analysis.get("classification", "")

    # Highly asymmetrical
    if diff >= 10:
        titles = [
            "Ocular Geopolitical Crisis",
            "The Great Eyelash Schism",
            "One Eye Living in Luxury, One in Austerity",
            "Disputed Eyelash Territory"
        ]
        messages = [
            f"Your left eye has {left} lashes while your right eye has {right}. Did your right eye lose a bet to a rogue gust of wind?",
            f"A {diff}-lash discrepancy suggests your eyes are governed by two entirely separate parliamentary bodies.",
            f"Left eye is attending the Met Gala ({left} lashes), right eye is sleeping on a futon ({right} lashes). Fix the disparity immediately.",
            f"If you blink too quickly, you might create localized aerodynamic turbulence with that {diff}-lash imbalance."
        ]
        return {
            "title": random.choice(titles),
            "message": random.choice(messages)
        }

    # Extremely high count
    if total >= 65:
        titles = [
            "Are You Harvester of Spiders?",
            "Visual Air Filter Detected",
            "Microclimate Generator",
            "Weaponized Flutter Hazard"
        ]
        messages = [
            f"With {total} lashes detected, blinking must feel like slamming velvet blackout curtains against your cheekbones.",
            f"{total} eyelashes is no longer facial hair; that is a registered wildlife sanctuary for microscopic dust mites.",
            f"The National Weather Service has issued a minor wind advisory every time you rapidly blink with all {total} lashes.",
            f"Scientists are studying your eyelids to see if they can be repurposed as high-efficiency furnace filters."
        ]
        return {
            "title": random.choice(titles),
            "message": random.choice(messages)
        }

    # Very sparse
    if total <= 20:
        titles = [
            "Aerodynamic Efficiency Overlord",
            "Low-Drag Minimalist",
            "Eyelashes in Witness Protection",
            "The Follicle Eviction Notice"
        ]
        messages = [
            f"Only {total} eyelashes found. Your face was clearly designed in a wind tunnel for maximum fuel economy.",
            f"We counted {total} eyelashes. The computer ran out of things to count and started counting pixels out of sheer pity.",
            f"Your eyelashes are practicing extreme social distancing. Each follicle requires 2 business days to visit its neighbor.",
            f"{total} lashes total. When you blink, people think you're just nodding very politely."
        ]
        return {
            "title": random.choice(titles),
            "message": random.choice(messages)
        }

    # High symmetry
    if symmetry >= 95:
        titles = [
            "Suspiciously Non-Human Symmetry",
            "Android Unit 7-B Identified",
            "Factory Reset Your Follicles",
            "Geometry Teacher's Dream"
        ]
        messages = [
            f"{symmetry}% symmetry is biologically abnormal. Please provide proof of human citizenship or update your firmware.",
            f"Your lash symmetry is so precise ({left} vs {right}) that NASA is using your eyelids to calibrate orbital mirrors.",
            f"Did you measure these with a millimeter laser caliper before logging onto this website?",
            f"We suspect you are 80% silicone and 20% high-precision servo motors. Blinking at 90Hz is prohibited."
        ]
        return {
            "title": random.choice(titles),
            "message": random.choice(messages)
        }

    # High drama index
    if drama >= 70:
        titles = [
            "Telenovela Level Drama Detected",
            "Passive-Aggressive Blinking Syndrome",
            "Theatrical Air Displacement",
            "Dangerous Levels of Sass"
        ]
        messages = [
            f"With a Drama Index of {drama}%, you could legally sigh and knock over a small cup of espresso with the backdraft.",
            f"Your eyes are communicating things that have been banned under several international maritime treaties.",
            f"One flutter from those eyelids and everyone within a 10-meter radius feels emotionally manipulated.",
            f"Your lashes aren't just protecting your corneas; they are actively auditioning for Broadway."
        ]
        return {
            "title": random.choice(titles),
            "message": random.choice(messages)
        }

    # General balanced roasts
    general_titles = [
        "Clinically Average Hair Arrangement",
        "The Eyelash Equivalent of Plain Toast",
        "Standard Issue Human Foliage",
        "Bureaucratically Approved Lashes"
    ]
    general_messages = [
        f"A respectable {total} lashes ({left} left, {right} right). Nothing to brag about at Thanksgiving dinner, but sufficient to keep gnats away.",
        f"Your lashes hold a solid {analysis.get('lash_score', 50)}/100. Perfectly mediocre. The DMV of facial aesthetics.",
        f"The computer has analyzed your ocular hair and determined you are 100% capable of blinking without causing an international incident.",
        f"Classified as '{classification}'. We tried to find something deeply offensive to say, but your eyelashes are aggressively sensible."
    ]
    return {
        "title": random.choice(general_titles),
        "message": random.choice(general_messages)
    }


def generate_verdict(detector_result, analysis):
    """
    Generates a satirical official tribunal decree.
    """
    total = detector_result.get("lashes", {}).get("total", 30)
    score = analysis.get("lash_score", 50)
    classification = analysis.get("classification", "Citizen")

    verdicts = [
        f"DECREE #3481-B: By sovereign power of the International Ocular Tribunal, the subject's {total} lashes are granted temporary clearance. Score awarded: {score}/100.",
        f"FORMAL NOTICE: Classification '{classification}' has been inscribed onto the permanent useless ledger. Please do not blink erratically in public transit.",
        f"VERDICT: Follicular inspection complete. The subject is deemed non-hazardous to ambient air currents, earning an ocular compliance rating of {score}/100.",
        f"JUDGMENT: The Council approves these lashes for cosmetic operation. In the event of a sudden draft, please seek shelter immediately.",
        f"LEGAL RULING: Ocular hair quantity ({total}) is deemed sufficient for biological existence. No further audits scheduled until next fiscal blink."
    ]

    return random.choice(verdicts)