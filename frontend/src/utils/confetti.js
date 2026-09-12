// Eyelash & Star Particle Confetti Effect

export function triggerEyelashConfetti() {
  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);

  const symbols = ["彡", "ミ", "✨", "👁️", "✦", "💫"];
  const colors = ["#E7583F", "#CEF53D", "#38BDF8", "#121826", "#F59E0B"];

  const count = 45;
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "confetti-particle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = `${16 + Math.random() * 24}px`;
    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const velocity = 180 + Math.random() * 320;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 100;
    const rot = (Math.random() - 0.5) * 720;

    el.style.setProperty("--tx", `${vx}px`);
    el.style.setProperty("--ty", `${vy}px`);
    el.style.setProperty("--rot", `${rot}deg`);

    container.appendChild(el);
  }

  setTimeout(() => {
    container.remove();
  }, 2200);
}
