document.addEventListener("DOMContentLoaded", () => {
  updateYear();
  initSubscriptionForm();
  initSnowParticles();
  initScrollReveal();
  initHeroParallax();
});

function updateYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initSubscriptionForm() {
  const form = document.querySelector(".subscribe-form");
  const messageEl = form?.querySelector(".form-message");

  if (!form || !messageEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(form).get("email");
    if (!email) {
      setMessage("请输入有效邮箱 / Please enter a valid email.", "#f4b942");
      return;
    }

    form.classList.add("is-loading");
    messageEl.textContent = "";

    setTimeout(() => {
      form.classList.remove("is-loading");
      form.reset();
      setMessage(
        "感谢订阅！请查收确认邮件并关注 12 月 8 日圣诞大促。",
        "#34d399"
      );
    }, 700);
  });

  function setMessage(text, color) {
    messageEl.textContent = text;
    messageEl.style.color = color;
  }
}

function initSnowParticles() {
  const canvas = document.getElementById("snow-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const flakes = [];
  const FLAKE_COUNT = 160;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createFlakes() {
    flakes.length = 0;
    for (let i = 0; i < FLAKE_COUNT; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.6,
        speedY: Math.random() * 0.8 + 0.4,
        drift: Math.random() * 0.6 - 0.3,
      });
    }
  }

  function drawFlakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    flakes.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    });
    ctx.fill();
  }

  function updateFlakes() {
    flakes.forEach((flake) => {
      flake.y += flake.speedY;
      flake.x += flake.drift;

      if (flake.y > canvas.height) {
        flake.y = -5;
      }
      if (flake.x > canvas.width) {
        flake.x = 0;
      } else if (flake.x < 0) {
        flake.x = canvas.width;
      }
    });
  }

  function animate() {
    drawFlakes();
    updateFlakes();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  createFlakes();
  animate();
  window.addEventListener("resize", () => {
    resizeCanvas();
    createFlakes();
  });
}

function initScrollReveal() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const targets = hero.querySelectorAll(".hero-banner, .hero-content");
  let rafId = null;
  let pointerX = 0;
  let pointerY = 0;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 20;

    if (!rafId) {
      rafId = requestAnimationFrame(applyParallax);
    }
  });

  hero.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    applyParallax();
  });

  function applyParallax() {
    targets.forEach((el, index) => {
      const intensity = (index + 1) * 0.4;
      el.style.transform = `translate3d(${pointerX * intensity}px, ${
        pointerY * intensity
      }px, 0)`;
    });
    rafId = null;
  }
}

