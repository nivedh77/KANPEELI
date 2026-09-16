import React, {
  useState,
  useRef,
  useEffect
} from "react";

import Camera from "./components/Camera";
import Scanner from "./components/Scanner";
import ResultCard from "./components/ResultCard";
import StatsPanel from "./components/StatsPanel";
import Leaderboard from "./components/Leaderboard";
import MovieEyeShowcase from "./components/MovieEyeShowcase";

import { analyzeImage } from "./services/api";
import {
  playBlinkSound,
  isAudioEnabled,
  setAudioEnabled,
  playStareAlertSound,
  playWhooshSound
} from "./utils/audio";
import { triggerEyelashConfetti } from "./utils/confetti";

function App() {
  const [scanState, setScanState] = useState("idle"); // "idle" | "camera" | "scanning"
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userEyeImage, setUserEyeImage] = useState(null);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // Mouse pupil tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const [eyeStunt, setEyeStunt] = useState("normal"); // "normal" | "shammi" | "damu" | "nagavalli" | "thoma"
  const [fluttering, setFluttering] = useState(false);
  const [secondsWasted, setSecondsWasted] = useState(42890);

  const fileInputRef = useRef(null);
  const eyeContainerRef = useRef(null);

  // Live timer for useless human seconds wasted
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsWasted(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Eye tracking effect
  useEffect(() => {
    function handleMouseMove(e) {
      if (!eyeContainerRef.current) return;
      if (eyeStunt === "shammi") {
        setMousePos({ x: 0, y: 0 });
        return;
      }
      const rect = eyeContainerRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(10, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 15);

      setMousePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    }

    function handleMouseDown() {
      setBlinking(true);
      playBlinkSound();
      setTimeout(() => setBlinking(false), 160);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [eyeStunt]);

  // Damu jitter animation interval
  useEffect(() => {
    if (eyeStunt === "damu") {
      const interval = setInterval(() => {
        setMousePos({
          x: (Math.random() - 0.5) * 16,
          y: (Math.random() - 0.5) * 16
        });
        if (Math.random() > 0.6) {
          setBlinking(true);
          setTimeout(() => setBlinking(false), 90);
        }
      }, 140);
      return () => clearInterval(interval);
    }
  }, [eyeStunt]);

  function handleTickleLashes() {
    setFluttering(true);
    playBlinkSound();
    triggerEyelashConfetti();
    setTimeout(() => setFluttering(false), 1200);
  }

  async function handleImageCaptured(file) {
    setError("");
    const previewUrl = URL.createObjectURL(file);
    setUserEyeImage(previewUrl);
    setScanState("scanning");

    try {
      const data = await analyzeImage(file);

      if (!data.success) {
        throw new Error(data.message || "Failed to analyze image.");
      }

      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Image analysis encountered a catastrophic ocular event.");
      setScanState("idle");
    }
  }

  function handleScanComplete() {
    setScanState("idle");
    setTimeout(() => {
      const el = document.getElementById("submission");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (file) {
      handleImageCaptured(file);
    }
  }

  return (
    <div className="site-wrapper">
      {/* Neo-brutalist Scrolling Marquee Ticker */}
      <div className="ocular-marquee-ticker">
        <div className="marquee-inner">
          <span>⚡ TINKERHUB 3.0 USELESS PROJECTS ⚡ KANPEELI (കൺപീലി) OCULAR RADAR V3.0 ⚡ CURRENT LASH DETACHMENT RISK: 0.04% ⚡ MAXIMUM RECORDED DRAMA INDEX: 99% (NAGAVALLI) ⚡ CERTIFIED BY THE SUPREME TRIBUNAL OF FOLLICULAR INTEGRITY ⚡ SHAMMI IS WATCHING YOUR SYMMETRY 👁️ ⚡ DUBAI-IL ITHOKKE REGULAR PEELIYA ⚡</span>
          <span>⚡ TINKERHUB 3.0 USELESS PROJECTS ⚡ KANPEELI (കൺപീലി) OCULAR RADAR V3.0 ⚡ CURRENT LASH DETACHMENT RISK: 0.04% ⚡ MAXIMUM RECORDED DRAMA INDEX: 99% (NAGAVALLI) ⚡ CERTIFIED BY THE SUPREME TRIBUNAL OF FOLLICULAR INTEGRITY ⚡ SHAMMI IS WATCHING YOUR SYMMETRY 👁️ ⚡ DUBAI-IL ITHOKKE REGULAR PEELIYA ⚡</span>
        </div>
      </div>

      {/* Floating Eyelashes Background Effect */}
      <div className="floating-lashes-bg">
        <span className="float-lash l1">彡</span>
        <span className="float-lash l2">ミ</span>
        <span className="float-lash l3">彡</span>
        <span className="float-lash l4">ミ</span>
        <span className="float-lash l5">彡</span>
      </div>

      {/* -------------------------------------------------------------
          TOP BAR / NAVIGATION WITH KANPEELI LOGO
          ------------------------------------------------------------- */}
      <header className="site-header">
        <a href="#" className="brand-badge">
          <div className="brand-icon-box" style={{ padding: "4px" }}>
            <img
              src="/logo.png"
              alt="Kanpeeli Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div>
            <span className="brand-text">KANPEELI</span>
            <span style={{ display: "block", fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--ink-muted)", lineHeight: 1 }}>
              കൺപീലി // OCULAR QUANTIFICATION
            </span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#evidence" className="nav-link">How it works</a>
          <a href="#showcase" className="nav-link">Cinema Eyes</a>
          <a href="#rankings" className="nav-link">Leaderboard</a>
          
          {/* Interactive Sound Toggle */}
          <button
            type="button"
            className="btn-neo btn-cream btn-sound-toggle"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              setAudioEnabled(next);
              if (next) playBlinkSound();
            }}
            title="Toggle synthesized sound effects"
          >
            {soundOn ? "🔊 SFX ON" : "🔇 SFX OFF"}
          </button>

          <span className="badge-experiment">A TINKERHUB EXPERIMENT</span>
        </nav>
      </header>

      <main className="hero-wrapper">
        {/* -----------------------------------------------------------
            HERO SECTION
            ----------------------------------------------------------- */}
        <section className="hero-content">
          <div className="trusted-pill">
            <span>THE INTERNET'S MOST TRUSTED OCULAR METRIC</span>
            <span className="sparkle-icon">✦</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h1 className="hero-headline">
                HOW MANY<br />
                <span className="coral-highlight">EYELASHES</span><br />
                DO YOU HAVE?
              </h1>

              <p className="hero-subtext">
                Finally, a leaderboard for the one statistic your doctor, your bank,
                and your family forgot to ask about. Plus, discover which iconic movie legend
                shares your exact ocular geometry.
              </p>

              {/* Useless Live Global Telemetry Ticker */}
              <div className="hero-useless-stats-ticker">
                <span className="useless-stat-pill">
                  <span className="live-pulse-dot"></span>
                  <span>TIME WASTED:</span>
                  <strong>{secondsWasted.toLocaleString()}s</strong>
                </span>
                <span className="useless-stat-pill">
                  <span>SUSPICION:</span>
                  <strong style={{ color: "#f59e0b" }}>99.4%</strong>
                </span>
                <span className="useless-stat-pill">
                  <span>LASHES SAVED:</span>
                  <strong>0</strong>
                </span>
              </div>
            </div>

            {/* Interactive Eye Tracking Widget with Stunt Modes */}
            <div
              className={`hero-interactive-eyes ${eyeStunt === "nagavalli" ? "nagavalli-mode" : ""} ${eyeStunt === "damu" ? "damu-jitter-mode" : ""} ${fluttering ? "flutter-mode" : ""}`}
              ref={eyeContainerRef}
              title="Move your mouse to look around, click to blink!"
            >
              <div className="eye-strip-header">
                <span>INTERACTIVE OCULAR RADAR</span>
                <span className="live-badge">
                  {eyeStunt === "shammi" ? "⚡ PSYCHO SYMMETRY" : eyeStunt === "damu" ? "🤪 NERVOUS JITTER" : eyeStunt === "nagavalli" ? "🔥 THEKKINI WRATH" : eyeStunt === "thoma" ? "🕶️ RAY-BAN MASS" : "● LIVE TRACK"}
                </span>
              </div>

              <div className="eye-balls-row" style={{ position: "relative" }}>
                {/* Left Eye */}
                <div className={`eye-ball ${blinking ? "blinking" : ""}`}>
                  <div
                    className="eye-pupil"
                    style={{
                      transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
                    }}
                  >
                    <div className="pupil-glare"></div>
                  </div>
                  <div className="eye-lashes-top">
                    <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                  </div>
                </div>

                {/* Right Eye */}
                <div className={`eye-ball ${blinking ? "blinking" : ""}`}>
                  <div
                    className="eye-pupil"
                    style={{
                      transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
                    }}
                  >
                    <div className="pupil-glare"></div>
                  </div>
                  <div className="eye-lashes-top">
                    <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                  </div>
                </div>

                {/* Ray-Ban Sunglasses Graphic Overlay */}
                {eyeStunt === "thoma" && (
                  <svg className="rayban-glasses-overlay" viewBox="0 0 200 60" fill="none">
                    <path d="M 20,12 C 45,10 75,12 85,22 C 92,30 88,52 65,56 C 35,60 15,48 12,32 C 10,22 12,14 20,12 Z" fill="#0f172a" fillOpacity="0.94" stroke="#d97706" strokeWidth="2.5" />
                    <path d="M 22,18 C 35,16 55,20 62,32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
                    <path d="M 115,22 C 125,12 155,10 180,12 C 188,14 190,22 188,32 C 185,48 165,60 135,56 C 112,52 108,30 115,22 Z" fill="#0f172a" fillOpacity="0.94" stroke="#d97706" strokeWidth="2.5" />
                    <path d="M 138,32 C 145,20 165,16 178,18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
                    <path d="M 85,22 Q 100,18 115,22" stroke="#d97706" strokeWidth="3" fill="none" />
                    <path d="M 30,12 L 170,12" stroke="#d97706" strokeWidth="2" />
                    <text x="68" y="32" fill="#d97706" fontSize="5" fontWeight="900" fontFamily="sans-serif">SPADIKAM</text>
                  </svg>
                )}
              </div>

              <span className="eye-tracking-caption">Move cursor to track // Click to blink</span>

              {/* Ocular Stunt Presets Bar */}
              <div className="ocular-stunts-panel">
                <span className="stunt-label">⚡ RADAR STUNT PRESETS:</span>
                <div className="ocular-stunts-row">
                  <button
                    type="button"
                    className={`stunt-btn ${eyeStunt === "normal" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setEyeStunt("normal"); playWhooshSound(); }}
                  >
                    👁️ Normal
                  </button>
                  <button
                    type="button"
                    className={`stunt-btn ${eyeStunt === "shammi" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setEyeStunt("shammi"); playStareAlertSound(); }}
                  >
                    ⚡ Shammi
                  </button>
                  <button
                    type="button"
                    className={`stunt-btn ${eyeStunt === "damu" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setEyeStunt("damu"); playBlinkSound(); }}
                  >
                    🤪 Damu
                  </button>
                  <button
                    type="button"
                    className={`stunt-btn ${eyeStunt === "nagavalli" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setEyeStunt("nagavalli"); playStareAlertSound(); }}
                  >
                    🔥 Nagavalli
                  </button>
                  <button
                    type="button"
                    className={`stunt-btn ${eyeStunt === "thoma" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setEyeStunt("thoma"); playWhooshSound(); }}
                  >
                    🕶️ Ray-Ban
                  </button>
                  <button
                    type="button"
                    className="stunt-btn tickle-btn"
                    onClick={(e) => { e.stopPropagation(); handleTickleLashes(); }}
                    title="Tickle eyelashes for confetti burst!"
                  >
                    🪶 Tickle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="hero-divider" />
        </section>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: "#fee2e2",
            border: "var(--border-thick)",
            boxShadow: "var(--shadow-neo-sm)",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            color: "#991b1b",
            fontWeight: 600,
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError("")}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* -----------------------------------------------------------
            SECTION 01: SUBMIT EVIDENCE
            ----------------------------------------------------------- */}
        <section className="evidence-section" id="evidence">
          <div className="ribbon-sticker">NO LOGIN. NO DIGNITY.</div>

          <span className="section-tag">01 / SUBMIT EVIDENCE</span>

          <h2 className="evidence-title">
            Put your<br />
            <span className="lime-highlight">best face</span><br />
            forward.
          </h2>

          <p className="evidence-body">
            Position your eyes inside the viewfinder or upload a close-up photo.
            Our high-precision Blackhat morphology extracts your exact eyelash count, calculates your bilateral
            symmetry, and pairs you with your cinema eye twin.
          </p>

          <div className="tip-banner">
            <span>ℹ️</span>
            <span>Camera automatically opens at 2.0x macro ocular zoom for crystal-clear eyelash detection.</span>
          </div>

          {/* Camera Viewfinder Embed */}
          {scanState === "camera" && (
            <Camera
              onImageCaptured={handleImageCaptured}
              onBack={() => setScanState("idle")}
            />
          )}

          {/* Scanning Progress Embed */}
          {scanState === "scanning" && (
            <Scanner
              userEyeImage={userEyeImage}
              analysisResult={analysisResult}
              onComplete={handleScanComplete}
            />
          )}

          {/* Idle Action Buttons */}
          {scanState === "idle" && (
            <div className="action-row">
              <button
                className="btn-neo btn-lime"
                onClick={() => setScanState("camera")}
              >
                📸 Launch 2x Macro Camera Scanner
              </button>

              <button
                className="btn-neo btn-cream"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload Photo File
              </button>

              <a
                href="#submission"
                className="btn-neo btn-dark"
                style={{ color: "#ffffff" }}
              >
                ✏️ Manual Count / View Card ↓
              </a>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
          )}
        </section>

        {/* -----------------------------------------------------------
            CINEMA EYE ARCHIVES (ONLY THE EYES)
            ----------------------------------------------------------- */}
        <div id="showcase">
          <MovieEyeShowcase />
        </div>

        {/* -----------------------------------------------------------
            SECTION 02: YOUR OFFICIAL SUBMISSION & MEME CARD
            ----------------------------------------------------------- */}
        <ResultCard
          result={analysisResult}
          userEyeImage={userEyeImage}
          onScoreSubmitted={() => setRefreshTrigger(c => c + 1)}
          initialLashes={146}
        />

        {/* -----------------------------------------------------------
            DIAGNOSTIC TELEMETRY & GAUGES
            ----------------------------------------------------------- */}
        {analysisResult && (
          <div style={{ marginBottom: "3.5rem" }}>
            <StatsPanel result={analysisResult} />
          </div>
        )}

        {/* -----------------------------------------------------------
            SECTION 03: THE PUBLIC RECORD
            ----------------------------------------------------------- */}
        <Leaderboard refreshTrigger={refreshTrigger} />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <p>
          <strong>KANPEELI (കൺപീലി)</strong> is an entirely useless innovation created for <strong>TinkerHub 3.0 Useless Projects</strong>.
        </p>
        <p style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>
          No eyelashes were permanently harmed. Ranking algorithm precision: delightfully questionable.
        </p>
      </footer>
    </div>
  );
}

export default App;