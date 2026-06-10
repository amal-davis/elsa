(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Utilities                                                            */
  /* ------------------------------------------------------------------ */
  function el(id)       { return document.getElementById(id); }
  function fmt(n)       { return "₹" + n.toLocaleString("en-IN"); }

  /* ------------------------------------------------------------------ */
  /* Footer year                                                          */
  /* ------------------------------------------------------------------ */
  var yearEl = el("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Validation rules                                                     */
  /* ------------------------------------------------------------------ */
  var RULES = {
    "chk-firstName": { label: "First name" },
    "chk-lastName":  { label: "Last name" },
    "chk-email":     { label: "Email address",
                       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                       msg: "Enter a valid email address." },
    "chk-phone":     { label: "Phone number",
                       pattern: /^[6-9]\d{9}$/,
                       msg: "Enter a valid 10-digit mobile number." },
    "chk-country":   { label: "Country" },
    "chk-state":     { label: "State" },
    "chk-city":      { label: "City" },
    "chk-address1":  { label: "Address line 1" },
    "chk-postal":    { label: "Postal code",
                       pattern: /^\d{4,10}$/,
                       msg: "Enter a valid postal code." }
  };

  function getErrorEl(id) { return el(id + "-err"); }

  function showError(id, message) {
    var field = el(id);
    var errEl = getErrorEl(id);
    if (field) { field.classList.add("is-invalid"); field.classList.remove("is-valid"); }
    if (errEl) { errEl.textContent = message; errEl.hidden = false; }
  }

  function clearError(id) {
    var field = el(id);
    var errEl = getErrorEl(id);
    if (field) { field.classList.remove("is-invalid"); field.classList.add("is-valid"); }
    if (errEl) errEl.hidden = true;
  }

  function validateField(id) {
    var rule = RULES[id];
    if (!rule) return true;
    var field = el(id);
    if (!field) return true;

    var value = field.value.trim();

    if (!value) {
      showError(id, rule.label + " is required.");
      return false;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      showError(id, rule.msg || ("Please enter a valid " + rule.label.toLowerCase() + "."));
      return false;
    }

    clearError(id);
    return true;
  }

  function validateAll() {
    var allValid = true;
    Object.keys(RULES).forEach(function (id) {
      if (!validateField(id)) allValid = false;
    });
    return allValid;
  }

  /* Live validation: validate on blur; re-validate on input once touched */
  Object.keys(RULES).forEach(function (id) {
    var field = el(id);
    if (!field) return;
    field.addEventListener("blur", function () { validateField(id); });
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid")) validateField(id);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Payment method cards                                                 */
  /* ------------------------------------------------------------------ */
  var PAYMENT_NOTICES = {
    cod:      "Pay with cash when your order arrives at your doorstep. No advance payment required.",
    razorpay: "You will be redirected to Razorpay's secure gateway — pay via UPI, debit/credit card, or netbanking.",
    stripe:   "You will be redirected to Stripe's secure payment page. We accept Visa, Mastercard, and American Express.",
    paypal:   "You will be redirected to PayPal to complete payment. PayPal accepts all major credit and debit cards."
  };

  var paymentCards  = document.querySelectorAll(".payment-card");
  var noticeTextEl  = el("paymentNoticeText");

  paymentCards.forEach(function (card) {
    var radio = card.querySelector(".payment-card__radio");
    if (!radio) return;

    radio.addEventListener("change", function () {
      paymentCards.forEach(function (c) { c.classList.remove("is-selected"); });
      card.classList.add("is-selected");
      if (noticeTextEl) noticeTextEl.textContent = PAYMENT_NOTICES[radio.value] || "";
    });

    /* Set initial state */
    if (radio.checked) {
      card.classList.add("is-selected");
      if (noticeTextEl) noticeTextEl.textContent = PAYMENT_NOTICES[radio.value] || "";
    }
  });

  /* ------------------------------------------------------------------ */
  /* Coupon                                                               */
  /* ------------------------------------------------------------------ */
  var SHIPPING_THRESHOLD = 499;
  var BASE_SUBTOTAL      = 1070;
  var appliedCoupon      = null;

  var COUPONS = {
    ELSAR10:   { type: "percent",  value: 10 },
    FLAT50:   { type: "fixed",    value: 50 },
    FREESHIP: { type: "shipping"            }
  };

  function calcDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    var c = COUPONS[appliedCoupon];
    if (!c || c.type === "shipping") return 0;
    return c.type === "percent" ? Math.round(subtotal * c.value / 100)
                                : Math.min(c.value, subtotal);
  }

  function calcShipping(effectiveSubtotal) {
    if (appliedCoupon && COUPONS[appliedCoupon] && COUPONS[appliedCoupon].type === "shipping") return 0;
    return effectiveSubtotal >= SHIPPING_THRESHOLD ? 0 : 49;
  }

  function updateTotals() {
    var discount  = calcDiscount(BASE_SUBTOTAL);
    var shipping  = calcShipping(BASE_SUBTOTAL - discount);
    var total     = BASE_SUBTOTAL - discount + shipping;

    if (el("chkSubtotal")) el("chkSubtotal").textContent = fmt(BASE_SUBTOTAL);

    var discountRow = el("chkDiscountRow");
    if (discountRow) discountRow.hidden = (discount === 0);
    if (el("chkDiscount")) el("chkDiscount").textContent = "-" + fmt(discount);

    var shipEl = el("chkShipping");
    if (shipEl) {
      if (shipping === 0) {
        shipEl.textContent = "FREE";
        shipEl.className = "chk-val--free";
      } else {
        shipEl.textContent = fmt(shipping);
        shipEl.className = "";
      }
    }

    if (el("chkTotal")) el("chkTotal").textContent = fmt(total);
  }

  function setCouponMsg(text, type) {
    var msgEl = el("chkCouponMsg");
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = "chk-coupon__msg" + (type ? " chk-coupon__msg--" + type : "");
  }

  var couponInput    = el("chkCouponInput");
  var applyCouponBtn = el("chkApplyCoupon");
  var removeCouponBtn= el("chkRemoveCoupon");
  var couponGroup    = el("chkCouponGroup");
  var couponTagEl    = el("chkCouponTag");

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", function () {
      var code = couponInput.value.trim().toUpperCase();
      if (!code) { setCouponMsg("Please enter a coupon code.", "error"); return; }

      if (COUPONS[code]) {
        appliedCoupon = code;
        var c = COUPONS[code];
        var desc = c.type === "percent"  ? c.value + "% discount applied!"
                 : c.type === "fixed"    ? "₹" + c.value + " discount applied!"
                 : "Free shipping applied!";
        setCouponMsg(desc, "success");
        if (couponGroup)    couponGroup.style.display   = "none";
        if (removeCouponBtn) removeCouponBtn.hidden       = false;
        if (couponTagEl)    couponTagEl.textContent      = code;
        updateTotals();
      } else {
        setCouponMsg("Invalid code. Try ELSAR10 or FLAT50.", "error");
      }
    });

    couponInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); applyCouponBtn.click(); }
    });
  }

  if (removeCouponBtn) {
    removeCouponBtn.addEventListener("click", function () {
      appliedCoupon = null;
      setCouponMsg("", "");
      if (couponGroup)    couponGroup.style.display = "";
      if (removeCouponBtn) removeCouponBtn.hidden    = true;
      if (couponInput)    couponInput.value          = "";
      if (couponTagEl)    couponTagEl.textContent    = "";
      el("chkDiscountRow").hidden = true;
      updateTotals();
    });
  }

  updateTotals();

  /* ------------------------------------------------------------------ */
  /* Form submission                                                      */
  /* ------------------------------------------------------------------ */
  var form          = el("checkoutForm");
  var placeOrderBtn = el("placeOrderBtn");
  var btnLabel      = el("chkBtnLabel");
  var btnSpinner    = el("chkBtnSpinner");

  if (form && placeOrderBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateAll()) {
        /* Scroll to first error */
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) {
          var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          firstInvalid.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
          setTimeout(function () { firstInvalid.focus(); }, 300);
        }
        return;
      }

      /* Show loading state */
      placeOrderBtn.disabled = true;
      if (btnLabel)   btnLabel.hidden   = true;
      if (btnSpinner) btnSpinner.hidden = false;

      /* Simulate async order placement (2 s) */
      setTimeout(function () {
        /* Success state */
        if (btnSpinner) btnSpinner.hidden = true;
        if (btnLabel) {
          btnLabel.hidden = false;
          btnLabel.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Order Placed!';
        }
        placeOrderBtn.style.background  = "oklch(50% 0.16 155)";
        placeOrderBtn.style.borderColor = "oklch(50% 0.16 155)";

        /* Show confirmation */
        setTimeout(function () {
          window.alert(
            "✓ Order placed successfully!\n\n" +
            "Thank you for shopping with Elsar.\n" +
            "You will receive a confirmation email shortly.\n\n" +
            "(Connect a real payment gateway / order API in production.)"
          );

          /* Reset button */
          placeOrderBtn.disabled          = false;
          placeOrderBtn.style.background  = "";
          placeOrderBtn.style.borderColor = "";
          if (btnLabel) {
            btnLabel.innerHTML =
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/></svg> Place Order';
          }
        }, 1200);
      }, 2000);
    });
  }

})();
