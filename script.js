const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// First-visit boot sequence: short, session-only, and skipped for reduced motion.
const boot = document.getElementById("boot");
if (boot) {
  const seen = sessionStorage.getItem("epBootSeen");
  if (seen || reduceMotion) {
    boot.remove();
  } else {
    sessionStorage.setItem("epBootSeen", "1");
    window.setTimeout(() => boot.classList.add("hidden"), 650);
    window.setTimeout(() => boot.remove(), 1100);
  }
}

// Impact counters.
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimal = String(target).includes(".");
    const start = performance.now();
    const duration = reduceMotion ? 0 : 900;

    function tick(now) {
      const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      const display = decimal ? value.toFixed(1) : Math.round(value).toLocaleString();
      el.textContent = `${prefix}${display}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: .35 });

counters.forEach(c => counterObserver.observe(c));

// Native typing hero.
const typed = document.getElementById("typedText");
const phrases = [
  "cloud automation",
  "platform infrastructure",
  "security systems",
  "developer tooling",
  "weird IoT experiments"
];

if (typed) {
  if (reduceMotion) {
    typed.textContent = phrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const phrase = phrases[phraseIndex];
      typed.textContent = phrase.slice(0, charIndex);

      if (!deleting && charIndex < phrase.length) {
        charIndex++;
        setTimeout(typeLoop, 52);
      } else if (!deleting && charIndex === phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 1250);
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeLoop, 25);
      } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 280);
      }
    }
    typeLoop();
  }
}

// Scroll reveals.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .1 });

document.querySelectorAll(".reveal").forEach(el => {
  if (reduceMotion) el.classList.add("visible");
  else revealObserver.observe(el);
});

// Project cursor glow.
document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("pointermove", event => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - r.left}px`);
    card.style.setProperty("--my", `${event.clientY - r.top}px`);
  });
});

// Smooth internal navigation.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  });
});

// Command palette.
const backdrop = document.getElementById("commandBackdrop");
const trigger = document.getElementById("commandTrigger");
const closeBtn = document.getElementById("commandClose");
const input = document.getElementById("commandInput");
const list = document.getElementById("commandList");
const commandButtons = [...document.querySelectorAll("[data-command]")];
let activeIndex = 0;

const actions = {
  projects: () => document.querySelector("#work")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }),
  experience: () => document.querySelector("#experience")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }),
  lab: () => document.querySelector("#lab")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }),
  github: () => window.open("https://github.com/EPdacoder05", "_blank", "noopener,noreferrer"),
  linkedin: () => window.open("https://www.linkedin.com/in/ellis-pinaman/", "_blank", "noopener,noreferrer"),
  contact: () => { window.location.href = "mailto:epinaman@yahoo.com"; }
};

function visibleButtons() {
  return commandButtons.filter(btn => !btn.hidden);
}

function setActive(index) {
  const visible = visibleButtons();
  if (!visible.length) return;
  activeIndex = Math.max(0, Math.min(index, visible.length - 1));
  commandButtons.forEach(b => b.classList.remove("active"));
  visible[activeIndex].classList.add("active");
}

function openPalette() {
  backdrop.hidden = false;
  document.body.classList.add("command-open");
  input.value = "";
  commandButtons.forEach(btn => btn.hidden = false);
  setActive(0);
  setTimeout(() => input.focus(), 0);
}

function closePalette() {
  backdrop.hidden = true;
  document.body.classList.remove("command-open");
  trigger?.focus();
}

function runCommand(name) {
  closePalette();
  actions[name]?.();
}

trigger?.addEventListener("click", openPalette);
closeBtn?.addEventListener("click", closePalette);
backdrop?.addEventListener("click", e => { if (e.target === backdrop) closePalette(); });

input?.addEventListener("input", () => {
  const q = input.value.trim().toLowerCase();
  commandButtons.forEach(btn => {
    const text = `${btn.dataset.command} ${btn.textContent}`.toLowerCase();
    btn.hidden = q && !text.includes(q);
  });
  setActive(0);
});

commandButtons.forEach(btn => btn.addEventListener("click", () => runCommand(btn.dataset.command)));

document.addEventListener("keydown", e => {
  const isTyping = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "");

  if ((e.key === "/" && !isTyping) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
    e.preventDefault();
    if (backdrop.hidden) openPalette();
    else closePalette();
    return;
  }

  if (backdrop.hidden) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closePalette();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    setActive(activeIndex + 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActive(activeIndex - 1);
  } else if (e.key === "Enter") {
    const visible = visibleButtons();
    if (visible[activeIndex]) {
      e.preventDefault();
      runCommand(visible[activeIndex].dataset.command);
    }
  }
});
