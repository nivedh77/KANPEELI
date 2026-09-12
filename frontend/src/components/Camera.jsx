import React, {
  useEffect,
  useRef,
  useState
} from "react";
import { playTickSound, playBlinkSound } from "../utils/audio";

function Camera({
  onImageCaptured,
  onBack
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const viewfinderRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  // Zoomer level: default is 2.0x for macro ocular close-up
  const [zoom, setZoom] = useState(2.0);
  // Pan focal point (percentages)
  const [pan, setPan] = useState({ x: 50, y: 42 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 50, panY: 42 });

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Wheel zoom listener directly on the viewfinder
  useEffect(() => {
    const box = viewfinderRef.current;
    if (!box) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      setZoom(prev => {
        const next = Math.max(1.0, Math.min(4.5, +(prev + delta).toFixed(2)));
        if (next !== prev) playTickSound();
        return next;
      });
    };

    box.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      box.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Apply native hardware zoom if supported by webcam/phone camera
  useEffect(() => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()?.[0];
    if (!track) return;

    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (capabilities.zoom) {
      const minZ = capabilities.zoom.min || 1.0;
      const maxZ = capabilities.zoom.max || 5.0;
      const targetZoom = Math.max(minZ, Math.min(maxZ, zoom));
      track.applyConstraints({
        advanced: [{ zoom: targetZoom }]
      }).catch(err => {
        console.debug("Hardware zoom constraint ignored, using digital zoom:", err);
      });
    }
  }, [zoom]);

  async function startCamera() {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setError("Webcam access denied or unavailable. Please upload a photo instead!");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }

  function handleSetZoom(level) {
    setZoom(level);
    playTickSound();
  }

  function handleResetZoom() {
    setZoom(2.0);
    setPan({ x: 50, y: 42 });
    playTickSound();
  }

  // Pan dragging handlers
  function handleMouseDown(e) {
    if (zoom <= 1.0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    };
  }

  function handleMouseMove(e) {
    if (!isDragging || zoom <= 1.0 || !viewfinderRef.current) return;
    const rect = viewfinderRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

    // Note: Video is mirrored horizontally (-1 scaleX), so invert dx for intuitive dragging
    const nextX = Math.max(20, Math.min(80, dragStartRef.current.panX - dx));
    const nextY = Math.max(20, Math.min(80, dragStartRef.current.panY + dy));
    setPan({ x: Math.round(nextX), y: Math.round(nextY) });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function captureImage() {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = vw;
    canvas.height = vh;
    const context = canvas.getContext("2d");

    // Compute zoomed crop coordinates based on user's zoom & pan position
    const cropW = vw / zoom;
    const cropH = vh / zoom;
    const cropX = Math.max(0, Math.min(vw - cropW, (vw * (pan.x / 100)) - (cropW / 2)));
    const cropY = Math.max(0, Math.min(vh - cropH, (vh * (pan.y / 100)) - (cropH / 2)));

    // Mirror horizontally to match the mirrored viewfinder display
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    // Draw zoomed high-resolution crop onto the full canvas
    context.drawImage(
      video,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      blob => {
        if (!blob) return;
        const file = new File([blob], "kannpeeli-zoom-scan.jpg", { type: "image/jpeg" });
        stopCamera();
        onImageCaptured(file);
      },
      "image/jpeg",
      0.95
    );
  }

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    stopCamera();
    onImageCaptured(file);
  }

  return (
    <div className="camera-embed-card">
      {/* Header */}
      <div className="camera-embed-header">
        <div>
          <span className="section-tag" style={{ color: "var(--lime-accent)" }}>
            01.A / MACRO OPTICAL SENSOR
          </span>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: 800 }}>
            Zoomed Ocular Viewfinder
          </h3>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" }}>
            Adjust the camera zoomer below to frame your eyelashes in macro detail.
          </p>
        </div>

        <button
          className="btn-neo btn-cream"
          style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          onClick={() => {
            stopCamera();
            onBack();
          }}
        >
          ✕ Close
        </button>
      </div>

      {error && (
        <div style={{
          background: "rgba(231, 88, 63, 0.15)",
          border: "1px solid var(--coral-accent)",
          padding: "1rem",
          borderRadius: "10px",
          color: "#fecdd3",
          marginBottom: "1rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* -------------------------------------------------------------
          CAMERA ZOOMER CONTROL TOOLBAR
          ------------------------------------------------------------- */}
      <div className="camera-zoomer-toolbar">
        <div className="cam-zoomer-header">
          <div className="cam-zoomer-title-group">
            <span className="cam-zoomer-icon">🔍</span>
            <span className="cam-zoomer-label">CAMERA MACRO ZOOMER:</span>
            <span className="cam-zoomer-mag-badge">{zoom.toFixed(1)}x</span>
          </div>

          <div className="cam-zoomer-actions-right">
            <button
              type="button"
              className="cam-zoom-step-btn"
              onClick={() => handleSetZoom(Math.max(1.0, +(zoom - 0.25).toFixed(2)))}
              title="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className="cam-zoom-step-btn"
              onClick={() => handleSetZoom(Math.min(4.5, +(zoom + 0.25).toFixed(2)))}
              title="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="cam-zoomer-reset-btn"
              onClick={handleResetZoom}
              title="Reset zoomer to 2.0x macro view"
            >
              ↺ Reset (2.0x)
            </button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="cam-zoomer-presets">
          {[
            { label: "1.0x Wide", val: 1.0 },
            { label: "1.5x", val: 1.5 },
            { label: "2.0x Macro", val: 2.0, hint: "Recommended" },
            { label: "3.0x Close-up", val: 3.0 },
            { label: "4.0x Extreme", val: 4.0 }
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              className={`cam-preset-btn ${Math.abs(zoom - item.val) < 0.08 ? "active" : ""}`}
              onClick={() => handleSetZoom(item.val)}
            >
              {item.label} {item.hint && <span className="preset-hint">✦</span>}
            </button>
          ))}
        </div>

        {/* Continuous Smooth Slider */}
        <div className="cam-zoomer-slider-container">
          <span className="slider-edge-label">1.0x (Wide)</span>
          <input
            type="range"
            min="1.0"
            max="4.5"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="cam-range-slider"
            aria-label="Camera Zoom Level"
          />
          <span className="slider-edge-label">4.5x (Macro)</span>
        </div>

        <div className="cam-zoomer-hint-row">
          <span>💡 Tip: Scroll your mouse wheel over the camera to zoom in/out, or drag to adjust focal framing.</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          LIVE CAMERA VIEWFINDER WITH ZOOM & RETICLES
          ------------------------------------------------------------- */}
      <div
        ref={viewfinderRef}
        className={`viewfinder-container ${zoom > 1.0 ? "can-drag" : ""} ${isDragging ? "dragging" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        title={zoom > 1.0 ? "Drag to reposition eye framing, or scroll to zoom" : "Scroll to zoom"}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="live-video"
          style={{
            transform: `scaleX(-1) scale(${zoom})`,
            transformOrigin: `${pan.x}% ${pan.y}%`,
            transition: isDragging ? "none" : "transform 0.2s ease-out, transform-origin 0.15s ease-out"
          }}
        />

        {/* Scanline Effect */}
        <div className="eye-strip-scanline"></div>

        {/* Corner HUD Brackets */}
        <div className="hud-corner-bracket top-left"></div>
        <div className="hud-corner-bracket top-right"></div>
        <div className="hud-corner-bracket bottom-left"></div>
        <div className="hud-corner-bracket bottom-right"></div>

        {/* Dual Eye Targeting Reticles */}
        <div className="reticle-target-box">
          <div className="eye-box left">
            <span>LEFT EYE</span>
            <div className="eye-reticle-cross"></div>
          </div>
          <div className="eye-box right">
            <span>RIGHT EYE</span>
            <div className="eye-reticle-cross"></div>
          </div>
        </div>

        {/* Zoomer Telemetry Badges */}
        <div className="cam-hud-badge top-left">
          <span className="hud-live-dot">●</span>
          <span>ZOOMER: {zoom.toFixed(1)}X DIGITAL ENLARGEMENT</span>
        </div>

        <div className="cam-hud-badge top-right">
          <span>FOCAL POINT: [X:{pan.x}% Y:{pan.y}%]</span>
        </div>

        {zoom > 1.0 && (
          <div className="cam-hud-badge bottom-center">
            <span>DRAG TO RE-CENTER EYES // SCROLL TO ZOOM</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-row" style={{ marginTop: "1.5rem" }}>
        <button
          className="btn-neo btn-lime"
          onClick={captureImage}
          disabled={!cameraReady}
          style={{ fontSize: "1.02rem", padding: "0.95rem 2rem" }}
        >
          📸 Capture {zoom.toFixed(1)}x Zoomed Eyes & Match Meme
        </button>

        <button
          className="btn-neo btn-cream"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Upload Photo File
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

export default Camera;