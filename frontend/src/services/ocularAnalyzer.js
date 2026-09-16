/**
 * KANNPEELI In-Browser Ocular Computer Vision Analyzer
 * Runs directly on client-side HTML5 Canvas.
 * Extracts ocular edges, follicular dark micro-ridges, and computes
 * deterministic eyelash quantification metrics, bilateral symmetry,
 * drama index, and matches iconic Kerala cinema legends.
 */

export const MOVIE_CHARACTERS = [
  {
    id: "damu",
    character: "Dashamoolam Damu",
    movie: "Chattambinadu",
    actor: "Suraj Venjaramoodu",
    image: "/memes/damu_eyes.jpg",
    fallbackImage: "/memes/damu.svg",
    trait: "High Suspicion & Rapid Blink",
    quote: "Enne thallalle ammove... ith ente natural peeliya!",
    baseFollicles: 142,
    threatLevel: "EXTREME PANIC"
  },
  {
    id: "shammi",
    character: "Shammi The Hero",
    movie: "Kumbalangi Nights",
    actor: "Fahadh Faasil",
    image: "/memes/shammi_eyes.jpg",
    fallbackImage: "/memes/shammi.svg",
    trait: "Terrifying 99% Symmetry",
    quote: "Shammi hero aada... hero!",
    baseFollicles: 178,
    threatLevel: "PSYCHO SYMMETRY"
  },
  {
    id: "aadu_thoma",
    character: "Aadu Thoma",
    movie: "Spadikam",
    actor: "Mohanlal",
    image: "/memes/aadu_thoma_eyes.jpg",
    fallbackImage: "/memes/aadu_thoma.svg",
    trait: "Disparity & Ray-Ban Attitude",
    quote: "Ray-Ban vechu nokkiyatha... Mass!",
    baseFollicles: 195,
    threatLevel: "MASS LASH POWER"
  },
  {
    id: "nagavalli",
    character: "Nagavalli (Ganga)",
    movie: "Manichitrathazhu",
    actor: "Shobana",
    image: "/memes/nagavalli_eyes.jpg",
    fallbackImage: "/memes/nagavalli.svg",
    trait: "Extreme Classical Drama",
    quote: "Vidamaatte? Pure Ocular Drama!",
    baseFollicles: 212,
    threatLevel: "THEKKINI CALAMITY"
  },
  {
    id: "manavalan",
    character: "Manavalan & Co.",
    movie: "Pulival Kalyanam",
    actor: "Salim Kumar",
    image: "/memes/manavalan_eyes.jpg",
    fallbackImage: "/memes/manavalan.svg",
    trait: "Heavy Volume & Swagger",
    quote: "Dubai-il ithokke regular peeliya!",
    baseFollicles: 165,
    threatLevel: "DUBAI GULF FLUTTER"
  },
  {
    id: "ramanan",
    character: "Ramanan",
    movie: "Punjabi House",
    actor: "Harisree Ashokan",
    image: "/memes/ramanan_eyes.jpg",
    fallbackImage: "/memes/ramanan.svg",
    trait: "Minimalist Follicles",
    quote: "Mudalali... idhellam kanakkano?!",
    baseFollicles: 88,
    threatLevel: "UNPAID WAGE FATIGUE"
  },
  {
    id: "kumbidi",
    character: "Kumbidi",
    movie: "Nandanam",
    actor: "Jagathy Sreekumar",
    image: "/memes/kumbidi_eyes.jpg",
    fallbackImage: "/memes/kumbidi.svg",
    trait: "Elusive Quantum Stare",
    quote: "Evide nokkiyaalum Kumbidi!",
    baseFollicles: 155,
    threatLevel: "QUANTUM DISAPPEARANCE"
  },
  {
    id: "zoomer",
    character: "The Gen-Z Zoomer",
    movie: "Premalu / Reel Culture",
    actor: "Naslen / Modern Youth",
    image: "/memes/zoomer_eyes.svg",
    fallbackImage: "/memes/zoomer_eyes.svg",
    trait: "Infinite Scroll & Screen Stare",
    quote: "Bro ith real peeliya bro... literally no cap fr fr!",
    baseFollicles: 130,
    threatLevel: "18HR REEL ROT"
  }
];

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

/**
 * Loads an image from a File or Blob into an HTMLImageElement
 */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error("Unable to decode ocular image element: " + err));
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Analyzes an eye photo using Canvas computer-vision algorithms
 */
export async function analyzeImageClient(file) {
  let img;
  try {
    img = await loadImageFromFile(file);
  } catch (err) {
    console.warn("Could not load image file directly, using fallback calculations:", err);
  }

  // Create canvas for analysis
  const canvas = document.createElement("canvas");
  const targetW = 320;
  const targetH = 200;
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  let leftEdgeDensity = 0;
  let rightEdgeDensity = 0;
  let darkPixelRatio = 0;
  let contrastVariance = 0;

  if (img && img.width > 0 && img.height > 0) {
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const pixels = imgData.data;

    // Convert to grayscale & run 1D/2D Sobel edge energy accumulator
    const gray = new Float32Array(targetW * targetH);
    let totalLuminance = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const idx = i / 4;
      gray[idx] = lum;
      totalLuminance += lum;
    }

    const avgLum = totalLuminance / (targetW * targetH);

    // Analyze ocular bands: eyelashes are primarily concentrated in the middle-horizontal bands
    const topBand = Math.floor(targetH * 0.2);
    const botBand = Math.floor(targetH * 0.85);
    const halfW = Math.floor(targetW / 2);

    let leftEdges = 0;
    let rightEdges = 0;
    let darkPixels = 0;
    let varianceSum = 0;

    for (let y = topBand; y < botBand; y++) {
      for (let x = 1; x < targetW - 1; x++) {
        const idx = y * targetW + x;
        const current = gray[idx];

        // Horizontal and vertical gradients
        const gx = Math.abs(gray[idx + 1] - gray[idx - 1]);
        const gy = Math.abs(gray[idx + targetW] - gray[idx - targetW]);
        const grad = gx + gy;

        // Eyelash follicles produce sharp dark micro-ridges
        if (grad > 38 && current < avgLum * 1.1) {
          if (x < halfW) {
            leftEdges++;
          } else {
            rightEdges++;
          }
        }

        if (current < avgLum * 0.75) {
          darkPixels++;
        }

        const diff = current - avgLum;
        varianceSum += diff * diff;
      }
    }

    const bandPixels = (botBand - topBand) * targetW;
    leftEdgeDensity = leftEdges / (bandPixels / 2);
    rightEdgeDensity = rightEdges / (bandPixels / 2);
    darkPixelRatio = darkPixels / bandPixels;
    contrastVariance = Math.sqrt(varianceSum / bandPixels);
  } else {
    // Deterministic fallback based on file metadata
    const hash = Math.abs(
      (file.name || "eyelash").split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) +
      (file.size || 42890)
    );
    leftEdgeDensity = 0.08 + (hash % 50) / 500;
    rightEdgeDensity = 0.08 + ((hash >> 3) % 50) / 500;
    darkPixelRatio = 0.15 + (hash % 30) / 200;
    contrastVariance = 45 + (hash % 40);
  }

  // Derive eyelash counts from micro-edge densities
  // Normal human range: approx 90 to 220 lashes across both eyes
  const baseLeft = Math.round(55 + leftEdgeDensity * 480);
  const baseRight = Math.round(55 + rightEdgeDensity * 480);

  const leftLashes = clamp(baseLeft, 38, 125);
  const rightLashes = clamp(baseRight, 38, 125);
  const totalLashes = leftLashes + rightLashes;

  // Bilateral symmetry calculation
  const difference = Math.abs(leftLashes - rightLashes);
  const maxSide = Math.max(leftLashes, rightLashes);
  const rawSymmetry = maxSide > 0 ? (1 - difference / maxSide) * 100 : 92;
  const symmetryScore = +clamp(rawSymmetry, 32, 99.8).toFixed(1);

  // Drama index: driven by follicle disparity, contrast variance, and total count
  const dramaIndex = Math.round(
    clamp((difference * 4.4) + (contrastVariance * 0.5) + (totalLashes * 0.15), 14, 99)
  );

  // Suspicion level: rapid blink probability, subtle asymmetries
  const suspicionLevel = Math.round(
    clamp(Math.abs(symmetryScore - 83) * 2.6 + (darkPixelRatio * 100) * 0.4 + 20, 12, 99)
  );

  // Follicle density score (0 - 100)
  const densityScore = +clamp(darkPixelRatio * 280, 15, 98).toFixed(1);
  const lengthScore = +clamp(40 + (contrastVariance * 0.4), 20, 95).toFixed(1);

  // Calculate overall Kannpeeli lash score
  const lashScore = Math.round(
    clamp(totalLashes * 0.42 + symmetryScore * 0.35 + densityScore * 0.15 + lengthScore * 0.08, 10, 99)
  );

  // Archetypal Classification
  let classification = "Certified Ocular Hair Enthusiast";
  if (difference >= 14) {
    classification = "Asymmetrical Rebel";
  } else if (symmetryScore >= 96 && totalLashes >= 140) {
    classification = "Suspiciously Symmetrical Android";
  } else if (totalLashes >= 190) {
    classification = "Spider Leg Overlord";
  } else if (totalLashes >= 160 && densityScore >= 60) {
    classification = "Aristocratic Whisps of Glory";
  } else if (totalLashes >= 140 && symmetryScore < 75) {
    classification = "Chaotic Caterpillar Canopy";
  } else if (densityScore >= 75) {
    classification = "Dense Ocular Rainforest";
  } else if (totalLashes <= 95) {
    classification = "Minimalist Aerodynamic Lashes";
  } else if (symmetryScore >= 90) {
    classification = "Architecturally Sound Follicles";
  }

  // Personality Assessment
  let personality = "Standard-Issue Biological Observer";
  if (dramaIndex > 80) {
    personality = "Extreme Main Character Blink Energy";
  } else if (suspicionLevel > 82) {
    personality = "Clinically Deceptive Flutter Frequency";
  } else if (symmetryScore > 94) {
    personality = "Terrifyingly Orderly Perfectionist";
  } else if (totalLashes > 175) {
    personality = "Unregulated Draft & Breeze Provoker";
  } else if (symmetryScore < 65) {
    personality = "Chaotic Neutral Ocular Anarchist";
  } else if (totalLashes < 100) {
    personality = "Humble Low-Drag Aerodynamicist";
  }

  // Density Rating Text
  let densityRating = "Suburban Botanical Garden";
  if (densityScore >= 75) densityRating = "Event Horizon (Impenetrable)";
  else if (densityScore >= 55) densityRating = "Lush Amazonian Canopy";
  else if (densityScore >= 35) densityRating = "Suburban Botanical Garden";
  else if (densityScore >= 18) densityRating = "Modest Shrubbery";
  else densityRating = "Barren Tundra";

  // Match Cinema Doppelgänger across all 8 characters
  const memeMatch = matchMovieCharacter({
    total: totalLashes,
    symmetry: symmetryScore,
    drama: dramaIndex,
    suspicion: suspicionLevel,
    difference
  });

  // Generate Roast Commentary
  const roast = generateSatiricalRoast({
    total: totalLashes,
    left: leftLashes,
    right: rightLashes,
    symmetry: symmetryScore,
    drama: dramaIndex,
    character: memeMatch.character,
    movie: memeMatch.movie
  });

  // Generate Verdict Summary
  const verdict = {
    summary: `Verified ${totalLashes} ocular follicles with ${symmetryScore}% symmetry. Registered as ${classification}.`,
    action: `Issued certificate of zero economic value. Cinema twin confirmed as ${memeMatch.character}.`
  };

  return {
    success: true,
    lashes: {
      total: totalLashes,
      left: leftLashes,
      right: rightLashes
    },
    symmetry: {
      score: symmetryScore,
      difference
    },
    metrics: {
      density: densityScore,
      density_rating: densityRating,
      length_score: lengthScore,
      confidence: 96,
      drama_index: dramaIndex,
      suspicion_level: suspicionLevel
    },
    classification,
    personality,
    lash_score: lashScore,
    meme_match: memeMatch,
    roast: {
      message: roast
    },
    verdict,
    face: { detected: true },
    eyes: { count: 2 },
    detection: {
      method: "Client-Side High-Precision Blackhat Ocular Fourier Filter",
      resolution: `${targetW}x${targetH}`
    },
    image: null
  };
}

/**
 * Matches ocular geometry against all 8 iconic Kerala cinema legends
 */
function matchMovieCharacter({ total, symmetry, drama, suspicion, difference }) {
  // 1. Extreme Drama -> Nagavalli
  if (drama >= 78) {
    return {
      id: "nagavalli",
      character: "Nagavalli (Ganga)",
      movie: "Manichitrathazhu",
      actor: "Shobana",
      quote: "Vidamaatte? Pure Ocular Drama!",
      match_pct: clamp(drama + 4, 88, 99),
      reason: `Your extreme Drama Index (${drama}%) matched the legendary classical eyes of Nagavalli.`,
      image: "/memes/nagavalli_eyes.jpg",
      fallbackImage: "/memes/nagavalli.svg"
    };
  }

  // 2. High Suspicion -> Dashamoolam Damu
  if (suspicion >= 74) {
    return {
      id: "damu",
      character: "Dashamoolam Damu",
      movie: "Chattambinadu",
      actor: "Suraj Venjaramoodu",
      quote: "Enne thallalle ammove... ith ente natural peeliya!",
      match_pct: clamp(suspicion + 5, 88, 98),
      reason: `Suspicion Level (${suspicion}%) detected. Your rapid nervous blink frequency matches Damu under police interrogation.`,
      image: "/memes/damu_eyes.jpg",
      fallbackImage: "/memes/damu.svg"
    };
  }

  // 3. Psycho Symmetry -> Shammi The Hero
  if (symmetry >= 92) {
    return {
      id: "shammi",
      character: "Shammi The Hero",
      movie: "Kumbalangi Nights",
      actor: "Fahadh Faasil",
      quote: "Shammi hero aada... hero!",
      match_pct: clamp(Math.round(symmetry), 92, 99),
      reason: `Your terrifyingly perfect ${symmetry}% symmetry matches Shammi's unblinking mirror psycho stare.`,
      image: "/memes/shammi_eyes.jpg",
      fallbackImage: "/memes/shammi.svg"
    };
  }

  // 4. Follicle Disparity / Mass Renegade -> Aadu Thoma
  if (difference >= 8) {
    return {
      id: "aadu_thoma",
      character: "Aadu Thoma",
      movie: "Spadikam",
      actor: "Mohanlal",
      quote: "Ray-Ban vechu nokkiyatha... Mass!",
      match_pct: 95,
      reason: `Follicle disparity of ${difference} lashes. One eye carries pure renegade Ray-Ban mass swagger.`,
      image: "/memes/aadu_thoma_eyes.jpg",
      fallbackImage: "/memes/aadu_thoma.svg"
    };
  }

  // 5. Heavy Volume / Lavish Count -> Manavalan & Co.
  if (total >= 165) {
    return {
      id: "manavalan",
      character: "Manavalan & Co.",
      movie: "Pulival Kalyanam",
      actor: "Salim Kumar",
      quote: "Dubai-il ithokke regular peeliya!",
      match_pct: 94,
      reason: `A lavish ${total} lashes detected. International business-class follicular swagger.`,
      image: "/memes/manavalan_eyes.jpg",
      fallbackImage: "/memes/manavalan.svg"
    };
  }

  // 6. Low Count / Minimalist Lashes -> Ramanan
  if (total <= 105) {
    return {
      id: "ramanan",
      character: "Ramanan",
      movie: "Punjabi House",
      actor: "Harisree Ashokan",
      quote: "Mudalali... idhellam kanakkano?!",
      match_pct: 93,
      reason: `Only ${total} eyelashes found. Overworked and underpaid follicles enduring life's turbulence.`,
      image: "/memes/ramanan_eyes.jpg",
      fallbackImage: "/memes/ramanan.svg"
    };
  }

  // 7. Reel Rot / Modern Youth -> The Gen-Z Zoomer
  if (suspicion < 45 || (total >= 115 && total <= 145 && difference <= 5)) {
    return {
      id: "zoomer",
      character: "The Gen-Z Zoomer",
      movie: "Premalu / Reel Culture",
      actor: "Naslen / Modern Youth",
      quote: "Bro ith real peeliya bro... literally no cap fr fr!",
      match_pct: 91,
      reason: "Infinite scroll ocular wear detected. 18 hours of continuous reel exposure.",
      image: "/memes/zoomer_eyes.svg",
      fallbackImage: "/memes/zoomer_eyes.svg"
    };
  }

  // 8. Default / Mysterious -> Kumbidi
  return {
    id: "kumbidi",
    character: "Kumbidi",
    movie: "Nandanam",
    actor: "Jagathy Sreekumar",
    quote: "Evide nokkiyaalum Kumbidi!",
    match_pct: 90,
    reason: "Mysterious, elusive ocular energy that defies standard optical science.",
    image: "/memes/kumbidi_eyes.jpg",
    fallbackImage: "/memes/kumbidi.svg"
  };
}

function generateSatiricalRoast({ total, left, right, symmetry, drama, character, movie }) {
  if (character === "Dashamoolam Damu") {
    return `Enne thallalle ammove! We detected ${total} eyelashes fluttering at an alarming frequency. Kerala Police Cyber Cell has been notified of your suspiciously nervous blink rate.`;
  }
  if (character === "Shammi The Hero") {
    return `Shammi hero aada! With ${symmetry}% symmetry, your eyes look like they were calibrated by a psychopath in front of a mirror with a straight razor.`;
  }
  if (character === "Nagavalli (Ganga)") {
    return `VIDAMAATTE?! A Drama Index of ${drama}%! Ganga's classical Bharatanatyam glare has incinerated our sensor array. Do not look into the Thekkini room.`;
  }
  if (character === "Aadu Thoma") {
    return `Ray-Ban vechu nokkiyatha! Left eye (${left}) and right eye (${right}) are having a full Spadikam dispute. Put on your sunglasses immediately to restore public order.`;
  }
  if (character === "Manavalan & Co.") {
    return `Dubai-il ithokke regular peeliya! ${total} eyelashes is sheer municipal luxury. You are causing an unregulated draft in the Persian Gulf every time you wink.`;
  }
  if (character === "Ramanan") {
    return `Mudalali... idhellam kanakkano?! Only ${total} eyelashes surviving on this face! Even Ramanan at Punjabi House got paid more tea money than this.`;
  }
  if (character === "The Gen-Z Zoomer") {
    return `Bro counted ${total} eyelashes on 4K OLED screen fr fr no cap. Your ocular follicles have memorized the entire Premalu soundtrack.`;
  }
  return `Evide nokkiyaalum Kumbidi! We counted ${total} eyelashes, but when we checked again, half of them had vanished into another dimension!`;
}
