import React, {
  useState,
  useEffect,
  useRef
} from "react";
import { submitScore } from "../services/api";
import {
  playTickSound,
  playRevealFanfare,
  playSuccessChime
} from "../utils/audio";
import { triggerEyelashConfetti } from "../utils/confetti";
import EyelashCertificate from "./EyelashCertificate";

function ResultCard({
  result,
  userEyeImage,
  onScoreSubmitted,
  initialLashes
}) {
  const [name, setName] = useState("");
  const [lashes, setLashes] = useState(146);
  const [displayCount, setDisplayCount] = useState(146);
  const [isAiFixed, setIsAiFixed] = useState(false);
  const [allowManualEdit, setAllowManualEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // When result arrives from AI scan, update and lock the count with animation


  useEffect(() => {
    if (result?.lashes?.total) {
      const targetCount = result.lashes.total;
      setLashes(targetCount);
      setIsAiFixed(true);

      // Play fanfare on cinema reveal
      playRevealFanfare();

      // Animate the counter ticking up
      let current = 0;
      const step = Math.max(1, Math.floor(targetCount / 24));
      const interval = setInterval(() => {
        current += step;
        if (current >= targetCount) {
          setDisplayCount(targetCount);
          clearInterval(interval);
        } else {
          setDisplayCount(current);
          playTickSound();
        }
      }, 35);

      return () => clearInterval(interval);
    } else if (initialLashes) {
      setLashes(initialLashes);
      setDisplayCount(initialLashes);
    }
  }, [result, initialLashes]);

  function decrement() {
    setLashes(prev => {
      const val = Math.max(prev - 1, 0);
      setDisplayCount(val);
      playTickSound();
      return val;
    });
  }

  function increment() {
    setLashes(prev => {
      const val = prev + 1;
      setDisplayCount(val);
      playTickSound();
      return val;
    });
  }

  async function handleSubmit() {
    if (submitting || submitted) return;
    setSubmitting(true);

    try {
      const classification = lashes >= 200 ? "elite" : lashes >= 150 ? "solid" : result?.classification || "modest";
      const score = result?.lash_score || Math.min(Math.round((lashes / 250) * 100), 99);

      const movieData = result?.meme_match ? {
        character: result.meme_match.character,
        movie: result.meme_match.movie,
        image: result.meme_match.image
      } : {
        character: "Dashamoolam Damu",
        movie: "Chattambinadu",
        image: "/memes/damu_eyes.jpg"
      };

      try {
        await submitScore(
          name.trim() || "Anonymous Eyelash",
          score,
          lashes,
          classification,
          movieData
        );
      } catch (err) {
        console.warn("Backend leaderboard unavailable, saving score locally:", err);
        // Resilient fallback: store locally so the user's certificate and score are preserved
        try {
          const localList = JSON.parse(localStorage.getItem("kannpeeli_leaderboard") || "[]");
          localList.unshift({
            id: `lash-local-${Date.now()}`,
            name: name.trim() || "Anonymous Eyelash",
            score: Number(score) || 0,
            lashes: Number(lashes) || 0,
            classification: classification || "Certified Citizen",
            movie_character: movieData?.character || "Dashamoolam Damu",
            character_movie: movieData?.movie || "Chattambinadu",
            character_image: movieData?.image || "/memes/damu_eyes.jpg",
            timestamp: "Just now",
            rank: 1
          });
          localStorage.setItem("kannpeeli_leaderboard", JSON.stringify(localList.slice(0, 50)));
        } catch (storageErr) {
          console.error(storageErr);
        }
      }

      setSubmitted(true);
      playSuccessChime();
      triggerEyelashConfetti();

      if (onScoreSubmitted) {
        onScoreSubmitted();
      }

      // Smoothly scroll to the certificate view
      setTimeout(() => {
        const certEl = document.getElementById("certificate-view");
        if (certEl) {
          certEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const meme = result?.meme_match;

  // -----------------------------------------------------------------
  // POST-SUBMISSION VIEW: RENDER OFFICIAL CERTIFICATE
  // -----------------------------------------------------------------
  if (submitted) {
    return (
      <div className="submission-card-outer submitted-mode" id="submission">
        <EyelashCertificate
          recipientName={name.trim() || "Anonymous Eyelash Sovereign"}
          lashes={lashes}
          leftLashes={result?.lashes?.left}
          rightLashes={result?.lashes?.right}
          symmetry={result?.symmetry?.score || 92}
          dramaIndex={result?.metrics?.drama_index || 84}
          classification={lashes >= 200 ? "elite" : lashes >= 150 ? "solid" : result?.classification || "modest"}
          meme={meme || {
            character: "Dashamoolam Damu",
            movie: "Chattambinadu",
            image: "/memes/damu_eyes.jpg",
            quote: "Enne thallalle ammove... ith ente natural peeliya!",
            match_pct: 95
          }}
          userEyeImage={userEyeImage}
          roast={result?.roast?.message || result?.verdict?.summary || "Your eyelashes have survived our grueling digital inspection."}
          onReset={() => setSubmitted(false)}
        />
      </div>
    );
  }

  // -----------------------------------------------------------------
  // PRE-SUBMISSION FORM VIEW
  // -----------------------------------------------------------------
  return (
    <div className="submission-card-outer" id="submission">
      <div className="ribbon-sticker">NO LOGIN. NO DIGNITY.</div>
      <span className="submission-tag">YOUR OFFICIAL SUBMISSION</span>

      <div className="submission-title-row">
        <div>
          <h3 className="submission-title">Make it count.</h3>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--ink-muted)", marginTop: "0.25rem" }}>
            Declare your lashes, claim your cinema doppelgänger, and receive your official certificate.
          </p>
        </div>
        <span style={{ fontSize: "2rem" }}>📊</span>
      </div>

      {/* -------------------------------------------------------------
          USER'S INPUTTED OCULAR SPECIMEN (IF AVAILABLE)
          ------------------------------------------------------------- */}
      {userEyeImage && (
        <div className="user-inputted-eyes-card">
          <div className="user-eyes-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>👁️</span>
              <span className="user-eyes-title">YOUR INPUTTED OCULAR SPECIMEN</span>
            </div>
            <span className="user-eyes-badge">AI SCANNED & RECORDED</span>
          </div>

          <div className="user-eyes-preview-box">
            <img
              src={userEyeImage}
              alt="Your Inputted Eyes"
              className="user-eyes-img"
            />
            <div className="eye-strip-scanline"></div>
            <span className="eye-strip-label">SUBJECT EYE EVIDENCE // READY FOR CERTIFICATION</span>
            <div className="hud-corner-bracket top-left"></div>
            <div className="hud-corner-bracket top-right"></div>
            <div className="hud-corner-bracket bottom-left"></div>
            <div className="hud-corner-bracket bottom-right"></div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          CINEMA MEME DOPPELGÄNGER (ONLY THE EYES)
          ------------------------------------------------------------- */}
      {meme && (
        <div className="meme-match-card">
          <div className="meme-match-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🎭</span>
              <span className="meme-match-title">CINEMA EYE DOPPELGÄNGER</span>
            </div>
            <span className="meme-match-badge">{meme.match_pct}% OCULAR TWIN</span>
          </div>

          <div className="meme-card-body">
            {/* Cinematic Letterbox Eye Crop */}
            <div className="meme-eye-strip-box">
              <img
                src={meme.image}
                alt={meme.character}
                className="meme-eye-strip-img"
              />
              <div className="eye-strip-scanline"></div>
              <span className="eye-strip-label">EYE ARCHIVE // {meme.movie.toUpperCase()}</span>
              <div className="hud-corner-bracket top-left"></div>
              <div className="hud-corner-bracket top-right"></div>
              <div className="hud-corner-bracket bottom-left"></div>
              <div className="hud-corner-bracket bottom-right"></div>
            </div>

            <div className="meme-info-container">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <span className="meme-movie-tag">{meme.movie}</span>
                <button
                  type="button"
                  className="btn-neo btn-cream"
                  style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                  onClick={() => {
                    const text = `👁️ KANNPEELI RESULT: I have ${lashes} eyelashes and my Cinema Eye Twin is ${meme.character} from ${meme.movie}! "${meme.quote}"`;
                    navigator.clipboard?.writeText(text);
                    alert("Copied your Kannpeeli result to clipboard!");
                  }}
                  title="Copy result to clipboard"
                >
                  📋 Share Twin
                </button>
              </div>
              <h4 className="meme-character-name">{meme.character}</h4>
              
              <div className="meme-dialogue-bubble">
                <span className="dialogue-quote-symbol">“</span>
                <p className="meme-quote-text">{meme.quote}</p>
              </div>



              <p className="meme-reason-text">
                <strong>Ocular Match:</strong> {meme.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          AI CERTIFIED COUNT STATUS BANNER
          ------------------------------------------------------------- */}
      {isAiFixed && result && (
        <div className="ai-certified-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <span className="certified-badge">🔒 AI CERTIFIED FOLLICLE COUNT: {lashes} LASHES</span>
            <button
              type="button"
              className="btn-neo btn-cream"
              style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
              onClick={() => setAllowManualEdit(!allowManualEdit)}
            >
              {allowManualEdit ? "Lock AI Count" : "✏️ Manual Override"}
            </button>
          </div>

          <div className="certified-breakdown-row">
            <span>Left Eye: <strong>{result.lashes?.left} lashes</strong></span>
            <span>Right Eye: <strong>{result.lashes?.right} lashes</strong></span>
            <span>Symmetry: <strong>{result.symmetry?.score}%</strong></span>
            <span>Drama Index: <strong>{result.metrics?.drama_index}%</strong></span>
          </div>

          <p className="certified-roast">"{result.roast?.message}"</p>
        </div>
      )}

      {/* -------------------------------------------------------------
          FORM: NAME & STEPPER
          ------------------------------------------------------------- */}
      <div className="form-group">
        <label className="form-label">NAME OR ALIAS FOR THE DIPLOMA</label>
        <input
          type="text"
          className="neo-input"
          placeholder="e.g. Dashamoolam Damu Jr."
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={35}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          TOTAL EYELASHES {isAiFixed && !allowManualEdit && <span style={{ color: "var(--coral-accent)" }}>(LOCKED TO AI COUNT)</span>}
        </label>
        <div className="stepper-row">
          <div className="stepper-controls">
            <button
              className="stepper-btn btn-minus"
              onClick={decrement}
              type="button"
              disabled={isAiFixed && !allowManualEdit}
              title={isAiFixed && !allowManualEdit ? "Click 'Manual Override' above to modify" : "Decrement"}
            >
              −
            </button>

            <div className="stepper-value-box animated-number">
              {displayCount}
            </div>

            <button
              className="stepper-btn btn-plus"
              onClick={increment}
              type="button"
              disabled={isAiFixed && !allowManualEdit}
              title={isAiFixed && !allowManualEdit ? "Click 'Manual Override' above to modify" : "Increment"}
            >
              +
            </button>
          </div>
          <span className="stepper-hint">
            {isAiFixed
              ? "Calculated directly from your uploaded ocular geometry."
              : "Both eyes included. We are not monsters."}
          </span>
        </div>
      </div>

      <button
        className="btn-neo btn-lime submit-btn-full"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Awarding Official Certificate..." : "🎓 Submit Lashes & Claim Official Certificate ↑"}
      </button>
    </div>
  );
}

export default ResultCard;