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
