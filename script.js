/* =============================================================
   RESTAURANT LINKTREE — script.js
   ============================================================= */

(function () {
  "use strict";

  /* ── Helpers ──────────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ── Dynamic year in footer ───────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Staggered button entrance animations ─────────────────── */
  function animateButtons() {
    const buttons = document.querySelectorAll(".link-btn");

    if (prefersReducedMotion) {
      buttons.forEach((btn) => {
        btn.style.opacity = "1";
        btn.style.transform = "none";
      });
      return;
    }

    buttons.forEach((btn, i) => {
      btn.style.transition =
        "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), " +
        "background 0.25s ease, " +
        "box-shadow 0.25s ease";

      setTimeout(() => {
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0) scale(1)";
      }, 600 + i * 90); // stagger each button by 90 ms
    });
  }

  /* ── Ripple click effect on buttons ──────────────────────── */
  function addRipple(btn) {
    btn.addEventListener("click", function (e) {
      const existing = this.querySelector(".ripple");
      if (existing) existing.remove();

      const circle = document.createElement("span");
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const rect = this.getBoundingClientRect();

      circle.className = "ripple";
      Object.assign(circle.style, {
        width:    diameter + "px",
        height:   diameter + "px",
        left:     e.clientX - rect.left - diameter / 2 + "px",
        top:      e.clientY - rect.top  - diameter / 2 + "px",
        position: "absolute",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.18)",
        transform: "scale(0)",
        animation: "rippleAnim 0.55s linear",
        pointerEvents: "none",
      });

      this.appendChild(circle);
      circle.addEventListener("animationend", () => circle.remove());
    });
  }

  /* ── Inject ripple keyframes ──────────────────────────────── */
  function injectRippleStyles() {
    if (document.getElementById("ripple-styles")) return;
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Tilt / parallax effect on buttons (desktop only) ────── */
  function addTilt(btn) {
    if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;

    btn.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      this.style.transform = `translateY(-3px) scale(1.02) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    injectRippleStyles();
    animateButtons();

    document.querySelectorAll(".link-btn").forEach((btn) => {
      addRipple(btn);
      addTilt(btn);
    });

    /* Subtle logo pulse on hover */
    const logo = document.querySelector(".logo-placeholder");
    if (logo && !prefersReducedMotion) {
      logo.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease";
      logo.addEventListener("mouseenter", () => {
        logo.style.transform = "scale(1.08) rotate(-4deg)";
        logo.style.boxShadow = "0 12px 40px rgba(232, 160, 69, 0.50)";
      });
      logo.addEventListener("mouseleave", () => {
        logo.style.transform = "";
        logo.style.boxShadow = "";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
