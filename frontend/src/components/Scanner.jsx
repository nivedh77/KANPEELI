import React, {
  useEffect,
  useState,
  useRef
} from "react";
import {
  playScanLaserSound,
  playTickSound,
  playSuccessChime,
  playRevealFanfare
} from "../utils/audio";

const RAGEBAIT_STEPS = [
  {
    targetProgress: 28,
    speed: 120,
    msg: "Booting quantum ocular particle collider... Hold your gaze with extreme military discipline.",
    tag: "PHASE 01 // GEOMETRY CAPTURE"
  },
  {
    targetProgress: 58,
    speed: 140,
    msg: "Isolating left vs right ocular follicles... 24... 68... 112... Wait, is that an eyebrow hair pretending to be an eyelash?",
    tag: "PHASE 02 // FOLLICULAR AUDIT"
  },
  {
    targetProgress: 94,
    speed: 160,
    msg: "Cross-referencing Mohanlal, Fahadh & Suraj Venjaramoodu archives for ocular drama index...",
    tag: "PHASE 03 // CINEMA RECOGNITION"
  },
  {
    // The famous ragebait reset!
    targetProgress: 32,
    isReset: true,
    speed: 250,
    msg: "🚨 SCAN ABORTED! Did you just think about blinking? Resetting entire laser matrix back to 32%...",
    tag: "FATAL OCULAR PENALTY // BLINK REFLEX DETECTED"
  },
  {
    targetProgress: 68,
    speed: 130,
    msg: "Recalibrating from scratch... Checking Kerala Police Cyber Cell to verify if these eyelashes are licensed.",
    tag: "PHASE 04 // FORENSIC BACKGROUND CHECK"
  },
  {
    targetProgress: 88,
    speed: 150,
    msg: "Contacting Dashamoolam Damu's legal team regarding unauthorized use of suspicious blink patterns...",
    tag: "PHASE 05 // LEGAL PRECEDENT DISPUTE"
  },
  {
    targetProgress: 99,
    speed: 280,
    msg: "Progress: 99.8%... Buffering... Downloading 4.2GB useless high-definition shader pack for tear ducts...",
    tag: "PHASE 06 // DELIBERATE SERVER PROCRASTINATION"
  },
  {
    targetProgress: 100,
    speed: 80,
    msg: "Ocular quantification finalized! The AI has developed an overwhelming personal opinion about your face.",
    tag: "PHASE 07 // DECREE PREPARED"
  }
];

function Scanner({
  userEyeImage,
  analysisResult,
  onComplete
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(10);
  const [isGlitching, setIsGlitching] = useState(false);
  const [scanZoom, setScanZoom] = useState(1.8);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [scanComplete, setScanComplete] = useState(false);
  const previewBoxRef = useRef(null);

  // Wheel zoom on the scanner preview box
  useEffect(() => {
    const box = previewBoxRef.current;
    if (!box) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      setScanZoom(prev => {
        const next = Math.max(1.0, Math.min(4.0, +(prev + delta).toFixed(2)));
        if (next !== prev) playTickSound();
        return next;
      });
    };

    box.addEventListener("wheel", handleWheel, { passive: false });
    return () => box.removeEventListener("wheel", handleWheel);
  }, []);

  // Ragebait progression loop
  useEffect(() => {
    playScanLaserSound();

    let timeoutId;
    let active = true;

    function runStep(stepIdx) {
      if (!active) return;
      if (stepIdx >= RAGEBAIT_STEPS.length) {
        setScanComplete(true);
        playRevealFanfare();
        return;
      }

      const step = RAGEBAIT_STEPS[stepIdx];
      setCurrentStep(stepIdx);

      if (step.isReset) {
        // Trigger comedic glitch shockwave
        setIsGlitching(true);
        playTickSound();
        setTimeout(() => setIsGlitching(false), 500);
      }

      // Animate progress to target
      const startProg = progress;
      const targetProg = step.targetProgress;
      const diff = targetProg - startProg;
      const stepCount = 18;
      let count = 0;

      const interval = setInterval(() => {
        if (!active) {
          clearInterval(interval);
          return;
        }
        count++;
        const ratio = count / stepCount;
        setProgress(Math.round(startProg + diff * ratio));

        if (count % 3 === 0) {
          playTickSound();
        }

        if (count >= stepCount) {
          clearInterval(interval);
          setProgress(targetProg);
          timeoutId = setTimeout(() => {
            runStep(stepIdx + 1);
          }, step.speed * 8);
        }
      }, step.speed);
    }

    runStep(0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const stepInfo = RAGEBAIT_STEPS[currentStep] || RAGEBAIT_STEPS[RAGEBAIT_STEPS.length - 1];

  // Generate customized humorous commentary
  const totalLashes = analysisResult?.lashes?.total || 146;
  const symmetry = analysisResult?.symmetry?.score || 91;
  const memeChar = analysisResult?.meme_match?.character || "Shammi The Hero";
  const memeFilm = analysisResult?.meme_match?.movie || "Kumbalangi Nights";

  const commentaryTitle = totalLashes > 180 
    ? "EXCESSIVE FOLLICULAR EXTRAVAGANZA DETECTED"
    : totalLashes > 120 
    ? "MEDIOCRE BUT STRUCTURALLY ADEQUATE LASHES"
    : "SPARSE AERODYNAMIC WIND-TUNNEL SPECIMEN";

  const commentaryBody = totalLashes > 180
    ? `We counted ${totalLashes} eyelashes. Frankly, you are causing an unregulated atmospheric draft every time you blink. Your ocular twin is ${memeChar} (${memeFilm}), meaning you radiate terrifying cinematic swagger and zero humility.`
    : totalLashes > 120
    ? `We counted ${totalLashes} eyelashes with a suspicious ${symmetry}% symmetry score. Your left eye looks like an overworked software engineer on a Friday deployment, while your right eye is plotting a Kumbalangi Nights psychological coup. Twin match: ${memeChar}.`
    : `We counted ${totalLashes} aerodynamic lashes. In an emergency, your face encounters minimal air resistance. Ramanan from Punjabi House would be weeping tears of solidarity. Twin match: ${memeChar}.`;

  return (
    <div className={`camera-embed-card scanner-outer-card ${isGlitching ? "ragebait-glitch-active" : ""}`}>
      {/* Animated Glowing Laser Beam */}
      <div className="scanner-laser-beam"></div>

      <div className="scanner-header-row">
        <div>
          <span className="section-tag" style={{ color: "var(--lime-accent)" }}>
            01.B // RIGOROUS OCULAR FOLICULE INVESTIGATION
          </span>
          <h3 className="scanner-main-headline">
            {scanComplete ? "Inspection Finalized!" : "Auditing Your Ocular Geometry..."}
          </h3>
        </div>
        <span className="scanner-live-pulse-badge">
          {scanComplete ? "✓ AUDIT COMPLETE" : "● LASERS ENGAGED"}
        </span>
      </div>

      {/* -------------------------------------------------------------
          INTERACTIVE EYE ZOOM SCROLLER (DURING SCAN)
          ------------------------------------------------------------- */}
      <div className="scanner-specimen-inspection-area">
        <div className="scanner-zoom-toolbar">
          <div className="scanner-zoom-label-group">
            <span style={{ fontSize: "1.1rem" }}>🔍</span>
            <span className="scanner-zoom-title">LIVE SPECIMEN ZOOM SCROLLER:</span>
            <span className="scanner-zoom-val-badge">{scanZoom.toFixed(1)}x</span>
          </div>

          <div className="scanner-zoom-scroller-controls">
            <button
              type="button"
              className="scanner-zoom-btn"
              onClick={() => {
                setScanZoom(prev => Math.max(1.0, +(prev - 0.25).toFixed(2)));
                playTickSound();
              }}
              title="Zoom out"
            >
              −
            </button>

            {/* Tactile Range Scroller */}
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={scanZoom}
              onChange={e => setScanZoom(parseFloat(e.target.value))}
              className="scanner-notch-scroller"
              aria-label="Specimen Zoom Scroller"
            />

            <button
              type="button"
              className="scanner-zoom-btn"
              onClick={() => {
                setScanZoom(prev => Math.min(4.0, +(prev + 0.25).toFixed(2)));
                playTickSound();
              }}
              title="Zoom in"
            >
              +
            </button>

            <button
              type="button"
              className="scanner-reset-zoom-btn"
              onClick={() => {
                setScanZoom(1.0);
                playTickSound();
              }}
            >
              1.0x Fit
            </button>
          </div>
        </div>

        {/* Viewfinder Frame with User Image */}
        <div
          ref={previewBoxRef}
          className="scanner-eye-frame"
          title="Scroll mouse wheel over image to zoom in/out while scanning"
        >
          {userEyeImage ? (
            <img
              src={userEyeImage}
              alt="Scanning Eye Specimen"
              className="scanner-eye-image"
              style={{
                transform: `scale(${scanZoom})`,
                transformOrigin: `${pan.x}% ${pan.y}%`,
                transition: "transform 0.15s ease-out"
              }}
            />
          ) : (
            <div className="scanner-synthetic-eye">
              <span style={{ fontSize: "3rem" }}>👁️</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--lime-accent)" }}>
                ANALYZING REAL-TIME OCULAR SPECIMEN
              </span>
            </div>
          )}

          <div className="eye-strip-scanline"></div>
          <div className="scanner-target-reticle">
            <div className="target-cross-h"></div>
            <div className="target-cross-v"></div>
            <div className="target-box-center"></div>
          </div>

          <div className="scanner-corner-tag top-left">
            <span>ZOOM: {scanZoom.toFixed(1)}X</span>
          </div>
          <div className="scanner-corner-tag top-right">
            <span>STATUS: {scanComplete ? "COUNT LOCKED" : "COUNTING LASHES"}</span>
          </div>
          <div className="scanner-corner-tag bottom-left">
            <span>SPECIMEN #01-A</span>
          </div>
        </div>

        <div className="scanner-hint-text">
          💡 Scroll mouse wheel or drag slider to inspect your follicles up close while lasers compute.
        </div>
      </div>

      {/* -------------------------------------------------------------
          RAGEBAIT STATUS CONSOLE & PROGRESS BAR
          ------------------------------------------------------------- */}
      {!scanComplete ? (
        <div className="scanner-console-box">
          <div className="console-tag-badge">
            {stepInfo.tag}
          </div>

          <div className="console-msg-text">
            &gt; {stepInfo.msg}
          </div>

          {/* Progress Bar with Percentage */}
          <div className="scanner-progress-container">
            <div className="scanner-progress-bar-track">
              <div
                className="scanner-progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="scanner-progress-pct-badge">{progress}%</span>
          </div>

          <p className="scanner-warning-footer">
            ⚠️ DO NOT BLINK. DO NOT THINK. ANY UNNECESSARY EYELID FLUTTER WILL EXTEND CALCULATION BY 45 SECONDS.
          </p>
        </div>
      ) : (
        /* -----------------------------------------------------------
           POST-SCANNING OCULAR COMMENTARY (THE ROAST & REVEAL)
           ----------------------------------------------------------- */
        <div className="scanner-commentary-card">
          <div className="commentary-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.4rem" }}>🗣️</span>
              <span className="commentary-tag">AI OCULAR COMMENTARY & ROAST</span>
            </div>
            <span className="commentary-status-pill">OFFICIAL DECREE READY</span>
          </div>

          <h4 className="commentary-headline">
            {commentaryTitle}
          </h4>

          <div className="commentary-bubble">
            <span className="commentary-quote-mark">“</span>
            <p className="commentary-text">
              {commentaryBody}
            </p>
          </div>

          <div className="commentary-metrics-row">
            <div className="commentary-metric-pill">
              <span>LASH COUNT:</span>
              <strong>{totalLashes} FOLLICLES</strong>
            </div>
            <div className="commentary-metric-pill">
              <span>SYMMETRY:</span>
              <strong>{symmetry}%</strong>
            </div>
            <div className="commentary-metric-pill">
              <span>CINEMA TWIN:</span>
              <strong>{memeChar.toUpperCase()}</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-neo btn-lime commentary-proceed-btn"
            onClick={() => {
              playSuccessChime();
              if (onComplete) onComplete();
            }}
          >
            🎓 Proceed to Official Shame & Claim Diploma ↓
          </button>
        </div>
      )}
    </div>
  );
}

export default Scanner;