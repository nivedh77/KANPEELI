import React, { useState, useEffect, useRef } from "react";
import {
  playBlinkSound,
  playStareAlertSound,
  playGlitchBuzzerSound,
  playSuccessChime,
  playWhooshSound
} from "../utils/audio";

const MOVIE_EYES = [
  {
    id: "damu",
    character: "Dashamoolam Damu",
    movie: "Chattambinadu",
    actor: "Suraj Venjaramoodu",
    image: "/memes/damu_eyes.jpg",
    fallbackImage: "/memes/damu.svg",
    trait: "High Suspicion & Rapid Blink",
    quote: "Enne thallalle ammove... ith ente natural peeliya!",
    follicles: 142,
    suspicion: 99,
    symmetry: 34,
    drama: 92,
    threatLevel: "EXTREME PANIC",
    stareRoast: "Damu's chaotic nervous eye twitch caused your optic nerve to surrender in record time! Enne thallalle ammove!"
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
    follicles: 178,
    suspicion: 88,
    symmetry: 99.8,
    drama: 96,
    threatLevel: "PSYCHO SYMMETRY",
    stareRoast: "Shammi stared directly into your soul without blinking once. You blinked. Complete humiliation in front of the barber mirror."
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
    follicles: 195,
    suspicion: 65,
    symmetry: 81,
    drama: 98,
    threatLevel: "MASS LASH POWER",
    stareRoast: "Aadu Thoma adjusted his dark Ray-Bans and gave one side-eye glance. Your eyelids collapsed instantly out of respect!"
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
    follicles: 212,
    suspicion: 100,
    symmetry: 94,
    drama: 100,
    threatLevel: "THEKKINI CALAMITY",
    stareRoast: "VIDAMAATTE?! Ganga's classical Bharatanatyam glare incinerated your cornea. You blinked out of sheer existential terror!"
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
    follicles: 165,
    suspicion: 72,
    symmetry: 68,
    drama: 84,
    threatLevel: "DUBAI GULF FLUTTER",
    stareRoast: "Manavalan says: In Dubai, even the camels blink slower than you! 3 seconds is all you could muster?!"
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
    follicles: 88,
    suspicion: 82,
    symmetry: 55,
    drama: 78,
    threatLevel: "UNPAID WAGE FATIGUE",
    stareRoast: "Mudalali... idhellam kanakkano?! Ramanan didn't even get paid enough tea money to keep both eyes open!"
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
    follicles: 155,
    suspicion: 96,
    symmetry: 87,
    drama: 91,
    threatLevel: "QUANTUM DISAPPEARANCE",
    stareRoast: "You tried to stare at Kumbidi, but where did he go?! Evide nokkiyaalum Kumbidi!"
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
    follicles: 130,
    suspicion: 50,
    symmetry: 78,
    drama: 74,
    threatLevel: "18HR REEL ROT",
    stareRoast: "Bro literally blinked before a 7-second reel could even finish rendering on the algorithm fr fr no cap."
  }
];

function MovieEyeShowcase() {
  const [selectedChar, setSelectedChar] = useState(MOVIE_EYES[1]); // Shammi by default
  const [visionMode, setVisionMode] = useState("raw"); // "raw" | "hud" | "thermal"

  // Stare-down challenge state
  const [stareActive, setStareActive] = useState(false);
  const [stareTimer, setStareTimer] = useState(0);
  const [bestStare, setBestStare] = useState(0);
  const [stareResult, setStareResult] = useState(null); // { time, status: 'lost'|'won', roast }
  const timerRef = useRef(null);
  const showcaseCardRef = useRef(null);

  // Stare-Down Timer Logic
  useEffect(() => {
    if (stareActive) {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setStareTimer(elapsed);
      }, 50);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [stareActive]);

  function handleSelectCharacter(char) {
    setSelectedChar(char);
    setStareActive(false);
    setStareResult(null);
    playWhooshSound();
  }

  function handleSelectAndScroll(char) {
    handleSelectCharacter(char);
    if (showcaseCardRef.current) {
      showcaseCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function startStareBattle() {
    setStareResult(null);
    setStareTimer(0);
    setStareActive(true);
    playStareAlertSound();
  }

  function handleStareBlinked() {
    if (!stareActive) return;
    setStareActive(false);
    playGlitchBuzzerSound();
    const finalTime = stareTimer.toFixed(2);
    if (finalTime > bestStare) {
      setBestStare(finalTime);
    }
    setStareResult({
      time: finalTime,
      status: "lost",
      roast: selectedChar.stareRoast
    });
  }

  function handleStareVictory() {
    if (!stareActive) return;
    setStareActive(false);
    playSuccessChime();
    const finalTime = stareTimer.toFixed(2);
    if (finalTime > bestStare) {
      setBestStare(finalTime);
    }
    setStareResult({
      time: finalTime,
      status: "won",
      roast: `🏆 HEROIC TRIUMPH! You out-stared ${selectedChar.character} for ${finalTime} seconds! Your ocular fortitude is recognized by the Cyber Cell.`
    });
  }

  return (
    <section className="showcase-section" id="cinema-lab">
      {/* Neo-brutalist Section Header */}
      <div className="showcase-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <span className="section-tag coral" style={{ margin: 0 }}>02 / CINEMA OCULAR ARCHIVES</span>
            <span className="badge-experiment" style={{ background: "var(--lime-accent)", color: "var(--ink-black)" }}>
              ⚡ INTERACTIVE STARE BATTLEGROUND
            </span>
          </div>

          <h2 className="showcase-title">
            The Hall of <span className="lime-highlight">Legendary Eyes</span>
          </h2>
          <p className="showcase-subtitle">
            All 8 Malayalam cinema legends are archived below. Switch between legends, toggle biometric vision overlays, test your gaze in the Stare-Down challenge, or explore the full character gallery!
          </p>
        </div>

        <div className="showcase-header-right-badges">
          <div className="showcase-counter-badge">
            👁️ ALL {MOVIE_EYES.length} CINEMA EYE LEGENDS
          </div>
          {bestStare > 0 && (
            <div className="stare-record-badge">
              🏆 BEST STARE: {bestStare}s
            </div>
          )}
        </div>
      </div>

      {/* Characters Pill Bar */}
      <div className="showcase-tabs-row" aria-label="Character tabs">
        {MOVIE_EYES.map(item => (
          <button
            key={item.id}
            type="button"
            className={`showcase-tab-btn ${selectedChar.id === item.id ? "active" : ""}`}
            onClick={() => handleSelectCharacter(item)}
          >
            <span className="tab-character-name">{item.character}</span>
            <span className="tab-film-name">{item.movie}</span>
          </button>
        ))}
      </div>

      {/* Featured Eye Crop Display Card */}
      <div className="showcase-card" ref={showcaseCardRef}>
        {/* Left: Specimen Frame with Vision Modes & Stare Battle */}
        <div className="showcase-eye-column">
          {/* Vision Mode Switcher Toolbar */}
          <div className="vision-mode-toolbar">
            <span className="vision-toolbar-label">VIEWPORT MODE:</span>
            <div className="vision-buttons-group">
              <button
                type="button"
                className={`vision-btn ${visionMode === "raw" ? "active" : ""}`}
                onClick={() => { setVisionMode("raw"); playBlinkSound(); }}
              >
                🎞️ Raw Crop
              </button>
              <button
                type="button"
                className={`vision-btn ${visionMode === "hud" ? "active" : ""}`}
                onClick={() => { setVisionMode("hud"); playBlinkSound(); }}
              >
                🤖 Cyber HUD
              </button>
              <button
                type="button"
                className={`vision-btn ${visionMode === "thermal" ? "active" : ""}`}
                onClick={() => { setVisionMode("thermal"); playBlinkSound(); }}
              >
                🌡️ Drama Heatmap
              </button>
            </div>
          </div>

          {/* Eye Specimen Viewer */}
          <div className={`showcase-eye-preview-box mode-${visionMode} ${stareActive ? "stare-active-glow" : ""}`}>
            <img
              src={selectedChar.image}
              alt={selectedChar.character}
              className={`showcase-eye-img ${visionMode === "thermal" ? "thermal-filter" : ""}`}
              onError={(e) => {
                e.target.src = selectedChar.fallbackImage || "/memes/damu_eyes.jpg";
              }}
            />

            {/* Standard Laser Scanline */}
            <div className="eye-strip-scanline"></div>

            {/* Cyber HUD Overlay elements */}
            {visionMode === "hud" && (
              <div className="cinema-hud-overlay">
                <div className="hud-target-reticle left"></div>
                <div className="hud-target-reticle right"></div>
                <div className="hud-tracking-tag top">FOLLICLE DENSITY: {selectedChar.follicles} u/mm²</div>
                <div className="hud-tracking-tag bottom">SYMMETRY: {selectedChar.symmetry}%</div>
                <div className="hud-grid-matrix"></div>
              </div>
            )}

            {/* Thermal Drama Overlay */}
            {visionMode === "thermal" && (
              <div className="cinema-thermal-overlay">
                <div className="thermal-heat-glow"></div>
                <span className="thermal-indicator-tag">🔥 THERMAL DRAMA: {selectedChar.drama}%</span>
              </div>
            )}

            {/* Stare Active Live Target */}
            {stareActive && (
              <div className="stare-battle-active-overlay">
                <span className="stare-countdown-display">
                  ⏱️ {stareTimer.toFixed(2)}s
                </span>
                <span className="stare-warning-banner">DO NOT BLINK! MAINTAIN DIRECT EYE CONTACT!</span>
              </div>
            )}

            {/* Corner Brackets */}
            <div className="hud-corner-bracket top-left"></div>
            <div className="hud-corner-bracket top-right"></div>
            <div className="hud-corner-bracket bottom-left"></div>
            <div className="hud-corner-bracket bottom-right"></div>

            {/* Character Label Tag */}
            <span className="eye-strip-label">
              {selectedChar.character.toUpperCase()} // {selectedChar.movie.toUpperCase()}
            </span>
          </div>

          {/* Stare Battle Controls Underneath Eye */}
          <div className="stare-battle-control-panel">
            {!stareActive ? (
              <button
                type="button"
                className="btn-neo btn-lime stare-trigger-btn"
                onClick={startStareBattle}
              >
                👁️ Stare-Down Challenge vs {selectedChar.character}
              </button>
            ) : (
              <div className="stare-in-progress-actions">
                <button
                  type="button"
                  className="btn-neo btn-coral blink-surrender-btn"
                  onClick={handleStareBlinked}
                >
                  😵 I BLINKED! (Surrender)
                </button>
                {stareTimer >= 5 && (
                  <button
                    type="button"
                    className="btn-neo btn-lime claim-victory-btn"
                    onClick={handleStareVictory}
                  >
                    🏆 Claim Follicular Victory ({stareTimer.toFixed(1)}s)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Stare Result Callout */}
          {stareResult && (
            <div className={`stare-result-callout ${stareResult.status === "won" ? "won" : "lost"}`}>
              <div className="stare-result-header">
                <strong>{stareResult.status === "won" ? "🎉 STARE VICTORY!" : "🚨 SURRENDER DEFEAT!"}</strong>
                <span>Survived: {stareResult.time}s</span>
              </div>
              <p className="stare-result-roast">{stareResult.roast}</p>
            </div>
          )}
        </div>

        {/* Right: Character Ocular Dossier & Biometrics */}
        <div className="showcase-details">
          <div className="character-dossier-header">
            <div>
              <span className="showcase-actor-tag">PORTRAYED BY {selectedChar.actor.toUpperCase()}</span>
              <h3 className="showcase-char-name">{selectedChar.character}</h3>
              <span className="showcase-movie-badge">FILM: {selectedChar.movie}</span>
            </div>

            <div className="threat-level-badge">
              <span className="threat-title">THREAT LEVEL</span>
              <strong className="threat-val">{selectedChar.threatLevel}</strong>
            </div>
          </div>

          {/* Character Dialogue Quote Bubble */}
          <div className="meme-dialogue-bubble">
            <span className="dialogue-quote-symbol">“</span>
            <p className="meme-quote-text">{selectedChar.quote}</p>
          </div>

          {/* Follicular Metric Telemetry Grid */}
          <div className="character-telemetry-grid">
            <div className="char-stat-box">
              <span className="stat-label">Estimated Lashes</span>
              <strong className="stat-num lime">{selectedChar.follicles}</strong>
              <div className="mini-progress-track">
                <div className="mini-progress-fill lime" style={{ width: `${Math.min(100, (selectedChar.follicles / 220) * 100)}%` }}></div>
              </div>
            </div>

            <div className="char-stat-box">
              <span className="stat-label">Suspicion Index</span>
              <strong className="stat-num coral">{selectedChar.suspicion}%</strong>
              <div className="mini-progress-track">
                <div className="mini-progress-fill coral" style={{ width: `${selectedChar.suspicion}%` }}></div>
              </div>
            </div>

            <div className="char-stat-box">
              <span className="stat-label">Bilateral Symmetry</span>
              <strong className="stat-num cyan">{selectedChar.symmetry}%</strong>
              <div className="mini-progress-track">
                <div className="mini-progress-fill cyan" style={{ width: `${selectedChar.symmetry}%` }}></div>
              </div>
            </div>

            <div className="char-stat-box">
              <span className="stat-label">Drama Multiplier</span>
              <strong className="stat-num gold">{selectedChar.drama}%</strong>
              <div className="mini-progress-track">
                <div className="mini-progress-fill gold" style={{ width: `${selectedChar.drama}%` }}></div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="showcase-status-bar">
            <span>OCULAR RECOGNITION: ACTIVE</span>
            <span>ALGORITHM: BLACKHAT 9x9</span>
            <span>MATCH ACCURACY: 99.4% USELESS</span>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          ALL 8 MOVIE CHARACTERS GALLERY GRID
          Displays all characters simultaneously so users can see every legend
          ----------------------------------------------------------------- */}
      <div className="all-movie-legends-container">
        <div className="all-legends-header">
          <div>
            <span className="section-tag lime">ARCHIVED SPECIMENS</span>
            <h3 className="all-legends-title">All 8 Cinema Eye Legends</h3>
            <p className="all-legends-desc">
              Browse the complete gallery of legendary cinema gazes. Click any character to load them directly into the ocular scanner HUD.
            </p>
          </div>
          <span className="all-legends-count-pill">{MOVIE_EYES.length} PROFILES ARCHIVED</span>
        </div>

        <div className="all-legends-grid">
          {MOVIE_EYES.map(item => {
            const isSelected = selectedChar.id === item.id;
            return (
              <div
                key={item.id}
                className={`legend-card-box ${isSelected ? "selected-legend" : ""}`}
                onClick={() => handleSelectAndScroll(item)}
              >
                {/* Eye Crop Strip */}
                <div className="legend-card-eye-strip">
                  <img
                    src={item.image}
                    alt={item.character}
                    className="legend-card-eye-img"
                    onError={(e) => {
                      e.target.src = item.fallbackImage || "/memes/damu_eyes.jpg";
                    }}
                  />
                  <div className="eye-strip-scanline"></div>
                  <span className="legend-card-threat-tag">{item.threatLevel}</span>
                  {isSelected && <span className="legend-card-active-tag">● ACTIVE IN HUD</span>}
                </div>

                {/* Card Meta Content */}
                <div className="legend-card-body">
                  <div className="legend-card-title-row">
                    <div>
                      <h4 className="legend-card-name">{item.character}</h4>
                      <span className="legend-card-film">{item.movie} ({item.actor})</span>
                    </div>
                  </div>

                  <p className="legend-card-quote">“{item.quote}”</p>

                  <div className="legend-card-stats-row">
                    <span className="legend-stat-pill lime">
                      👁️ <strong>{item.follicles}</strong> lashes
                    </span>
                    <span className="legend-stat-pill coral">
                      ⚠️ <strong>{item.suspicion}%</strong> susp
                    </span>
                    <span className="legend-stat-pill cyan">
                      📐 <strong>{item.symmetry}%</strong> sym
                    </span>
                  </div>

                  <div className="legend-card-actions">
                    <button
                      type="button"
                      className={`btn-neo ${isSelected ? "btn-lime" : "btn-cream"} legend-inspect-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndScroll(item);
                      }}
                    >
                      {isSelected ? "✓ Active in HUD" : "🔍 Load in Viewport"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MovieEyeShowcase;
