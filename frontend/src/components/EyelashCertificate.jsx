import React, { useRef } from "react";
import { playSuccessChime, playTickSound } from "../utils/audio";
import { triggerEyelashConfetti } from "../utils/confetti";

function EyelashCertificate({
  recipientName = "Anonymous Eyelash Sovereign",
  lashes = 146,
  leftLashes,
  rightLashes,
  symmetry = 92,
  dramaIndex = 84,
  classification = "Solid Follicle Density",
  meme = {
    character: "Shammi The Hero",
    movie: "Kumbalangi Nights",
    image: "/memes/shammi_eyes.jpg",
    quote: "Shammi hero aada... hero!",
    match_pct: 99
  },
  userEyeImage = null,
  roast = "Your eyelashes are currently defying three distinct laws of atmospheric friction and two municipal building codes.",
  onReset
}) {
  const certRef = useRef(null);



  // Compute breakdown if not explicitly provided
  const left = leftLashes !== undefined ? leftLashes : Math.round(lashes * 0.49);
  const right = rightLashes !== undefined ? rightLashes : lashes - left;

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const certId = `KP-FUTILITY-2026-${Math.abs(lashes * 137 + 42).toString().slice(0, 5)}`;

  function handlePrint() {
    playTickSound();
    window.print();
  }

  function handleCopyText() {
    playSuccessChime();
    triggerEyelashConfetti();
    const text = `📜 SUPREME CERTIFICATE OF HEROIC FOLLICULAR FUTILITY 📜
Issued by the Supreme International Tribunal of Zero Economic Value (TinkerHub 3.0)

Recipient: ${recipientName.trim() || "Anonymous"}
Total Verified Follicles: ${lashes} Eyelashes (${left} Left / ${right} Right)
Bilateral Symmetry Rating: ${symmetry}% (Slightly questionable)
Ocular Drama Index: ${dramaIndex}%
Cinema Doppelgänger: ${meme.character} (${meme.movie}) - "${meme.quote}"
Certificate Serial: ${certId}

ARTICLE 1: This certificate bestows zero academic, financial, or biological benefits.
ARTICLE 2: The time spent obtaining this metric is permanently non-refundable.`;
    navigator.clipboard?.writeText(text);
    alert("Official Proclamation copied to clipboard! Share your useless achievement.");
  }

  return (
    <div className="certificate-container" id="certificate-view">
      {/* Top Banner & Quick Controls */}
      <div className="cert-toolbar no-print">
        <div className="cert-toolbar-left">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="cert-celebration-badge">👑 SUPREME DIPLOMA GRANTED!</span>
            <span className="cert-useless-pill">100% USELESS CIVIC ACHIEVEMENT</span>
          </div>
          <span className="cert-toolbar-hint">
            You persevered through our ragebait scanner. You now own the world's most unnecessarily formal eyelash diploma.
          </span>
        </div>
        <div className="cert-toolbar-actions">
          <button
            type="button"
            className="btn-neo btn-lime"
            onClick={handlePrint}
            title="Print or save as high-resolution PDF"
          >
            🖨️ Print / Save Official PDF
          </button>
          <button
            type="button"
            className="btn-neo btn-cream"
            onClick={handleCopyText}
            title="Copy proclamation text summary"
          >
            📋 Copy Proclamation
          </button>
          {onReset && (
            <button
              type="button"
              className="btn-neo btn-dark"
              style={{ color: "#ffffff" }}
              onClick={onReset}
            >
              ↺ Subject Another Victim
            </button>
          )}
        </div>
      </div>

      {/* The Printable Certificate Diploma */}
      <div className="certificate-card printable-certificate" ref={certRef}>
        {/* Certificate Ornate Border */}
        <div className="cert-border-outer">
          <div className="cert-border-inner">
            
            {/* Latin / Ceremonial Motto Banner */}
            <div className="cert-latin-banner">
              <span>⚜ LEX FOLLICULORUM INUTILIS ⚜</span>
              <span>ANNO DOMINI 2026 // DECRETUM REDUNDANTIAE</span>
              <span>⚜ NIL POSSIBILIS AD OCULOS ⚜</span>
            </div>

            {/* Header / Seal Title */}
            <div className="cert-header">
              <div className="cert-heraldry">
                <span className="cert-emblem-star">★ ★ ★</span>
                <span className="cert-org-name">TINKERHUB 3.0 USELESS PROJECTS INITIATIVE</span>
                <span className="cert-emblem-star">★ ★ ★</span>
              </div>
              <span className="cert-sub-org">
                SUPREME COURT OF UNNECESSARY COMPUTATION & METRIC OBSESSION
              </span>
              
              <h1 className="cert-main-title">
                CERTIFICATE OF HEROIC FOLLICULAR FUTILITY
              </h1>
              
              <p className="cert-subtitle">
                AWARDED UNDER EMERGENCY OCULAR LEGISLATION FOR ENDURING THE TITANIC, GRUELING, AND ENTIRELY POINTLESS LABOUR OF COUNTING INDIVIDUAL EYELASHES
              </p>
            </div>

            <div className="cert-divider-line"></div>

            {/* Recipient Presentation Section */}
            <div className="cert-recipient-section">
              <p className="cert-preamble-text">BE IT OFFICIALLY PROCLAIMED ACROSS ALL 14 DISTRICTS OF KERALA THAT</p>
              
              <h2 className="cert-recipient-name">
                {recipientName.trim() || "ANONYMOUS EYELASH SOVEREIGN"}
              </h2>

              <p className="cert-declaration-body">
                Has courageously surrendered precious, non-refundable minutes of their earthly existence to our ragebait optical scanner, allowing high-precision Blackhat computer vision to peer intimately into their eyelids for no medically, economically, or socially justifiable purpose.
              </p>
            </div>

            {/* ---------------------------------------------------------
                DRAMATIC PROMINENT EYELASH COUNT VERDICT
                --------------------------------------------------------- */}
            <div className="cert-count-highlight-box">
              <div className="cert-stamp-tape">OFFICIAL TRIBUNAL INVENTORY DECREE</div>

              <div className="cert-count-huge">
                YOU OFFICIALLY POSSESS <span className="highlight-number">{lashes}</span> EYELASHES
              </div>
              
              <p className="cert-count-subtext">
                NEITHER MORE, NOR LESS. VERIFIED BY COMPUTER VISION WITH DELIGHTFULLY QUESTIONABLE INTEGRITY.
              </p>

              <div className="cert-breakdown-row">
                <div className="cert-breakdown-item">
                  <span className="breakdown-num">{left}</span>
                  <span className="breakdown-lbl">LEFT EYE LASHES</span>
                </div>
                <div className="cert-breakdown-sep">|</div>
                <div className="cert-breakdown-item">
                  <span className="breakdown-num">{right}</span>
                  <span className="breakdown-lbl">RIGHT EYE LASHES</span>
                </div>
                <div className="cert-breakdown-sep">|</div>
                <div className="cert-breakdown-item">
                  <span className="breakdown-num">{symmetry}%</span>
                  <span className="breakdown-lbl">BILATERAL SYMMETRY</span>
                </div>
                <div className="cert-breakdown-sep">|</div>
                <div className="cert-breakdown-item">
                  <span className="breakdown-num">{dramaIndex}%</span>
                  <span className="breakdown-lbl">DRAMA INDEX</span>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------
                OFFICIAL ARTICLES OF SUPREME USELESSNESS
                --------------------------------------------------------- */}
            <div className="cert-articles-grid">
              <div className="cert-article-box">
                <span className="article-num">ARTICLE I // TOTAL FUTILITY</span>
                <p>This certificate confers zero academic credits, zero tax deductions, and zero romantic leverage. It cannot be used as photo ID at Cochin International Airport.</p>
              </div>
              <div className="cert-article-box">
                <span className="article-num">ARTICLE II // NO REFUNDS OF TIME</span>
                <p>The 4 minutes expended staring at this web page while our ragebait laser reset itself are forfeited forever to the digital void.</p>
              </div>
              <div className="cert-article-box">
                <span className="article-num">ARTICLE III // SCIENTIFIC INCONSEQUENCE</span>
                <p>No ophthalmic or dermatological association was consulted. Dr. Ramanan simply glanced at the contours and shouted "Mudalali, kanakkano?!"</p>
              </div>
            </div>

            {/* ---------------------------------------------------------
                SIDE-BY-SIDE OCULAR EVIDENCE:
                INPUTTED EYES VS CINEMA TWIN
                --------------------------------------------------------- */}
            <div className="cert-evidence-section">
              <span className="cert-section-caption">EXHIBITS A & B // RIGOROUS OCULAR AUDIT SPECIMENS</span>
              <div className="cert-evidence-grid">
                
                {/* 1. User's Inputted Eyes */}
                <div className="cert-specimen-card user-specimen">
                  <div className="specimen-label-row">
                    <span className="specimen-badge user-badge">EXHIBIT A: YOUR INPUTTED OCULAR SPECIMEN</span>
                    <span className="specimen-tech">STATUS: AUDITED</span>
                  </div>
                  <div className="cert-eye-frame">
                    {userEyeImage ? (
                      <img
                        src={userEyeImage}
                        alt="Your Inputted Eyes"
                        className="cert-eye-img"
                      />
                    ) : (
                      <div className="cert-eye-placeholder">
                        <span style={{ fontSize: "2.5rem" }}>👁️</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--lime-accent)" }}>
                          SPECIMEN: MANUAL REGISTRATION
                        </span>
                      </div>
                    )}
                    <div className="eye-strip-scanline"></div>
                    <div className="hud-corner-bracket top-left"></div>
                    <div className="hud-corner-bracket top-right"></div>
                    <div className="hud-corner-bracket bottom-left"></div>
                    <div className="hud-corner-bracket bottom-right"></div>
                  </div>
                  <div className="specimen-footer">
                    <span>EVIDENCE INVENTORY: {lashes} FOLLICLES</span>
                    <span>TIER: {classification.toUpperCase()}</span>
                  </div>
                </div>

                {/* 2. Cinema Eye Twin */}
                <div className="cert-specimen-card twin-specimen">
                  <div className="specimen-label-row">
                    <span className="specimen-badge twin-badge">EXHIBIT B: CINEMA TWIN ({meme.character.toUpperCase()})</span>
                    <span className="specimen-tech">{meme.match_pct}% MATCH</span>
                  </div>
                  <div className="cert-eye-frame">
                    <img
                      src={meme.image}
                      alt={meme.character}
                      className="cert-eye-img"
                    />
                    <div className="eye-strip-scanline"></div>
                    <div className="hud-corner-bracket top-left"></div>
                    <div className="hud-corner-bracket top-right"></div>
                    <div className="hud-corner-bracket bottom-left"></div>
                    <div className="hud-corner-bracket bottom-right"></div>
                  </div>
                  <div className="specimen-footer">
                    <span>FILM: {meme.movie.toUpperCase()}</span>
                    <span>“{meme.quote}”</span>
                  </div>


                </div>

              </div>
            </div>

            {/* Roast / Verdict Box */}
            <div className="cert-verdict-quote">
              <span className="verdict-quote-mark">“</span>
              <p className="verdict-text">{roast}</p>
            </div>

            {/* Footer / Official Wax Seal & Satirical Signatures */}
            <div className="cert-footer-row">
              {/* Signature 1 */}
              <div className="cert-signature-box">
                <div className="cert-sign-line">Dr. Peeli Ramanan</div>
                <span className="cert-sign-title">Dean of Aerodynamic Flutter, Punjabi House Ocular Dept.</span>
              </div>

              {/* Official Royal Wax Stamp with Ribbons */}
              <div className="cert-wax-seal-wrapper">
                <div className="cert-official-wax-seal">
                  <div className="seal-outer-ring">
                    <div className="seal-inner-ring">
                      <span className="seal-star">★ USELESS ★</span>
                      <span className="seal-text-top">KANNPEELI</span>
                      <span className="seal-center-icon">👁️</span>
                      <span className="seal-text-bot">ROYAL DECREE</span>
                      <span className="seal-sub">100% INCONSEQUENTIAL</span>
                    </div>
                  </div>
                </div>
                <div className="wax-ribbon red-ribbon left"></div>
                <div className="wax-ribbon gold-ribbon right"></div>
              </div>

              {/* Signature 2 */}
              <div className="cert-signature-box">
                <div className="cert-sign-line">Shammi The Hero</div>
                <span className="cert-sign-title">Commissioner of 99% Psycho Ocular Symmetry</span>
              </div>
            </div>

            {/* Certificate Meta Serial */}
            <div className="cert-serial-row">
              <span>PROCLAMATION ID: <strong>{certId}</strong></span>
              <span>DATE OF SANCTION: <strong>{dateStr}</strong></span>
              <span>TIER: <strong>{classification.toUpperCase()}</strong></span>
              <span>LEGAL WEIGHT: <strong>0.000 GRAMS</strong></span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EyelashCertificate;
