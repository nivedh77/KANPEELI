// Speech Synthesis Engine for KANNPEELI (കൺപീലി)
// Speaks out cinema dialogues, roast commentaries, and ocular telemetry

let cachedVoices = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

function getBestVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  
  // Prefer Indian English or local South Asian voices for authentic Manglish flair
  return (
    voices.find(v => v.lang === "en-IN" || v.lang === "hi-IN" || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("ravi") || v.name.toLowerCase().includes("heera")) ||
    voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("natural")) ||
    voices.find(v => v.lang.startsWith("en")) ||
    voices[0] ||
    null
  );
}

export function speakDialogue(text, options = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported by this browser.");
    return false;
  }

  try {
    // Cancel any ongoing utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Personality voice modulation (rate, pitch, volume)
    utterance.rate = Math.max(0.6, Math.min(1.8, options.rate || 1.0));
    utterance.pitch = Math.max(0.5, Math.min(1.8, options.pitch || 1.0));
    utterance.volume = options.volume !== undefined ? options.volume : 1.0;

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      console.warn("Speech error:", err);
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    };

    // Unmute synthesis on Chrome if suspended
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.error("Failed to speak dialogue:", e);
    if (options.onEnd) options.onEnd();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
