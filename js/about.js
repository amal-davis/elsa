(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Footer year                                                          */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Scroll reveal  (IntersectionObserver)                               */
  /* ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".abt-reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback: show immediately for browsers without IntersectionObserver */
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------ */
  /* Hero stat counter animation                                          */
  /* ------------------------------------------------------------------ */
  var statNums = document.querySelectorAll(".abt-hero__stat-num[data-target]");

  function animateCounter(el, target, suffix) {
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* easeOutQuart */
      var ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statNums.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el     = entry.target;
            var target = parseInt(el.dataset.target, 10);
            var suffix = el.dataset.suffix || "";
            animateCounter(el, target, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Gallery lightbox                                                     */
  /* ------------------------------------------------------------------ */
  var galleryItems = document.querySelectorAll(".abt-gallery-item");
  var galleryImgs  = document.querySelectorAll(".abt-gallery-item .abt-gallery-img");

  var lightbox    = document.getElementById("abtLightbox");
  var lbOverlay   = document.getElementById("abtLbOverlay");
  var lbClose     = document.getElementById("abtLbClose");
  var lbPrev      = document.getElementById("abtLbPrev");
  var lbNext      = document.getElementById("abtLbNext");
  var lbImg       = document.getElementById("abtLbImg");
  var lbCounter   = document.getElementById("abtLbCounter");

  var currentIdx  = 0;

  function openLightbox(idx) {
    if (!lightbox || !galleryImgs.length) return;
    currentIdx = idx;
    updateLightboxImg();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    /* Restore focus to the item that opened the lightbox */
    var triggerEl = galleryItems[currentIdx];
    if (triggerEl) triggerEl.focus();
  }

  function updateLightboxImg() {
    if (!lbImg || !galleryImgs[currentIdx]) return;
    var img = galleryImgs[currentIdx];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    if (lbCounter) {
      lbCounter.textContent = (currentIdx + 1) + " / " + galleryImgs.length;
    }
    /* Update nav disabled state */
    if (lbPrev) lbPrev.disabled = currentIdx === 0;
    if (lbNext) lbNext.disabled = currentIdx === galleryImgs.length - 1;
  }

  function navigate(direction) {
    var next = currentIdx + direction;
    if (next < 0 || next >= galleryImgs.length) return;
    currentIdx = next;
    updateLightboxImg();
  }

  /* Bind gallery item clicks / keyboard */
  galleryItems.forEach(function (item, idx) {
    item.addEventListener("click", function () { openLightbox(idx); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  /* Lightbox controls */
  if (lbClose)   lbClose.addEventListener("click", closeLightbox);
  if (lbOverlay) lbOverlay.addEventListener("click", closeLightbox);
  if (lbPrev)    lbPrev.addEventListener("click", function () { navigate(-1); });
  if (lbNext)    lbNext.addEventListener("click", function () { navigate(1); });

  /* Keyboard navigation */
  document.addEventListener("keydown", function (e) {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape")      { closeLightbox(); }
    if (e.key === "ArrowLeft")   { navigate(-1); }
    if (e.key === "ArrowRight")  { navigate(1); }
  });

  /* Touch swipe support for lightbox */
  if (lightbox) {
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

})();
