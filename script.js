const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const techTrack = document.querySelector(".tech-loop__track");

if (techTrack) {
  const originalLogos = Array.from(techTrack.children);

  originalLogos.forEach((logo) => {
    const clone = logo.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    techTrack.appendChild(clone);
  });

  const updateLoopDistance = () => {
    techTrack.style.setProperty("--tech-loop-distance", `${techTrack.scrollWidth / 2}px`);
  };

  updateLoopDistance();
  window.addEventListener("load", updateLoopDistance);
  window.addEventListener("resize", updateLoopDistance);
}

const velocityLines = document.querySelectorAll("[data-scroll-velocity]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (velocityLines.length > 0 && !reduceMotion) {
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let scrollSpeed = 0;

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const deltaY = window.scrollY - lastScrollY;
      const deltaTime = Math.max(16, now - lastScrollTime);

      scrollSpeed = Math.abs((deltaY / deltaTime) * 1000);
      lastScrollY = window.scrollY;
      lastScrollTime = now;
    },
    { passive: true }
  );

  velocityLines.forEach((line) => {
    const scroller = line.querySelector(".velocity-scroller");
    const firstCopy = scroller?.querySelector("span");
    const baseVelocity = Number(line.dataset.scrollVelocity) || 60;

    if (!scroller || !firstCopy) return;

    for (let index = 0; index < 7; index += 1) {
      scroller.appendChild(firstCopy.cloneNode(true));
    }

    let offset = 0;
    let lastFrameTime = performance.now();
    let boost = 0;

    const animate = (time) => {
      const delta = Math.min(0.05, Math.max(0, (time - lastFrameTime) / 1000));
      const copyWidth = firstCopy.getBoundingClientRect().width;
      const targetBoost = Math.min(scrollSpeed / 900, 3.5);

      boost += (targetBoost - boost) * 0.08;

      if (copyWidth > 0) {
        offset += baseVelocity * delta * (1 + boost);
        offset = ((offset % copyWidth) + copyWidth) % copyWidth;
        scroller.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      scrollSpeed *= 0.92;
      lastFrameTime = time;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
}

const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector(".copy-status");

if (copyButton && copyStatus) {
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.copy;
    let copied = false;

    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      const fallbackField = document.createElement("textarea");
      fallbackField.value = email;
      fallbackField.setAttribute("readonly", "");
      fallbackField.style.position = "fixed";
      fallbackField.style.opacity = "0";
      document.body.appendChild(fallbackField);
      fallbackField.select();
      copied = document.execCommand("copy");
      fallbackField.remove();
    }

    copyStatus.textContent = copied ? "Email скопирован" : email;

    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2400);
  });
}

document.querySelectorAll(".glass-card, .project-card, .skill-panel").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.72), transparent 42%)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.backgroundImage = "";
  });
});
