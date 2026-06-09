(function () {
  "use strict";

  var form         = document.getElementById("signupForm");
  var nameInput    = document.getElementById("signupName");
  var emailInput   = document.getElementById("signupEmail");
  var phoneInput   = document.getElementById("signupPhone");
  var pwdInput     = document.getElementById("signupPassword");
  var confirmInput = document.getElementById("signupConfirm");
  var termsInput   = document.getElementById("agreeTerms");

  var nameErr    = document.getElementById("nameErr");
  var emailErr   = document.getElementById("emailErr");
  var phoneErr   = document.getElementById("phoneErr");
  var pwdErr     = document.getElementById("passwordErr");
  var confirmErr = document.getElementById("confirmErr");
  var termsErr   = document.getElementById("termsErr");

  var btnLabel   = document.getElementById("signupBtnLabel");
  var btnSpinner = document.getElementById("signupBtnSpinner");
  var successBox = document.getElementById("signupSuccess");

  /* ── Password show/hide ── */
  initPwdToggle("signupPwdToggle", pwdInput);
  initPwdToggle("signupConfirmToggle", confirmInput);

  function initPwdToggle(btnId, input) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isText = input.type === "text";
      input.type = isText ? "password" : "text";
      btn.querySelector(".auth-eye-show").hidden = !isText;
      btn.querySelector(".auth-eye-hide").hidden = isText;
      btn.setAttribute("aria-label", isText ? "Show password" : "Hide password");
    });
  }

  /* ── Strength meter ── */
  var segs  = [document.getElementById("seg1"), document.getElementById("seg2"),
               document.getElementById("seg3"), document.getElementById("seg4")];
  var label = document.getElementById("pwdStrengthLabel");

  function calcStrength(v) {
    var score = 0;
    if (v.length >= 8)  score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return Math.min(score, 4);
  }

  var STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
  var STRENGTH_CLASSES = ["", "auth-strength__seg--weak", "auth-strength__seg--fair",
                               "auth-strength__seg--good", "auth-strength__seg--strong"];

  pwdInput.addEventListener("input", function () {
    var v      = pwdInput.value;
    var score  = v ? calcStrength(v) : 0;
    segs.forEach(function (seg, i) {
      seg.className = "auth-strength__seg";
      if (score > 0 && i < score) seg.classList.add(STRENGTH_CLASSES[score]);
    });
    label.textContent = v ? STRENGTH_LABELS[score] : "";

    if (document.getElementById("passwordField").dataset.touched) {
      setError(document.getElementById("passwordField"), pwdErr, v.length < 8);
    }
    if (document.getElementById("confirmField").dataset.touched && confirmInput.value) {
      setError(document.getElementById("confirmField"), confirmErr, confirmInput.value !== v);
    }
  });

  /* ── Helpers ── */
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function isValidPhone(v) {
    return /^[6-9]\d{9}$/.test(v.replace(/\s/g, ""));
  }

  function setError(field, errEl, show) {
    var wrap = field.querySelector(".auth-input-wrap");
    errEl.hidden = !show;
    if (wrap) {
      wrap.classList.toggle("auth-input-wrap--error", show);
      wrap.classList.toggle("auth-input-wrap--valid", !show && field.dataset.touched === "1");
    }
  }

  function markTouched(field) {
    field.dataset.touched = "1";
  }

  /* ── Blur validation ── */
  function blurValidate(inputEl, fieldId, errEl, checker) {
    inputEl.addEventListener("blur", function () {
      var field = document.getElementById(fieldId);
      markTouched(field);
      setError(field, errEl, !checker(inputEl.value));
    });
    inputEl.addEventListener("input", function () {
      var field = document.getElementById(fieldId);
      if (field.dataset.touched) {
        setError(field, errEl, !checker(inputEl.value));
      }
    });
  }

  blurValidate(nameInput,  "nameField",  nameErr,  function (v) { return v.trim().length >= 2; });
  blurValidate(emailInput, "emailField", emailErr, function (v) { return isValidEmail(v); });
  blurValidate(phoneInput, "phoneField", phoneErr, function (v) { return isValidPhone(v); });
  blurValidate(pwdInput,   "passwordField", pwdErr, function (v) { return v.length >= 8; });

  confirmInput.addEventListener("blur", function () {
    var field = document.getElementById("confirmField");
    markTouched(field);
    setError(field, confirmErr, confirmInput.value !== pwdInput.value || !confirmInput.value);
  });
  confirmInput.addEventListener("input", function () {
    var field = document.getElementById("confirmField");
    if (field.dataset.touched) {
      setError(field, confirmErr, confirmInput.value !== pwdInput.value);
    }
  });

  /* Allow only digits in phone */
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
  });

  /* ── Submit ── */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nameOk    = nameInput.value.trim().length >= 2;
    var emailOk   = isValidEmail(emailInput.value);
    var phoneOk   = isValidPhone(phoneInput.value);
    var pwdOk     = pwdInput.value.length >= 8;
    var confirmOk = confirmInput.value === pwdInput.value && confirmInput.value;
    var termsOk   = termsInput.checked;

    /* Mark all touched */
    ["nameField","emailField","phoneField","passwordField","confirmField"].forEach(function (id) {
      markTouched(document.getElementById(id));
    });

    setError(document.getElementById("nameField"),    nameErr,    !nameOk);
    setError(document.getElementById("emailField"),   emailErr,   !emailOk);
    setError(document.getElementById("phoneField"),   phoneErr,   !phoneOk);
    setError(document.getElementById("passwordField"),pwdErr,     !pwdOk);
    setError(document.getElementById("confirmField"), confirmErr, !confirmOk);
    termsErr.hidden = termsOk;

    if (!nameOk || !emailOk || !phoneOk || !pwdOk || !confirmOk || !termsOk) {
      var firstErr = form.querySelector(".auth-input-wrap--error input") ||
                     (!termsOk ? termsInput : null);
      if (firstErr) firstErr.focus();
      return;
    }

    /* Simulate account creation */
    btnLabel.hidden   = true;
    btnSpinner.hidden = false;
    form.querySelector("button[type=submit]").disabled = true;

    setTimeout(function () {
      btnLabel.hidden   = false;
      btnSpinner.hidden = true;
      form.querySelector("button[type=submit]").hidden = true;
      successBox.hidden = false;
      setTimeout(function () {
        window.location.href = "index.html";
      }, 2000);
    }, 1600);
  });
}());
