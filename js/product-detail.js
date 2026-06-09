(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------ */
  /* Gallery — thumbnail click swaps main image with a fade transition   */
  /* ------------------------------------------------------------------ */
  var thumbs    = document.querySelectorAll(".pdp-thumb");
  var mainImg   = document.getElementById("pdpMainImg");
  var mainWrap  = document.getElementById("pdpMainWrap");

  function activateThumb(thumb) {
    thumbs.forEach(function (t) {
      t.classList.remove("is-active");
      t.setAttribute("aria-pressed", "false");
    });
    thumb.classList.add("is-active");
    thumb.setAttribute("aria-pressed", "true");

    var newSrc = thumb.dataset.src;
    var newAlt = thumb.dataset.alt || "";

    if (!mainImg || !newSrc || newSrc === mainImg.src) return;

    if (prefersReducedMotion.matches) {
      mainImg.src = newSrc;
      mainImg.alt = newAlt;
      return;
    }

    mainImg.classList.add("is-fading");
    setTimeout(function () {
      mainImg.src = newSrc;
      mainImg.alt = newAlt;
      mainImg.classList.remove("is-fading");
    }, 200);
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () { activateThumb(thumb); });
    thumb.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateThumb(thumb);
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* Quantity selector                                                    */
  /* ------------------------------------------------------------------ */
  var qtyInput = document.getElementById("qtyInput");
  var qtyDec   = document.getElementById("qtyDec");
  var qtyInc   = document.getElementById("qtyInc");

  function getQty() {
    return parseInt(qtyInput ? qtyInput.value : "1", 10) || 1;
  }
  function setQty(val) {
    var clamped = Math.max(1, Math.min(99, val));
    qtyInput.value = String(clamped);
    if (qtyDec) qtyDec.disabled = clamped <= 1;
  }

  if (qtyDec && qtyInc && qtyInput) {
    qtyDec.disabled = true;
    qtyDec.addEventListener("click", function () { setQty(getQty() - 1); });
    qtyInc.addEventListener("click", function () { setQty(getQty() + 1); });
    qtyInput.addEventListener("change", function () { setQty(parseInt(qtyInput.value, 10)); });
  }

  /* ------------------------------------------------------------------ */
  /* Weight / variant selector — updates displayed price & badge         */
  /* ------------------------------------------------------------------ */
  var weightBtns   = document.querySelectorAll(".pdp-weight-btn");
  var priceEl      = document.getElementById("pdpPrice");
  var mrpEl        = document.getElementById("pdpMrp");
  var badgeEl      = document.getElementById("pdpBadge");
  var metaWeightEl = document.getElementById("pdpMetaWeight");

  function calcDiscount(price, mrp) {
    if (!mrp || mrp <= price) return 0;
    return Math.round((1 - price / mrp) * 100);
  }

  weightBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      weightBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      var price = parseInt(btn.dataset.price, 10);
      var mrp   = parseInt(btn.dataset.mrp, 10);
      var wt    = btn.dataset.weight || "";

      if (priceEl)      priceEl.textContent      = "₹" + price;
      if (mrpEl)        mrpEl.textContent         = "₹" + mrp;
      if (metaWeightEl) metaWeightEl.textContent  = wt;

      var disc = calcDiscount(price, mrp);
      if (badgeEl) {
        badgeEl.textContent = disc > 0 ? disc + "% OFF" : "";
        badgeEl.hidden = disc === 0;
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* Tabs                                                                 */
  /* ------------------------------------------------------------------ */
  var tabBtns   = document.querySelectorAll(".pdp-tab-btn");
  var tabPanels = document.querySelectorAll(".pdp-tab-panel");

  function activateTab(btn) {
    var target = btn.dataset.tab;
    tabBtns.forEach(function (b) {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    tabPanels.forEach(function (p) { p.classList.remove("is-active"); });

    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");

    var panel = document.getElementById("tab-" + target);
    if (panel) {
      panel.classList.add("is-active");
      if (document.activeElement !== btn) panel.focus({ preventScroll: true });
    }
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { activateTab(btn); });
    btn.addEventListener("keydown", function (e) {
      var idx = Array.prototype.indexOf.call(tabBtns, btn);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        tabBtns[(idx + 1) % tabBtns.length].focus();
        activateTab(tabBtns[(idx + 1) % tabBtns.length]);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tabBtns[(idx - 1 + tabBtns.length) % tabBtns.length].focus();
        activateTab(tabBtns[(idx - 1 + tabBtns.length) % tabBtns.length]);
      }
    });
  });

  /* Jump to reviews via rating link */
  var jumpReviews = document.getElementById("pdpJumpReviews");
  if (jumpReviews) {
    jumpReviews.addEventListener("click", function (e) {
      e.preventDefault();
      var reviewBtn = document.getElementById("tbtn-reviews");
      if (reviewBtn) {
        activateTab(reviewBtn);
        var section = document.getElementById("pdpTabsSection");
        if (section) {
          section.scrollIntoView({
            behavior: prefersReducedMotion.matches ? "auto" : "smooth",
            block: "start"
          });
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Buy Now                                                              */
  /* ------------------------------------------------------------------ */
  var buyNowBtn = document.getElementById("pdpBuyNow");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", function () {
      /* In production this would redirect to checkout. For now, add to
         cart and show the confirmation just like Add to Cart does. */
      var addBtn = document.getElementById("pdpAddToCart");
      if (addBtn) addBtn.click();
      window.alert("Redirecting to checkout…\n\n(Connect a real checkout URL in production.)");
    });
  }

  /* ------------------------------------------------------------------ */
  /* Copy link                                                            */
  /* ------------------------------------------------------------------ */
  var copyBtn = document.getElementById("pdpCopyLink");
  var toast   = document.getElementById("pdpToast");

  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        if (!toast) return;
        toast.classList.add("is-visible");
        setTimeout(function () { toast.classList.remove("is-visible"); }, 2500);
      });
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }

  /* ------------------------------------------------------------------ */
  /* Add to Cart — main PDP button passes quantity to the shared handler */
  /* ------------------------------------------------------------------ */
  var pdpAddBtn = document.getElementById("pdpAddToCart");
  if (pdpAddBtn) {
    pdpAddBtn.addEventListener("click", function () {
      /* The shared addToCart() in main.js increments by 1. For multi-qty
         we fire it N times but only animate once to avoid spam. */
      var qty = getQty();
      for (var i = 0; i < qty; i++) {
        var cartBadge = document.getElementById("cartBadge");
        if (cartBadge) {
          var current = parseInt(cartBadge.textContent, 10) || 0;
          cartBadge.textContent = String(current + 1);
          if (!prefersReducedMotion.matches) {
            cartBadge.classList.remove("is-pulsing");
            void cartBadge.offsetWidth;
            cartBadge.classList.add("is-pulsing");
          }
          document.querySelectorAll(".cart-badge").forEach(function (b) {
            if (b !== cartBadge) b.textContent = cartBadge.textContent;
          });
        }
      }
      /* Visual feedback on the button */
      var label = pdpAddBtn.querySelector(".btn-add__label");
      if (label && pdpAddBtn.dataset.state !== "added") {
        pdpAddBtn.dataset.state = "added";
        pdpAddBtn.style.backgroundColor = "var(--color-success)";
        pdpAddBtn.style.borderColor      = "var(--color-success)";
        label.textContent = "Added ✓";
        setTimeout(function () {
          pdpAddBtn.dataset.state = "";
          pdpAddBtn.style.backgroundColor = "";
          pdpAddBtn.style.borderColor      = "";
          label.textContent = "Add to Cart";
        }, 2000);
      }
    });
  }

})();
