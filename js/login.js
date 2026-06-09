(function () {
  "use strict";

  var form       = document.getElementById("loginForm");
  var emailInput = document.getElementById("loginEmail");
  var pwdInput   = document.getElementById("loginPassword");
  var emailErr   = document.getElementById("emailErr");
  var pwdErr     = document.getElementById("passwordErr");
  var btnLabel   = document.getElementById("loginBtnLabel");
  var btnSpinner = document.getElementById("loginBtnSpinner");
  var successBox = document.getElementById("loginSuccess");
  var pwdToggle  = document.getElementById("loginPwdToggle");

  /* ── Password show/hide ── */
  if (pwdToggle) {
    pwdToggle.addEventListener("click", function () {
      var isText = pwdInput.type === "text";
      pwdInput.type = isText ? "password" : "text";
      pwdToggle.querySelector(".auth-eye-show").hidden = !isText;
      pwdToggle.querySelector(".auth-eye-hide").hidden = isText;
      pwdToggle.setAttribute("aria-label", isText ? "Show password" : "Hide password");
    });
  }

  /* ── Field validation helpers ── */
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function setError(wrap, errEl, show) {
    var inputWrap = wrap.querySelector(".auth-input-wrap");
    errEl.hidden = !show;
    if (inputWrap) {
      inputWrap.classList.toggle("auth-input-wrap--error", show);
      inputWrap.classList.toggle("auth-input-wrap--valid", !show && wrap.dataset.touched === "1");
    }
  }

  function markTouched(field) {
    field.dataset.touched = "1";
  }

  /* ── Live validation on blur ── */
  emailInput.addEventListener("blur", function () {
    markTouched(document.getElementById("emailField"));
    setError(document.getElementById("emailField"), emailErr, !isValidEmail(emailInput.value));
  });

  pwdInput.addEventListener("blur", function () {
    markTouched(document.getElementById("passwordField"));
    setError(document.getElementById("passwordField"), pwdErr, pwdInput.value.length < 6);
  });

  emailInput.addEventListener("input", function () {
    if (document.getElementById("emailField").dataset.touched) {
      setError(document.getElementById("emailField"), emailErr, !isValidEmail(emailInput.value));
    }
  });

  pwdInput.addEventListener("input", function () {
    if (document.getElementById("passwordField").dataset.touched) {
      setError(document.getElementById("passwordField"), pwdErr, pwdInput.value.length < 6);
    }
  });

  /* ── Submit ── */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var emailOk = isValidEmail(emailInput.value);
    var pwdOk   = pwdInput.value.length >= 6;

    markTouched(document.getElementById("emailField"));
    markTouched(document.getElementById("passwordField"));
    setError(document.getElementById("emailField"), emailErr, !emailOk);
    setError(document.getElementById("passwordField"), pwdErr, !pwdOk);

    if (!emailOk || !pwdOk) {
      var firstErr = form.querySelector(".auth-input-wrap--error input");
      if (firstErr) firstErr.focus();
      return;
    }

    /* Simulate sign-in */
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
      }, 1800);
    }, 1400);
  });
}());
