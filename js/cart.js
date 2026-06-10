(function () {
  "use strict";

  var SHIPPING_THRESHOLD = 499;
  var SHIPPING_COST = 49;

  var COUPONS = {
    ELSAR10: { type: "percent", value: 10, label: "ELSAR10" },
    FLAT50: { type: "fixed", value: 50, label: "FLAT50" },
    FREESHIP: { type: "shipping", value: 0, label: "FREESHIP" }
  };

  var appliedCoupon = null;

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */
  function fmt(n) {
    return "₹" + n.toLocaleString("en-IN");
  }

  function el(id) {
    return document.getElementById(id);
  }

  /* ------------------------------------------------------------------ */
  /* Read / sync badge count                                              */
  /* ------------------------------------------------------------------ */
  function getTotalQty() {
    var total = 0;
    document.querySelectorAll(".cart-item:not(.is-removing)").forEach(function (item) {
      var input = item.querySelector(".cart-qty");
      total += parseInt(input ? input.value : "0", 10) || 0;
    });
    return total;
  }

  function syncBadges(count) {
    document.querySelectorAll(".cart-badge").forEach(function (b) {
      b.textContent = String(count);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Totals                                                               */
  /* ------------------------------------------------------------------ */
  function getSubtotal() {
    var sum = 0;
    document.querySelectorAll(".cart-item:not(.is-removing)").forEach(function (item) {
      var price = parseInt(item.dataset.price, 10) || 0;
      var qty = parseInt((item.querySelector(".cart-qty") || {}).value || "0", 10) || 0;
      sum += price * qty;
    });
    return sum;
  }

  function calcDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    var coupon = COUPONS[appliedCoupon];
    if (!coupon || coupon.type === "shipping") return 0;
    if (coupon.type === "percent") return Math.round(subtotal * coupon.value / 100);
    if (coupon.type === "fixed") return Math.min(coupon.value, subtotal);
    return 0;
  }

  function calcShipping(subtotal, discount) {
    if (!appliedCoupon) {
      return (subtotal >= SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    }
    var coupon = COUPONS[appliedCoupon];
    if (coupon && coupon.type === "shipping") return 0;
    return (subtotal - discount >= SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
  }

  function updateSummary() {
    var subtotal = getSubtotal();
    var discount = calcDiscount(subtotal);
    var shipping = calcShipping(subtotal, discount);
    var total = subtotal - discount + shipping;
    var qty = getTotalQty();
    var itemCount = document.querySelectorAll(".cart-item:not(.is-removing)").length;

    /* Subtotal & count */
    if (el("summarySubtotal")) el("summarySubtotal").textContent = fmt(subtotal);
    if (el("itemCount")) el("itemCount").textContent = String(qty);
    if (el("cartSubtitle")) el("cartSubtitle").textContent = itemCount + " item" + (itemCount !== 1 ? "s" : "") + " in your cart";

    /* Discount row */
    var discountRow = el("discountRow");
    if (discountRow) discountRow.hidden = (discount === 0);
    if (el("summaryDiscount")) el("summaryDiscount").textContent = "-" + fmt(discount);

    /* Shipping */
    var shippingEl = el("summaryShipping");
    if (shippingEl) {
      if (shipping === 0) {
        shippingEl.textContent = "FREE";
        shippingEl.className = "cart-summary__val cart-summary__val--free";
      } else {
        shippingEl.textContent = fmt(shipping);
        shippingEl.className = "cart-summary__val";
      }
    }

    /* Total */
    if (el("summaryTotal")) el("summaryTotal").textContent = fmt(total);

    /* Shipping progress bar */
    updateShippingBar(subtotal - discount);

    /* Cart badge sync */
    syncBadges(qty);
  }

  /* ------------------------------------------------------------------ */
  /* Shipping progress bar                                                */
  /* ------------------------------------------------------------------ */
  function updateShippingBar(effectiveSubtotal) {
    var bar = el("shippingBar");
    var msg = el("shippingBarMsg");
    var track = el("shippingTrack");
    var fill = el("shippingFill");
    if (!bar || !msg) return;

    if (effectiveSubtotal >= SHIPPING_THRESHOLD) {
      msg.innerHTML = "🎉 You qualify for <strong>free shipping!</strong>";
      if (track) track.hidden = true;
    } else {
      var remaining = SHIPPING_THRESHOLD - effectiveSubtotal;
      var pct = Math.round((effectiveSubtotal / SHIPPING_THRESHOLD) * 100);
      msg.innerHTML = "Add <strong>" + fmt(remaining) + " more</strong> for free shipping";
      if (track) {
        track.hidden = false;
        if (fill) fill.style.width = pct + "%";
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Item total display                                                   */
  /* ------------------------------------------------------------------ */
  function updateItemTotal(item) {
    var price = parseInt(item.dataset.price, 10) || 0;
    var qty = parseInt((item.querySelector(".cart-qty") || {}).value || "0", 10) || 0;
    var totalEl = item.querySelector(".cart-item__total");
    if (totalEl) totalEl.textContent = fmt(price * qty);
  }

  /* ------------------------------------------------------------------ */
  /* Quantity controls                                                    */
  /* ------------------------------------------------------------------ */
  function setItemQty(item, newVal) {
    var input = item.querySelector(".cart-qty");
    if (!input) return;
    var clamped = Math.max(1, Math.min(99, newVal));
    input.value = String(clamped);
    var dec = item.querySelector(".cart-dec");
    if (dec) dec.disabled = (clamped <= 1);
    updateItemTotal(item);
    updateSummary();
  }

  /* ------------------------------------------------------------------ */
  /* Remove item                                                          */
  /* ------------------------------------------------------------------ */
  function removeItem(item) {
    /* Measure current height so CSS can collapse it cleanly */
    item.style.maxHeight = item.offsetHeight + "px";
    /* Small rAF so the browser paints the max-height before we add the class */
    requestAnimationFrame(function () {
      item.classList.add("is-removing");
    });

    /* After transition, detach from DOM and re-check empty state */
    var duration = 600;
    setTimeout(function () {
      item.remove();
      updateSummary();
      checkEmpty();
    }, duration);

    showToast("Item removed from cart");
  }

  /* ------------------------------------------------------------------ */
  /* Empty state                                                          */
  /* ------------------------------------------------------------------ */
  function checkEmpty() {
    var remaining = document.querySelectorAll(".cart-item:not(.is-removing)").length;
    var cartList = el("cartList");
    var cartEmpty = el("cartEmpty");
    var summaryCol = el("summaryCol");
    var clearBtn = el("clearCartBtn");
    var shippingBar = el("shippingBar");

    if (remaining === 0) {
      if (cartEmpty) cartEmpty.hidden = false;
      if (summaryCol) summaryCol.style.display = "none";
      if (clearBtn) clearBtn.style.display = "none";
      if (shippingBar) shippingBar.style.display = "none";
      /* Update heading */
      var cartSubtitle = el("cartSubtitle");
      if (cartSubtitle) cartSubtitle.textContent = "Your cart is empty";
      syncBadges(0);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Attach listeners to a single item                                   */
  /* ------------------------------------------------------------------ */
  function bindItem(item) {
    var dec = item.querySelector(".cart-dec");
    var inc = item.querySelector(".cart-inc");
    var removeBtn = item.querySelector(".cart-item__remove");
    var qtyInput = item.querySelector(".cart-qty");

    if (dec) {
      /* Disable if qty is already 1 */
      if (qtyInput && parseInt(qtyInput.value, 10) <= 1) dec.disabled = true;
      dec.addEventListener("click", function () {
        setItemQty(item, parseInt((item.querySelector(".cart-qty") || {}).value || "1", 10) - 1);
      });
    }
    if (inc) {
      inc.addEventListener("click", function () {
        setItemQty(item, parseInt((item.querySelector(".cart-qty") || {}).value || "1", 10) + 1);
      });
    }
    if (removeBtn) {
      removeBtn.addEventListener("click", function () { removeItem(item); });
    }
    if (qtyInput) {
      qtyInput.addEventListener("change", function () {
        setItemQty(item, parseInt(qtyInput.value, 10) || 1);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Clear all                                                            */
  /* ------------------------------------------------------------------ */
  var clearBtn = el("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!window.confirm("Remove all items from your cart?")) return;
      document.querySelectorAll(".cart-item:not(.is-removing)").forEach(function (item) {
        item.style.maxHeight = item.offsetHeight + "px";
        requestAnimationFrame(function () { item.classList.add("is-removing"); });
        setTimeout(function () { item.remove(); }, 600);
      });
      setTimeout(function () {
        updateSummary();
        checkEmpty();
      }, 650);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Coupon                                                               */
  /* ------------------------------------------------------------------ */
  var couponInput = el("couponInput");
  var applyCouponBtn = el("applyCouponBtn");
  var removeCouponBtn = el("removeCouponBtn");
  var couponMsg = el("couponMsg");
  var couponInputGroup = el("couponInputGroup");
  var appliedCouponTag = el("appliedCouponTag");

  function setCouponMsg(text, type) {
    if (!couponMsg) return;
    couponMsg.textContent = text;
    couponMsg.className = "coupon-msg" + (type ? " coupon-msg--" + type : "");
  }

  function showCouponRemove(code) {
    if (couponInputGroup) couponInputGroup.style.display = "none";
    if (removeCouponBtn) removeCouponBtn.hidden = false;
    if (appliedCouponTag) appliedCouponTag.textContent = code;
  }

  function hideCouponRemove() {
    if (couponInputGroup) couponInputGroup.style.display = "";
    if (removeCouponBtn) removeCouponBtn.hidden = true;
    if (couponInput) couponInput.value = "";
    if (appliedCouponTag) appliedCouponTag.textContent = "";
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", function () {
      var code = couponInput.value.trim().toUpperCase();
      if (!code) {
        setCouponMsg("Please enter a coupon code.", "error");
        return;
      }
      if (COUPONS[code]) {
        appliedCoupon = code;
        var coupon = COUPONS[code];
        var desc = coupon.type === "percent" ? coupon.value + "% off applied!"
                 : coupon.type === "fixed" ? "₹" + coupon.value + " off applied!"
                 : "Free shipping applied!";
        setCouponMsg(desc, "success");
        showCouponRemove(code);
        updateSummary();
      } else {
        setCouponMsg("Invalid coupon code. Try ELSAR10 or FLAT50.", "error");
      }
    });

    couponInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCouponBtn.click();
      }
    });
  }

  if (removeCouponBtn) {
    removeCouponBtn.addEventListener("click", function () {
      appliedCoupon = null;
      setCouponMsg("", "");
      hideCouponRemove();
      updateSummary();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Toast                                                                */
  /* ------------------------------------------------------------------ */
  var toastTimer = null;
  function showToast(message) {
    var toast = el("cartToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2500);
  }

  /* ------------------------------------------------------------------ */
  /* Footer year                                                          */
  /* ------------------------------------------------------------------ */
  var yearEl = el("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll(".cart-item").forEach(function (item) {
    bindItem(item);
  });

  updateSummary();

})();
