(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Footer year                                                          */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Validation rules                                                     */
  /* ------------------------------------------------------------------ */
  var RULES = {
    "ctc-name": {
      label: "Full name"
    },
    "ctc-phone": {
      label: "Phone number",
      pattern: /^[0-9+\-\s]{7,15}$/,
      msg: "Enter a valid phone number."
    },
    "ctc-email": {
      label: "Email address",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      msg: "Enter a valid email address."
    },
    "ctc-message": {
      label: "Message",
      minLength: 10,
      msg: "Please write at least 10 characters."
    }
  };

  function el(id) { return document.getElementById(id); }

  function getErrEl(id) { return el(id + "-err"); }

  function showError(id, message) {
    var field = el(id);
    var errEl = getErrEl(id);
    if (field) { field.classList.add("is-invalid"); field.classList.remove("is-valid"); }
    if (errEl) { errEl.textContent = message; errEl.hidden = false; }
  }

  function clearError(id) {
    var field = el(id);
    var errEl = getErrEl(id);
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
    if (rule.minLength && value.length < rule.minLength) {
      showError(id, rule.msg);
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
    var ok = true;
    Object.keys(RULES).forEach(function (id) {
      if (!validateField(id)) ok = false;
    });
    return ok;
  }

  /* Live validation: on blur; re-check while invalid */
  Object.keys(RULES).forEach(function (id) {
    var field = el(id);
    if (!field) return;
    field.addEventListener("blur",  function () { validateField(id); });
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid")) validateField(id);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Form submission                                                      */
  /* ------------------------------------------------------------------ */
  var form        = el("contactForm");
  var submitBtn   = el("ctcSubmitBtn");
  var btnLabel    = el("ctcBtnLabel");
  var btnSpinner  = el("ctcBtnSpinner");
  var successEl   = el("ctcSuccess");
  var sendAnother = el("ctcSendAnother");

  function showSuccess() {
    if (form)      form.hidden      = true;
    if (successEl) successEl.hidden = false;
    if (submitBtn) submitBtn.hidden = true;
  }

  function resetForm() {
    if (form) {
      form.reset();
      form.hidden = false;
      /* Clear all validation states */
      Object.keys(RULES).forEach(function (id) {
        var field = el(id);
        if (field) { field.classList.remove("is-valid", "is-invalid"); }
        var errEl = getErrEl(id);
        if (errEl) errEl.hidden = true;
      });
    }
    if (successEl) successEl.hidden = true;
    if (submitBtn) {
      submitBtn.hidden   = false;
      submitBtn.disabled = false;
    }
    if (btnLabel)  btnLabel.hidden  = false;
    if (btnSpinner) btnSpinner.hidden = true;
  }

  if (form && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateAll()) {
        /* Scroll to first invalid field */
        var firstBad = form.querySelector(".is-invalid");
        if (firstBad) {
          var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          firstBad.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
          setTimeout(function () { firstBad.focus(); }, 280);
        }
        return;
      }

      /* Show loading state */
      submitBtn.disabled = true;
      if (btnLabel)  btnLabel.hidden  = true;
      if (btnSpinner) btnSpinner.hidden = false;

      /* Simulate network request (1.8 s) */
      setTimeout(function () {
        showSuccess();
        /* Announce to screen readers */
        if (successEl) successEl.focus();
      }, 1800);
    });
  }

  /* "Send another message" resets everything */
  if (sendAnother) {
    sendAnother.addEventListener("click", function () { resetForm(); });
  }

  /* ------------------------------------------------------------------ */
  /* Character counter for message textarea (optional quality-of-life)  */
  /* ------------------------------------------------------------------ */
  var messageField = el("ctc-message");
  if (messageField) {
    var counter = document.createElement("span");
    counter.className = "chk-optional";
    counter.style.cssText = "float:right; font-size: var(--text-small);";
    counter.setAttribute("aria-live", "polite");

    var labelEl = messageField.previousElementSibling;
    if (labelEl && labelEl.classList.contains("chk-label")) {
      labelEl.appendChild(counter);
    }

    function updateCounter() {
      var len = messageField.value.length;
      counter.textContent = len > 0 ? len + " chars" : "";
    }

    messageField.addEventListener("input", updateCounter);
  }

})();
