(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     ORDER DATABASE
  ────────────────────────────────────────────── */
  var ORDERS = {
    "ORD12345": {
      id: "ORD12345",
      date: "15 Jul 2026",
      dateISO: "2026-07-15",
      payment: "Razorpay",
      paymentRef: "TXN123456",
      paymentStatus: "Paid",
      status: "Shipped",
      statusKey: "shipped",
      currentStep: 3,
      estDelivery: "20 Jul 2026",
      courier: "DTDC",
      trackingNo: "DTDC12345678",
      shippedDate: "16 Jul 2026",
      subtotal: 599,
      discount: 60,
      coupon: "ELSAR10",
      shipping: 0,
      total: 539,
      address: {
        name: "Arjun Krishnan",
        line1: "12/B, Puthiyavila House",
        line2: "Near St. Thomas Church",
        line3: "Kaduthuruthy, Kottayam",
        line4: "Kerala 686 603, India",
        phone: "09539195111"
      },
      items: [
        { name: "Elsar Chicken Curry Masala", variant: "250 g", qty: 2, price: 150, img: "assets/images/products1.jpeg" },
        { name: "Elsar Garam Masala",         variant: "100 g", qty: 1, price:  89, img: "assets/images/products2.jpg"  },
        { name: "Elsar Premium Tea Powder",   variant: "500 g", qty: 1, price: 210, img: "assets/images/products3.jpg"  }
      ],
      timeline: [
        { title: "Package Shipped via DTDC",  desc: "Tracking number DTDC12345678 generated. Package handed to courier.", time: "16 Jul 2026, 9:45 AM",  iso: "2026-07-16T09:45", done: true },
        { title: "Order Packed & Ready",       desc: "Items packed and quality checked by our warehouse team.",           time: "15 Jul 2026, 2:15 PM",  iso: "2026-07-15T14:15", done: true },
        { title: "Order Confirmed",            desc: "Your order has been confirmed and forwarded to the warehouse.",    time: "15 Jul 2026, 11:00 AM", iso: "2026-07-15T11:00", done: true },
        { title: "Payment Received",           desc: "₹539 paid via Razorpay. Transaction ID: TXN123456.",              time: "15 Jul 2026, 10:33 AM", iso: "2026-07-15T10:33", done: true },
        { title: "Order Placed",               desc: "Order #ORD12345 successfully placed.",                             time: "15 Jul 2026, 10:32 AM", iso: "2026-07-15T10:32", done: true }
      ],
      trackerDates: [
        "15 Jul 2026, 10:32 AM",
        "15 Jul 2026, 11:00 AM",
        "15 Jul 2026, 2:15 PM",
        "16 Jul 2026, 9:45 AM",
        "Expected: 20 Jul 2026",
        "Pending"
      ]
    },

    "ORD12089": {
      id: "ORD12089",
      date: "28 Jun 2026",
      dateISO: "2026-06-28",
      payment: "Cash on Delivery",
      paymentRef: "COD",
      paymentStatus: "Paid on Delivery",
      status: "Delivered",
      statusKey: "delivered",
      currentStep: 5,
      estDelivery: "3 Jul 2026",
      courier: "BlueDart",
      trackingNo: "BD987654321",
      shippedDate: "30 Jun 2026",
      subtotal: 289,
      discount: 0,
      coupon: null,
      shipping: 0,
      total: 289,
      address: {
        name: "Arjun Krishnan",
        line1: "12/B, Puthiyavila House",
        line2: "Near St. Thomas Church",
        line3: "Kaduthuruthy, Kottayam",
        line4: "Kerala 686 603, India",
        phone: "09539195111"
      },
      items: [
        { name: "Elsar Garam Masala",       variant: "100 g", qty: 1, price:  89, img: "assets/images/products2.jpg"  },
        { name: "Elsar Black Pepper Powder", variant: "200 g", qty: 1, price: 200, img: "assets/images/products4.jpeg" }
      ],
      timeline: [
        { title: "Order Delivered",       desc: "Package delivered successfully. Thank you for shopping with Elsar!", time: "3 Jul 2026, 2:10 PM",   iso: "2026-07-03T14:10", done: true },
        { title: "Out for Delivery",      desc: "Your order is out for delivery. Expect it by end of day.",         time: "3 Jul 2026, 8:30 AM",   iso: "2026-07-03T08:30", done: true },
        { title: "Package Shipped",       desc: "Package shipped via BlueDart. Tracking: BD987654321.",             time: "30 Jun 2026, 10:20 AM", iso: "2026-06-30T10:20", done: true },
        { title: "Order Confirmed",       desc: "Order confirmed and moved to warehouse for packing.",              time: "28 Jun 2026, 3:00 PM",  iso: "2026-06-28T15:00", done: true },
        { title: "Order Placed",          desc: "Order #ORD12089 successfully placed.",                            time: "28 Jun 2026, 2:45 PM",  iso: "2026-06-28T14:45", done: true }
      ],
      trackerDates: [
        "28 Jun 2026, 2:45 PM",
        "28 Jun 2026, 3:00 PM",
        "29 Jun 2026, 11:00 AM",
        "30 Jun 2026, 10:20 AM",
        "3 Jul 2026, 8:30 AM",
        "3 Jul 2026, 2:10 PM"
      ]
    },

    "ORD11876": {
      id: "ORD11876",
      date: "10 Jul 2026",
      dateISO: "2026-07-10",
      payment: "Razorpay",
      paymentRef: "TXN987321",
      paymentStatus: "Paid",
      status: "Processing",
      statusKey: "processing",
      currentStep: 2,
      estDelivery: "14 Jul 2026",
      courier: "—",
      trackingNo: "—",
      shippedDate: "—",
      subtotal: 450,
      discount: 0,
      coupon: null,
      shipping: 0,
      total: 450,
      address: {
        name: "Arjun Krishnan",
        line1: "12/B, Puthiyavila House",
        line2: "Near St. Thomas Church",
        line3: "Kaduthuruthy, Kottayam",
        line4: "Kerala 686 603, India",
        phone: "09539195111"
      },
      items: [
        { name: "Elsar Premium Tea Powder", variant: "500 g", qty: 2, price: 225, img: "assets/images/products3.jpg" }
      ],
      timeline: [
        { title: "Order Under Processing", desc: "Your order is being prepared by our warehouse team.",           time: "10 Jul 2026, 5:00 PM",  iso: "2026-07-10T17:00", done: true },
        { title: "Payment Received",       desc: "₹450 paid via Razorpay. Transaction ID: TXN987321.",           time: "10 Jul 2026, 4:02 PM",  iso: "2026-07-10T16:02", done: true },
        { title: "Order Placed",           desc: "Order #ORD11876 successfully placed.",                         time: "10 Jul 2026, 4:01 PM",  iso: "2026-07-10T16:01", done: true }
      ],
      trackerDates: [
        "10 Jul 2026, 4:01 PM",
        "10 Jul 2026, 4:15 PM",
        "10 Jul 2026, 5:00 PM",
        "Expected: 12 Jul 2026",
        "Expected: 14 Jul 2026",
        "Pending"
      ]
    }
  };

  var BADGE_CLASS = {
    shipped:    "ord-badge--shipped",
    delivered:  "ord-badge--delivered",
    processing: "ord-badge--processing",
    confirmed:  "ord-badge--processing",
    placed:     "ord-badge--processing"
  };

  /* ──────────────────────────────────────────────
     PRODUCT IMAGES — inject into order list cards
  ────────────────────────────────────────────── */
  var IMGS = [
    "assets/images/products1.jpeg",
    "assets/images/products2.jpg",
    "assets/images/products3.jpg",
    "assets/images/products4.jpeg"
  ];

  function injectThumb(wrap, src) {
    var img = document.createElement("img");
    img.src     = src;
    img.alt     = "";
    img.loading = "lazy";
    img.onerror = function () { this.style.display = "none"; };
    wrap.appendChild(img);
  }

  function injectListThumbs() {
    document.querySelectorAll(".ord-list-card").forEach(function (card, ci) {
      card.querySelectorAll(".ord-list-card__thumb").forEach(function (thumb, ti) {
        injectThumb(thumb, IMGS[(ci + ti) % IMGS.length]);
      });
    });
  }

  /* ──────────────────────────────────────────────
     RENDER DETAIL VIEW
  ────────────────────────────────────────────── */
  function renderDetail(orderId) {
    var o = ORDERS[orderId];
    if (!o) return false;

    /* Page heading */
    var headEl = document.getElementById("ordDetailHead");
    headEl.innerHTML =
      '<div>' +
        '<h1 class="ord-page-head__title">Order <span class="ord-page-head__id">#' + o.id + '</span></h1>' +
        '<p class="ord-page-head__meta">' +
          'Placed on <strong>' + o.date + '</strong>' +
          '<span class="ord-dot" aria-hidden="true">·</span>' +
          '<span class="ord-badge ord-badge--paid"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>' + o.paymentStatus + '</span>' +
          '<span class="ord-dot" aria-hidden="true">·</span>' +
          o.payment +
        '</p>' +
      '</div>' +
      '<div class="ord-page-head__actions d-flex gap-2 flex-wrap">' +
        '<button type="button" class="btn btn-outline-secondary btn-sm ord-action-btn" id="headInvoiceBtn">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Invoice' +
        '</button>' +
        '<button type="button" class="btn btn-accent btn-sm ord-action-btn" id="headReorderBtn">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.86"/></svg>Reorder' +
        '</button>' +
      '</div>';

    /* Status badge */
    var badgeEl = document.getElementById("detailStatusBadge");
    badgeEl.className = "ord-badge ms-auto " + (BADGE_CLASS[o.statusKey] || "ord-badge--shipped");
    badgeEl.textContent = o.status;

    /* Tracker steps */
    var steps = document.querySelectorAll("#ordTracker .ord-tracker__step");
    steps.forEach(function (step, i) {
      step.classList.remove("ord-tracker__step--done", "ord-tracker__step--active", "ord-tracker__step--pending");
      if (i < o.currentStep) {
        step.classList.add("ord-tracker__step--done");
        step.removeAttribute("aria-current");
      } else if (i === o.currentStep) {
        step.classList.add("ord-tracker__step--active");
        step.setAttribute("aria-current", "step");
      } else {
        step.classList.add("ord-tracker__step--pending");
        step.removeAttribute("aria-current");
      }
      var dateEl = document.getElementById("trackerDate" + i);
      if (dateEl) dateEl.textContent = o.trackerDates[i] || "—";
    });

    /* Items */
    var itemsEl = document.getElementById("detailItemsList");
    itemsEl.innerHTML = o.items.map(function (item) {
      return '<div class="ord-item">' +
        '<div class="ord-item__img-wrap">' +
          '<span class="ord-item__img-placeholder" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="ord-item__details">' +
          '<p class="ord-item__name">' + item.name + '</p>' +
          '<p class="ord-item__variant">' + item.variant + ' · Qty: ' + item.qty + '</p>' +
        '</div>' +
        '<div class="ord-item__pricing">' +
          '<p class="ord-item__unit">₹' + item.price + ' × ' + item.qty + '</p>' +
          '<p class="ord-item__total">₹' + (item.price * item.qty) + '</p>' +
        '</div>' +
      '</div>';
    }).join("");

    /* Inject item images */
    itemsEl.querySelectorAll(".ord-item__img-wrap").forEach(function (wrap, i) {
      var src = (o.items[i] && o.items[i].img) ? o.items[i].img : IMGS[i % IMGS.length];
      var img = document.createElement("img");
      img.src = src; img.alt = o.items[i] ? o.items[i].name : ""; img.loading = "lazy";
      img.className = "ord-item__img";
      img.onerror = function () { this.style.display = "none"; };
      wrap.appendChild(img);
    });

    /* Summary */
    document.getElementById("detailSummaryList").innerHTML =
      row("Order #", '<span class="ord-val--mono">#' + o.id + '</span>') +
      row("Date", o.date) +
      row("Payment", o.payment) +
      row("Status", '<span class="ord-badge ' + (BADGE_CLASS[o.statusKey] || "") + '">' + o.status + '</span>') +
      row("Est. Delivery", '<strong>' + o.estDelivery + '</strong>');

    /* Billing */
    var billingHTML =
      billingRow("Subtotal (" + o.items.length + " items)", "₹" + o.subtotal);
    if (o.discount) {
      billingHTML +=
        '<div class="ord-billing__row ord-billing__row--discount">' +
          '<span>Discount <span class="ord-coupon-tag">' + o.coupon + '</span></span>' +
          '<span>-₹' + o.discount + '</span>' +
        '</div>';
    }
    billingHTML += billingRow("Shipping", o.shipping === 0 ? '<span class="ord-val--free">FREE</span>' : "₹" + o.shipping);
    billingHTML += billingRow("Tax", '<span class="ord-val--muted">Included</span>');
    billingHTML += '<hr class="ord-divider" style="margin:var(--space-xs) 0;">';
    billingHTML +=
      '<div class="ord-billing__row ord-billing__row--grand">' +
        '<span>Grand Total</span><span>₹' + o.total + '</span>' +
      '</div>';
    document.getElementById("detailBilling").innerHTML = billingHTML;

    /* Address */
    document.getElementById("detailAddress").innerHTML =
      '<p class="ord-address__name">' + o.address.name + '</p>' +
      '<p>' + o.address.line1 + '<br>' + o.address.line2 + '<br>' + o.address.line3 + '<br>' + o.address.line4 + '</p>' +
      '<p><a href="tel:' + o.address.phone + '">' + o.address.phone + '</a></p>';

    /* Payment */
    document.getElementById("detailPayment").innerHTML =
      row("Method", o.payment) +
      row("Reference", '<span class="ord-val--mono">' + o.paymentRef + '</span>') +
      row("Date", o.date) +
      row("Status", '<span class="ord-badge ord-badge--paid">' + o.paymentStatus + '</span>');

    /* Delivery */
    document.getElementById("detailDelivery").innerHTML =
      row("Courier", o.courier) +
      row("Tracking #", '<span class="ord-val--mono">' + o.trackingNo + '</span>') +
      row("Shipped", o.shippedDate) +
      row("Est. Delivery", '<strong>' + o.estDelivery + '</strong>');

    var trackBtnWrap = document.getElementById("detailTrackBtn");
    if (o.trackingNo !== "—") {
      trackBtnWrap.innerHTML =
        '<button type="button" class="btn btn-outline-secondary w-100 ord-action-btn" id="courierTrackBtn">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          'Track Shipment' +
        '</button>';
      document.getElementById("courierTrackBtn").addEventListener("click", function () {
        alert("Redirecting to " + o.courier + " tracking for: " + o.trackingNo);
      });
    } else {
      trackBtnWrap.innerHTML = "";
    }

    /* Timeline */
    document.getElementById("detailTimeline").innerHTML = o.timeline.map(function (ev) {
      return '<li class="ord-timeline__event' + (ev.done ? " ord-timeline__event--done" : "") + '">' +
        '<div class="ord-timeline__dot" aria-hidden="true"></div>' +
        '<div class="ord-timeline__body">' +
          '<p class="ord-timeline__title">' + ev.title + '</p>' +
          '<p class="ord-timeline__desc">' + ev.desc + '</p>' +
          '<time class="ord-timeline__time" datetime="' + ev.iso + '">' + ev.time + '</time>' +
        '</div>' +
      '</li>';
    }).join("");

    /* Action buttons */
    document.getElementById("detailInvoiceBtn").onclick = function () {
      if (o.statusKey === "delivered") {
        alert("Downloading invoice for order #" + o.id);
      } else {
        alert("Invoice will be available once your order is delivered.");
      }
    };
    document.getElementById("detailReorderBtn").onclick = function () {
      window.location.href = "cart.html";
    };

    return true;
  }

  /* Helpers */
  function row(label, value) {
    return '<div class="ord-summary-row"><dt>' + label + '</dt><dd>' + value + '</dd></div>';
  }
  function billingRow(label, value) {
    return '<div class="ord-billing__row"><span>' + label + '</span><span>' + value + '</span></div>';
  }

  /* ──────────────────────────────────────────────
     SHOW / HIDE VIEWS
  ────────────────────────────────────────────── */
  function showListView() {
    document.getElementById("ordListView").hidden  = false;
    document.getElementById("ordDetailView").hidden = true;
    window.scrollTo({ top: document.getElementById("ordListView").offsetTop - 80, behavior: "smooth" });
  }

  function showDetailView(orderId) {
    var ok = renderDetail(orderId);
    if (!ok) return;
    document.getElementById("ordListView").hidden  = true;
    document.getElementById("ordDetailView").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ──────────────────────────────────────────────
     LOOKUP FORM
  ────────────────────────────────────────────── */
  function initLookup() {
    var form  = document.getElementById("ordLookupForm");
    var input = document.getElementById("ordLookupInput");
    var msg   = document.getElementById("ordLookupMsg");
    var notFound = document.getElementById("ordNotFound");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (input.value || "").trim().replace(/^#/, "").toUpperCase();
      if (!val) return;

      if (ORDERS[val]) {
        msg.textContent = "";
        msg.className   = "ord-lookup-bar__hint";
        notFound.hidden = true;
        showDetailView(val);
      } else {
        msg.innerHTML =
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          ' No order found for &ldquo;' + val + '&rdquo;. Please check your order number.';
        msg.className = "ord-lookup-bar__hint ord-lookup-bar__hint--error";

        /* Show not-found message in list area */
        document.getElementById("ordList").hidden    = true;
        notFound.hidden                               = false;
        document.getElementById("ordNotFoundId").textContent = "#" + val;
        showListView();
      }
    });

    /* Clear search */
    var clearBtn = document.getElementById("ordClearSearch");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value  = "";
        msg.textContent = "";
        msg.className   = "ord-lookup-bar__hint";
        document.getElementById("ordList").hidden = false;
        notFound.hidden = true;
      });
    }
  }

  /* ──────────────────────────────────────────────
     VIEW DETAILS BUTTONS
  ────────────────────────────────────────────── */
  function initDetailButtons() {
    document.getElementById("ordList").addEventListener("click", function (e) {
      var btn = e.target.closest(".ord-list-card__detail-btn");
      if (!btn) return;
      showDetailView(btn.dataset.orderId);
    });

    /* Reorder buttons on list cards */
    document.getElementById("ordList").addEventListener("click", function (e) {
      var btn = e.target.closest(".ord-list-card__reorder-btn");
      if (!btn) return;
      window.location.href = "cart.html";
    });

    /* Invoice buttons on list cards */
    document.getElementById("ordList").addEventListener("click", function (e) {
      var btn = e.target.closest(".ord-list-card__invoice-btn");
      if (!btn) return;
      e.preventDefault();
      var card = btn.closest(".ord-list-card");
      var oid  = card ? card.dataset.orderId : null;
      var o    = oid ? ORDERS[oid] : null;
      if (o && o.statusKey === "delivered") {
        alert("Downloading invoice for order #" + o.id);
      } else {
        alert("Invoice will be available once your order is delivered.");
      }
    });
  }

  /* ──────────────────────────────────────────────
     BACK BUTTON
  ────────────────────────────────────────────── */
  function initBackButton() {
    var btn = document.getElementById("ordBackBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        document.getElementById("ordList").hidden = false;
        document.getElementById("ordNotFound").hidden = true;
        showListView();
      });
    }
  }

  /* ──────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    injectListThumbs();
    initLookup();
    initDetailButtons();
    initBackButton();
  });
}());
