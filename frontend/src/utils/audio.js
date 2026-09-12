// Web Audio API Synthesizer for KANNPEELI
// Zero external assets or network requests - purely synthesized audio

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioEnabled() {
  return soundEnabled;
}

export function setAudioEnabled(enabled) {
  soundEnabled = enabled;
}

// 1. Cute Blink / Pop Sound (when eyes blink or hero radar is clicked)
export function playBlinkSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {
    // Graceful fallback if audio is blocked
  }
}

// 2. Mechanical Counter Ticking (for slot-machine number roll-up)
export function playTickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {}
}

// 3. Sci-Fi Laser Scan Sweep (during camera capture / photo scanning)
export function playScanLaserSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  } catch (e) {}
}

// 4. Cinema Reveal Fanfare (when movie eye twin is revealed)
export function playRevealFanfare() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [330, 440, 554, 660]; // A major triumphant chord
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const startTime = ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.75);
    });
  } catch (e) {}
}

// 5. Success Chime (when score is recorded to public record)
export function playSuccessChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      const startTime = ctx.currentTime + idx * 0.09;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  } catch (e) {}
}

// 6. Dramatic Stare Contest Alert / Tension Sting
export function playStareAlertSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(110, now); // Low ominous note
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  } catch (e) {}
}

// 7. Funny Defeat Buzzer (when you blink in the stare battle)
export function playGlitchBuzzerSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(95, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  } catch (e) {}
}

// 8. Snappy Whoosh for Mode & Tab Changes
export function playWhooshSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  } catch (e) {}
}

// 9. Playful Speech Chatter (8-bit / Animal Crossing style chatter for dialogue bubbles)
export function playSpeechChatterSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const pitches = [420, 520, 620, 480, 560];
    pitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      const start = ctx.currentTime + idx * 0.05;
      osc.frequency.setValueAtTime(freq + (Math.random() * 60 - 30), start);

      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.05);
    });
  } catch (e) {}
}

// 10. Authentic Cinema Movie Dialogue Audio Player
let currentMovieAudio = null;

export function playMovieDialogueAudio(audioSrc, { onStart, onEnd, onError } = {}) {
  try {
    stopMovieDialogueAudio();

    if (!audioSrc) {
      if (onEnd) onEnd();
      return null;
    }

    const audio = new Audio(audioSrc);
    currentMovieAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentMovieAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn("Movie dialogue audio failed to load/play:", e);
      currentMovieAudio = null;
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Movie dialogue play blocked or failed:", err);
        currentMovieAudio = null;
        if (onError) onError(err);
        if (onEnd) onEnd();
      });
    }

    return audio;
  } catch (err) {
    if (onError) onError(err);
    if (onEnd) onEnd();
    return null;
  }
}

export function stopMovieDialogueAudio() {
  if (currentMovieAudio) {
    try {
      currentMovieAudio.pause();
      currentMovieAudio.currentTime = 0;
    } catch (e) {}
    currentMovieAudio = null;
  }
}

// Map characters to their authentic movie audio clips
export const CHARACTER_AUDIO_MAP = {
  damu: "/audio/dialogues/damu.mp3",
  shammi: "/audio/dialogues/shammi.mp3",
  aadu_thoma: "/audio/dialogues/thoma.mp3",
  thoma: "/audio/dialogues/thoma.mp3",
  manavalan: "/audio/dialogues/manavalan.mp3",
  kumbidi: "/audio/dialogues/kumbidi.mp3",
  nagavalli: "/audio/dialogues/nagavalli_tts.mp3",
  ramanan: "/audio/dialogues/ramanan_tts.mp3",
  zoomer: "/audio/dialogues/zoomer_tts.mp3"
};

export function getAudioSrcForCharacter(charIdentifier) {
  if (!charIdentifier) return null;
  const key = String(charIdentifier).toLowerCase();
  
  if (CHARACTER_AUDIO_MAP[key]) return CHARACTER_AUDIO_MAP[key];
  if (key.includes("damu") || key.includes("dashamoolam")) return CHARACTER_AUDIO_MAP.damu;
  if (key.includes("shammi") || key.includes("hero")) return CHARACTER_AUDIO_MAP.shammi;
  if (key.includes("thoma") || key.includes("spadikam") || key.includes("mohanlal")) return CHARACTER_AUDIO_MAP.thoma;
  if (key.includes("manavalan") || key.includes("salim")) return CHARACTER_AUDIO_MAP.manavalan;
  if (key.includes("kumbidi") || key.includes("jagathy")) return CHARACTER_AUDIO_MAP.kumbidi;
  if (key.includes("nagavalli") || key.includes("ganga") || key.includes("shobana")) return CHARACTER_AUDIO_MAP.nagavalli;
  if (key.includes("ramanan") || key.includes("mudalali") || key.includes("ashokan")) return CHARACTER_AUDIO_MAP.ramanan;
  if (key.includes("zoomer") || key.includes("gen-z") || key.includes("premalu") || key.includes("naslen")) return CHARACTER_AUDIO_MAP.zoomer;

  return null;
}



