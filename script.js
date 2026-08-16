const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projects = {
  npv: {
    kicker: "FLAGSHIP SYSTEM",
    title: "NullPointVector",
    description: "AI threat-detection platform across email, SMS, and voice with FastAPI, PostgreSQL/pgvector, NLP, and hardened CI/CD.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector"],
    source: "https://github.com/EPdacoder05/NullPointVector",
    project: "https://epdacoder05.github.io/NullPointVector/"
  },
  fabric: {
    kicker: "SECURITY ANALYTICS",
    title: "Security Data Fabric",
    description: "Three-tier medallion architecture built to normalize and enrich security telemetry from 10+ enterprise data sources.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector"],
    source: "https://github.com/EPdacoder05/security-data-fabric",
    project: "https://github.com/EPdacoder05/security-data-fabric"
  },
  finops: {
    kicker: "FINOPS AUTOMATION",
    title: "Cost-Control-as-Code",
    description: "Event-driven AWS automation for cost discovery, budget enforcement, orphan detection, and reusable infrastructure controls.",
    stack: ["Pulumi", "Lambda", "EventBridge", "Terraform"],
    source: "https://github.com/EPdacoder05/finops-cost-control-as-code",
    project: "https://github.com/EPdacoder05/finops-cost-control-as-code"
  },
  ble: {
    kicker: "IOT / EDGE",
    title: "HA-BLE-MQTT Bridge",
    description: "Reverse-engineered BLE lighting protocols connected to Home Assistant through an asynchronous Python and MQTT bridge.",
    stack: ["Python", "asyncio", "bleak", "aiomqtt"],
    source: "https://github.com/EPdacoder05/ha-ble-mqtt-bridge",
    project: "https://epdacoder05.github.io/ha-ble-mqtt-bridge/"
  },
  jarvis: {
    kicker: "AI / HOMELAB",
    title: "Jarvis AI Homelab",
    description: "Serverless voice-assistant backend translating voice commands into secure smart-home actions through AWS and Home Assistant.",
    stack: ["AWS Lambda", "API Gateway", "Polly", "Transcribe"],
    source: "https://github.com/EPdacoder05/Jarvis-AI-Assistant",
    project: "https://github.com/EPdacoder05/Jarvis-AI-Assistant"
  },
  media: {
    kicker: "EVENT-DRIVEN AWS",
    title: "Cloud Media Pipeline",
    description: "Automated media ingestion, AI analysis, transcoding, orchestration, and storage lifecycle management on AWS.",
    stack: ["S3", "EventBridge", "Step Functions", "MediaConvert"],
    source: "https://github.com/EPdacoder05/Media-Processing-Pipeline",
    project: "https://github.com/EPdacoder05/Media-Processing-Pipeline"
  }
};

// 1) Site-wide first-load preloader.
const preloader = document.getElementById("preloader");
function hidePreloader() {
  if (!preloader || reduceMotion) return;
  preloader.classList.add("is-hidden");
  window.setTimeout(() => preloader.remove(), 500);
}
if (preloader) {
  if (reduceMotion) {
    preloader.remove();
  } else {
    window.setTimeout(hidePreloader, 1500);
  }
}

// 2) Interactive three-gear site mark.
// Hover speeds it up via CSS. Click gives it a short burst and scrolls home.
// Shift+click replays the full preloader.
const gearHome = document.getElementById("gearHome");
gearHome?.addEventListener("click", (event) => {
  if (event.shiftKey && !reduceMotion) {
    replayPreloader();
    return;
  }
  gearHome.classList.add("is-boosted");
  document.getElementById("home")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  window.setTimeout(() => gearHome.classList.remove("is-boosted"), 1200);
});

function replayPreloader() {
  const existing = document.getElementById("preloader");
  if (existing) return;
  const overlay = document.createElement("div");
  overlay.id = "preloader";
  overlay.className = "preloader";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="preloader-mark">
      ${gearHome.querySelector("svg").outerHTML.replace('class="gear-logo"', 'class="gear-logo gear-logo--loader"')}
      <div class="preloader-line"><span></span></div>
    </div>`;
  document.body.appendChild(overlay);
  window.setTimeout(() => {
    overlay.classList.add("is-hidden");
    window.setTimeout(() => overlay.remove(), 500);
  }, 1100);
}

// 3) Typed working-set text — real areas from the portfolio.
const typedText = document.getElementById("typedText");
const phrases = [
  "cloud automation",
  "platform infrastructure",
  "security systems",
  "backend platforms",
  "BLE → MQTT"
];

if (typedText && !reduceMotion) {
  let phrase = 0;
  let char = phrases[0].length;
  let deleting = true;

  function typeLoop() {
    const current = phrases[phrase];
    typedText.textContent = current.slice(0, char);

    if (deleting) {
      char--;
      if (char < 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        char = 0;
        setTimeout(typeLoop, 260);
        return;
      }
      setTimeout(typeLoop, 28);
    } else {
      char++;
      if (char > phrases[phrase].length) {
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }
      setTimeout(typeLoop, 52);
    }
  }
  setTimeout(typeLoop, 1000);
}

// 4) Interactive project constellation.
const constellation = document.getElementById("constellation");
const orbitField = document.getElementById("orbitField");
const nodes = [...document.querySelectorAll(".project-node, .center-node")];
const mapStatus = document.getElementById("mapStatus");
const popover = {
  kicker: document.getElementById("popoverKicker"),
  title: document.getElementById("popoverTitle"),
  description: document.getElementById("popoverDescription"),
  stack: document.getElementById("popoverStack"),
  source: document.getElementById("popoverSource"),
  project: document.getElementById("popoverProject")
};

let pinnedProject = "npv";
let dragStart = null;
let rotation = 0;

function renderProject(key, { pin = false } = {}) {
  const project = projects[key];
  if (!project) return;

  popover.kicker.textContent = project.kicker;
  popover.title.textContent = project.title;
  popover.description.textContent = project.description;
  popover.stack.innerHTML = project.stack.map(item => `<span>${item}</span>`).join("");
  popover.source.href = project.source;
  popover.project.href = project.project;

  if (pin) pinnedProject = key;

  nodes.forEach(node => {
    node.classList.toggle("is-active", node.dataset.project === key);
  });

  document.querySelectorAll("[data-line]").forEach(line => {
    line.classList.toggle("active", line.dataset.line === key);
  });

  mapStatus.textContent = pin ? `${project.title} · pinned` : `${project.title} · preview`;
}

function restorePinned() {
  renderProject(pinnedProject, { pin: false });
  mapStatus.textContent = "drag · hover · click";
}

nodes.forEach(node => {
  const key = node.dataset.project;
  node.addEventListener("mouseenter", () => renderProject(key));
  node.addEventListener("mouseleave", restorePinned);
  node.addEventListener("focus", () => renderProject(key));
  node.addEventListener("blur", restorePinned);
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    renderProject(key, { pin: true });
  });
  node.addEventListener("dblclick", () => {
    window.open(projects[key].project, "_blank", "noopener,noreferrer");
  });
  node.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      renderProject(key, { pin: true });
    }
  });
});

// Dragging rotates the visual field a limited amount instead of spinning the text labels.
const shell = document.getElementById("constellationShell");
shell?.addEventListener("pointerdown", event => {
  if (event.target.closest(".project-node, .center-node, .project-popover a")) return;
  dragStart = { x: event.clientX, rotation };
  constellation.classList.add("is-dragging");
  shell.setPointerCapture?.(event.pointerId);
});

shell?.addEventListener("pointermove", event => {
  if (!dragStart) return;
  const delta = event.clientX - dragStart.x;
  rotation = Math.max(-14, Math.min(14, dragStart.rotation + delta * 0.035));
  orbitField.style.transformOrigin = "380px 280px";
  orbitField.style.transform = `rotate(${rotation}deg)`;
  document.getElementById("projectLines").style.transformOrigin = "380px 280px";
  document.getElementById("projectLines").style.transform = `rotate(${rotation * 0.45}deg)`;
  mapStatus.textContent = `map rotation ${rotation.toFixed(1)}°`;
});

function endDrag(event) {
  if (!dragStart) return;
  dragStart = null;
  constellation.classList.remove("is-dragging");
  shell.releasePointerCapture?.(event.pointerId);
  restorePinned();
}
shell?.addEventListener("pointerup", endDrag);
shell?.addEventListener("pointercancel", endDrag);

// Clicking empty map resets to NPV overview.
shell?.addEventListener("click", event => {
  if (event.target.closest(".project-node, .center-node, .project-popover")) return;
  pinnedProject = "npv";
  restorePinned();
});

// 5) Actual metric count-up animation.
const metricElements = [...document.querySelectorAll("[data-count]")];
const metricObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = String(target).includes(".") ? 1 : 0;

    if (reduceMotion) {
      el.textContent = `${prefix}${target.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    } else {
      const start = performance.now();
      const duration = 850;
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        const formatted = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString();
        el.textContent = `${prefix}${formatted}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    metricObserver.unobserve(el);
  });
}, { threshold: .45 });

metricElements.forEach(el => metricObserver.observe(el));

// 6) Card hover syncs with the constellation preview.
document.querySelectorAll("[data-card-project]").forEach(card => {
  const key = card.dataset.cardProject;
  card.addEventListener("mouseenter", () => renderProject(key));
  card.addEventListener("mouseleave", restorePinned);
});

// 7) Nav active state + reveal.
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

if (!reduceMotion) {
  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll(".systems-section,.content-section,.connect-section").forEach(el => revealObserver.observe(el));
}

renderProject("npv", { pin: true });
