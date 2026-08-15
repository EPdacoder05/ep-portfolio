const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimal = String(target).includes(".");
    const start = performance.now();
    const duration = 900;

    function tick(now){
      const t = Math.min((now-start)/duration,1);
      const eased = 1 - Math.pow(1-t,3);
      const value = target * eased;
      const display = decimal ? value.toFixed(1) : Math.round(value).toLocaleString();
      el.textContent = `${prefix}${display}${suffix}`;
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
},{threshold:.35});

counters.forEach(c => observer.observe(c));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:"smooth",block:"start"}); }
  });
});
