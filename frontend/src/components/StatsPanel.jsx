import React from "react";

function StatsPanel({ result }) {
  if (!result) return null;

  const metrics = result.metrics || {};
  const symmetry = result.symmetry || { score: 50 };
  const detection = result.detection || {};

  const dramaIndex = metrics.drama_index ?? 50;
  const suspicion = metrics.suspicion_level ?? 50;
  const density = metrics.density ?? 40;
  const lengthScore = metrics.length_score ?? 50;
  const confidence = metrics.confidence ?? 75;

  return (
    <div className="stats-panel-card">
      <div className="stats-header">
        <h3 className="section-title">📊 Completely Unnecessary Biometrics</h3>
        <span className="telemetry-badge">LASH-3000 TELEMETRY</span>
      </div>

      <div className="gauges-grid">
        {/* Drama Index Gauge */}
        <div className="gauge-card">
          <div className="gauge-info">
            <span className="gauge-label">DRAMA INDEX</span>
            <span className="gauge-val drama">{dramaIndex}%</span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-bar-fill drama"
              style={{ width: `${dramaIndex}%` }}
            ></div>
          </div>
          <span className="gauge-desc">Passive-aggressive fluttering intensity</span>
        </div>

        {/* Suspicion Level Gauge */}
        <div className="gauge-card">
          <div className="gauge-info">
            <span className="gauge-label">SUSPICION LEVEL</span>
            <span className="gauge-val suspicion">{suspicion}%</span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-bar-fill suspicion"
              style={{ width: `${suspicion}%` }}
            ></div>
          </div>
          <span className="gauge-desc">Probability of android or undercover operative</span>
        </div>

        {/* Follicular Density */}
        <div className="gauge-card">
          <div className="gauge-info">
            <span className="gauge-label">FOLLICULAR DENSITY</span>
            <span className="gauge-val density">{density}%</span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-bar-fill density"
              style={{ width: `${density}%` }}
            ></div>
          </div>
          <span className="gauge-desc">
            Rating: <strong>{metrics.density_rating || "Standard"}</strong>
          </span>
        </div>

        {/* Fiber Length Rating */}
        <div className="gauge-card">
          <div className="gauge-info">
            <span className="gauge-label">FIBER LENGTH SCORE</span>
            <span className="gauge-val length">{lengthScore}</span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-bar-fill length"
              style={{ width: `${Math.min(lengthScore, 100)}%` }}
            ></div>
          </div>
          <span className="gauge-desc">Aerodynamic drag contribution</span>
        </div>
      </div>

      {/* CV Diagnostics Footer */}
      <div className="cv-diagnostics">
        <div className="diag-item">
          <span className="diag-key">VISION CONFIDENCE:</span>
          <span className="diag-val">{confidence}%</span>
        </div>

        <div className="diag-item">
          <span className="diag-key">DETECTION ALGORITHM:</span>
          <span className="diag-val">
            {detection.used_fallback ? "GEOMETRIC FALLBACK" : "OPENCV HAAR CASCADE"}
          </span>
        </div>

        <div className="diag-item">
          <span className="diag-key">MORPHOLOGY KERNEL:</span>
          <span className="diag-val">BLACKHAT 9x9 ELLIPSE</span>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;