// elsa homepage interactions — responsive motion only, every control reachable
// by keyboard, every animated piece respects prefers-reduced-motion.
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------ */
  /* Footer year                                                         */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Account dropdown — click-toggled so touch and pointer behave alike  */
  /* ------------------------------------------------------------------ */
  var accountMenu = document.getElementById("accountMenu");
  var accountTrigger = document.getElementById("accountMenuTrigger");
  var accountPanel = document.getElementById("accountMenuPanel");

  function closeAccountMenu() {
    accountMenu.classList.remove("is-open");
    accountTrigger.setAttribute("aria-expanded", "false");
  }
  function openAccountMenu() {
    accountMenu.classList.add("is-open");
    accountTrigger.setAttribute("aria-expanded", "true");
  }

  if (accountTrigger) {
    accountTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (accountMenu.classList.contains("is-open")) {
        closeAccountMenu();
      } else {
        openAccountMenu();
        var firstItem = accountPanel.querySelector("a");
        if (firstItem) firstItem.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (accountMenu.classList.contains("is-open") && !accountMenu.contains(e.target)) {
        closeAccountMenu();
      }
    });

    accountMenu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAccountMenu();
        accountTrigger.focus();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Search — icon trigger expands a panel beneath the header, smoothly  */
  /* ------------------------------------------------------------------ */
  var searchToggle = document.getElementById("searchToggle");
  var searchPanel = document.getElementById("searchPanel");
  var searchClose = document.getElementById("searchClose");
  var searchInput = document.getElementById("site-search");

  function closeSearchPanel(returnFocus) {
    if (!searchPanel.classList.contains("is-open")) return;
    searchPanel.classList.remove("is-open");
    searchToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) searchToggle.focus();
  }
  function openSearchPanel() {
    searchPanel.classList.add("is-open");
    searchToggle.setAttribute("aria-expanded", "true");
    var focusDelay = prefersReducedMotion.matches ? 0 : 240;
    setTimeout(function () { searchInput.focus(); }, focusDelay);
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (searchPanel.classList.contains("is-open")) {
        closeSearchPanel(false);
      } else {
        openSearchPanel();
      }
    });

    searchClose.addEventListener("click", function () {
      closeSearchPanel(true);
    });

    document.addEventListener("click", function (e) {
      if (searchPanel.classList.contains("is-open") &&
          !searchPanel.contains(e.target) &&
          e.target !== searchToggle &&
          !searchToggle.contains(e.target)) {
        closeSearchPanel(false);
      }
    });

    searchPanel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeSearchPanel(true);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Mobile drawer — focus-trapped, scroll-locked, Esc/scrim dismissible */
  /* ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var drawer = document.getElementById("mobileDrawer");
  var drawerScrim = document.getElementById("drawerScrim");
  var drawerClose = document.getElementById("drawerClose");
  var lastFocusedBeforeDrawer = null;

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
    );
  }

  function openDrawer() {
    lastFocusedBeforeDrawer = document.activeElement;
    drawerScrim.hidden = false;
    requestAnimationFrame(function () {
      drawerScrim.classList.add("is-visible");
      drawer.classList.add("is-open");
    });
    drawer.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var focusable = getFocusable(drawer);
    if (focusable.length) focusable[0].focus();
  }

  function closeDrawer() {
    drawerScrim.classList.remove("is-visible");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    var hideDelay = prefersReducedMotion.matches ? 0 : 420;
    setTimeout(function () { drawerScrim.hidden = true; }, hideDelay);
    if (lastFocusedBeforeDrawer) lastFocusedBeforeDrawer.focus();
  }

  if (navToggle) {
    navToggle.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    drawerScrim.addEventListener("click", closeDrawer);

    drawer.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key === "Tab") {
        var focusable = getFocusable(drawer);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Collapse the drawer automatically if the viewport grows past the
  // breakpoint where the desktop nav takes over — prevents a stuck overlay.
  var desktopQuery = window.matchMedia("(min-width: 992px)");
  desktopQuery.addEventListener("change", function (e) {
    if (e.matches && drawer.classList.contains("is-open")) closeDrawer();
  });

  /* ------------------------------------------------------------------ */
  /* Hero carousel — autoplay (paused on hover/focus) plus drag-to-slide */
  /* ------------------------------------------------------------------ */
  var heroCarouselEl = document.getElementById("heroCarousel");

  if (heroCarouselEl && window.bootstrap) {
    var heroCarousel = window.bootstrap.Carousel.getOrCreateInstance(heroCarouselEl, {
      ride: prefersReducedMotion.matches ? false : "carousel",
      pause: "hover"
    });

    if (prefersReducedMotion.matches) heroCarousel.pause();

    // Drag-to-slide with the mouse — Bootstrap already handles touch swipes
    // natively, so this only steps in for pointerType "mouse".
    var heroInner = heroCarouselEl.querySelector(".carousel-inner");
    if (heroInner) {
      var hDragging = false;
      var hStartX = 0;
      var hDeltaX = 0;
      var HERO_SWIPE_THRESHOLD = 50;

      heroInner.addEventListener("pointerdown", function (e) {
        if (e.pointerType !== "mouse") return;
        hDragging = true;
        hStartX = e.clientX;
        hDeltaX = 0;
        heroInner.classList.add("is-dragging");
        heroInner.setPointerCapture(e.pointerId);
        heroCarousel.pause();
      });

      heroInner.addEventListener("pointermove", function (e) {
        if (!hDragging) return;
        hDeltaX = e.clientX - hStartX;
      });

      function endHeroDrag() {
        if (!hDragging) return;
        hDragging = false;
        heroInner.classList.remove("is-dragging");
        if (hDeltaX <= -HERO_SWIPE_THRESHOLD) {
          heroCarousel.next();
        } else if (hDeltaX >= HERO_SWIPE_THRESHOLD) {
          heroCarousel.prev();
        }
        hDeltaX = 0;
        if (!prefersReducedMotion.matches) heroCarousel.cycle();
      }
      heroInner.addEventListener("pointerup", endHeroDrag);
      heroInner.addEventListener("pointercancel", endHeroDrag);
      heroInner.addEventListener("pointerleave", endHeroDrag);

      // Suppress the click-through on slide CTAs after an actual drag.
      var heroDragMoved = false;
      heroInner.addEventListener("pointermove", function () {
        if (hDragging && Math.abs(hDeltaX) > 4) heroDragMoved = true;
      });
      heroInner.addEventListener("click", function (e) {
        if (heroDragMoved) {
          e.preventDefault();
          e.stopPropagation();
          heroDragMoved = false;
        }
      }, true);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Testimonial carousel — manual controls only, no autoplay (read-paced)*/
  /* ------------------------------------------------------------------ */
  var testimonialEl = document.getElementById("testimonialCarousel");
  if (testimonialEl && window.bootstrap) {
    var testimonialCarousel = window.bootstrap.Carousel.getOrCreateInstance(testimonialEl, { ride: false, wrap: true });
    document.querySelectorAll(".testimonial-control").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("data-bs-slide") === "prev") {
          testimonialCarousel.prev();
        } else {
          testimonialCarousel.next();
        }
      });
    });

    // Drag-to-slide with the mouse — Bootstrap already handles touch swipes
    // natively, so this only steps in for pointerType "mouse".
    var testimonialInner = testimonialEl.querySelector(".carousel-inner");
    if (testimonialInner) {
      var tDragging = false;
      var tStartX = 0;
      var tDeltaX = 0;
      var SWIPE_THRESHOLD = 40;

      testimonialInner.addEventListener("pointerdown", function (e) {
        if (e.pointerType !== "mouse") return;
        tDragging = true;
        tStartX = e.clientX;
        tDeltaX = 0;
        testimonialInner.classList.add("is-dragging");
        testimonialInner.setPointerCapture(e.pointerId);
      });

      testimonialInner.addEventListener("pointermove", function (e) {
        if (!tDragging) return;
        tDeltaX = e.clientX - tStartX;
      });

      function endTestimonialDrag() {
        if (!tDragging) return;
        tDragging = false;
        testimonialInner.classList.remove("is-dragging");
        if (tDeltaX <= -SWIPE_THRESHOLD) {
          testimonialCarousel.next();
        } else if (tDeltaX >= SWIPE_THRESHOLD) {
          testimonialCarousel.prev();
        }
        tDeltaX = 0;
      }
      testimonialInner.addEventListener("pointerup", endTestimonialDrag);
      testimonialInner.addEventListener("pointercancel", endTestimonialDrag);
      testimonialInner.addEventListener("pointerleave", endTestimonialDrag);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Category strip — scroll-snap with arrow controls                   */
  /* ------------------------------------------------------------------ */
  var scroller = document.getElementById("categoryScroller");
  var prevBtn = document.getElementById("categoryPrev");
  var nextBtn = document.getElementById("categoryNext");

  function scrollByCard(direction) {
    if (!scroller) return;
    var card = scroller.querySelector(".category-card-wrap");
    var distance = card ? card.getBoundingClientRect().width + 24 : 240;
    scroller.scrollBy({
      left: direction * distance,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  }

  function updateScrollerControls() {
    if (!scroller) return;
    var maxScroll = scroller.scrollWidth - scroller.clientWidth - 1;
    prevBtn.disabled = scroller.scrollLeft <= 0;
    nextBtn.disabled = scroller.scrollLeft >= maxScroll;
  }

  if (scroller && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", function () { scrollByCard(-1); });
    nextBtn.addEventListener("click", function () { scrollByCard(1); });
    scroller.addEventListener("scroll", updateScrollerControls, { passive: true });
    window.addEventListener("resize", updateScrollerControls);
    updateScrollerControls();
  }

  // Drag-to-scroll with the mouse — touch devices already pan the strip
  // natively, so this only steps in for pointerType "mouse".
  if (scroller) {
    var isDraggingCategories = false;
    var categoryDragMoved = false;
    var dragStartX = 0;
    var scrollStartLeft = 0;

    scroller.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      isDraggingCategories = true;
      categoryDragMoved = false;
      dragStartX = e.clientX;
      scrollStartLeft = scroller.scrollLeft;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture(e.pointerId);
    });

    scroller.addEventListener("pointermove", function (e) {
      if (!isDraggingCategories) return;
      var delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 4) categoryDragMoved = true;
      scroller.scrollLeft = scrollStartLeft - delta;
    });

    function endCategoryDrag() {
      if (!isDraggingCategories) return;
      isDraggingCategories = false;
      scroller.classList.remove("is-dragging");
    }
    scroller.addEventListener("pointerup", endCategoryDrag);
    scroller.addEventListener("pointercancel", endCategoryDrag);
    scroller.addEventListener("pointerleave", endCategoryDrag);

    // Swallow the click on a category link when the pointerdown turned into
    // an actual drag, so dragging never accidentally navigates.
    scroller.addEventListener("click", function (e) {
      if (categoryDragMoved) {
        e.preventDefault();
        e.stopPropagation();
        categoryDragMoved = false;
      }
    }, true);
  }

  /* ------------------------------------------------------------------ */
  /* Add to Cart — inline confirmation + cart badge sync                 */
  /* ------------------------------------------------------------------ */
  var cartBadge = document.getElementById("cartBadge");
  var cartCount = parseInt(cartBadge ? cartBadge.textContent : "0", 10) || 0;

  function syncCartBadges(count) {
    document.querySelectorAll(".cart-badge").forEach(function (badge) {
      badge.textContent = String(count);
      if (!prefersReducedMotion.matches) {
        badge.classList.remove("is-pulsing");
        // restart animation
        void badge.offsetWidth;
        badge.classList.add("is-pulsing");
      }
    });
    var cartIconLink = document.querySelector('a[aria-label^="Cart"]');
    if (cartIconLink) cartIconLink.setAttribute("aria-label", "Cart, " + count + " items");
  }

  function addToCart(button, productName) {
    cartCount += 1;
    syncCartBadges(cartCount);

    var label = button.querySelector(".btn-add__label");
    if (!label || button.dataset.state === "added") return;

    var original = label.textContent;
    button.dataset.state = "added";
    label.textContent = "Added ✓";
    button.setAttribute("aria-live", "polite");

    setTimeout(function () {
      button.dataset.state = "";
      label.textContent = original;
    }, 2000);
  }

  document.querySelectorAll(".btn-add").forEach(function (button) {
    button.addEventListener("click", function () {
      addToCart(button, button.dataset.product || "item");
    });
  });

  /* ------------------------------------------------------------------ */
  /* Quick View — native <dialog>, focus-trapped via the dialog itself   */
  /* ------------------------------------------------------------------ */
  var quickViewDialog = document.getElementById("quickViewDialog");
  var quickViewClose = document.getElementById("quickViewClose");
  var quickViewAdd = document.getElementById("quickViewAdd");
  var currentQuickViewProduct = null;

  if (quickViewDialog && typeof quickViewDialog.showModal === "function") {
    document.querySelectorAll("[data-quick-view]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        currentQuickViewProduct = trigger.dataset.product || trigger.dataset.name;
        document.getElementById("quickViewTitle").textContent = trigger.dataset.name || "";
        document.getElementById("quickViewWeight").textContent = trigger.dataset.weight || "";
        document.getElementById("quickViewPrice").textContent = trigger.dataset.price || "";
        document.getElementById("quickViewDesc").textContent = trigger.dataset.desc || "";
        var media = document.getElementById("quickViewMedia");
        media.textContent = trigger.dataset.name || "";
        media.setAttribute("data-asset", "Larger crop of the same product photo, 1600×1600");
        quickViewAdd.dataset.product = trigger.dataset.name || "";
        quickViewAdd.dataset.state = "";
        quickViewAdd.querySelector(".btn-add__label").textContent = "Add to Cart";
        quickViewDialog.showModal();
      });
    });

    quickViewClose.addEventListener("click", function () { quickViewDialog.close(); });

    // Click on the ::backdrop closes the dialog
    quickViewDialog.addEventListener("click", function (e) {
      var rect = quickViewDialog.getBoundingClientRect();
      var inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                   e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) quickViewDialog.close();
    });

    quickViewAdd.addEventListener("click", function () {
      addToCart(quickViewAdd, currentQuickViewProduct);
    });
  } else if (quickViewDialog) {
    // Extremely old browsers without <dialog> support: hide the trigger's
    // quick-view affordance rather than ship a dead control.
    document.querySelectorAll("[data-quick-view]").forEach(function (trigger) {
      trigger.hidden = true;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Product listing — filter / sort / paginate / view-toggle (PLP only) */
  /* ------------------------------------------------------------------ */
  var productGrid = document.getElementById("productGrid");

  if (productGrid) {
    var PAGE_SIZE = 6;

    var allCards = Array.prototype.slice.call(productGrid.querySelectorAll(".product-card")).map(function (card) {
      return {
        el: card,
        col: card.closest(".col"),
        category: card.dataset.category,
        weight: card.dataset.weight,
        price: parseInt(card.dataset.price, 10),
        availability: card.dataset.availability,
        rank: parseInt(card.dataset.rank, 10),
        name: card.querySelector(".product-card__name").textContent
      };
    });

    var filterForm = document.getElementById("filterForm");
    var clearFiltersBtn = document.getElementById("clearFiltersBtn");
    var resultCount = document.getElementById("resultCount");
    var activeFiltersEl = document.getElementById("activeFilters");
    var emptyState = document.getElementById("emptyState");
    var emptyStateClear = document.getElementById("emptyStateClear");
    var sortSelect = document.getElementById("sortSelect");
    var paginationRow = document.getElementById("paginationRow");

    var maxPriceRange = document.getElementById("maxPriceRange");
    var maxPriceNumber = document.getElementById("maxPriceNumber");
    var maxPriceValue = document.getElementById("maxPriceValue");

    var viewGridBtn = document.getElementById("viewGridBtn");
    var viewListBtn = document.getElementById("viewListBtn");

    var filterToggle = document.getElementById("filterToggle");
    var filterToggleBadge = document.getElementById("filterToggleBadge");
    var filterSidebar = document.getElementById("filterSidebar");
    var filterScrim = document.getElementById("filterScrim");
    var filterClose = document.getElementById("filterClose");
    var showResultsBtn = document.getElementById("showResultsBtn");
    var lastFocusedBeforeFilterPanel = null;

    var FILTER_LABELS = {
      "curry-powders": "Curry Powders",
      "spice-powders": "Spice Powders",
      "tea-powders": "Tea Powders",
      "ready-mixes": "Ready Mixes",
      "ghee": "Ghee",
      "organic-products": "Organic Products",
      "100": "100 g",
      "250": "250 g",
      "500": "500 g",
      "1000": "1 kg",
      "in-stock": "In Stock",
      "out-of-stock": "Out of Stock"
    };

    var MAX_PRICE_BOUND = 1000;
    var currentPage = 1;

    function checkedValues(name) {
      return Array.prototype.slice.call(filterForm.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function (input) { return input.value; });
    }

    function readFilterState() {
      return {
        category: checkedValues("category"),
        weight: checkedValues("weight"),
        availability: checkedValues("availability"),
        maxPrice: parseInt(maxPriceRange.value, 10)
      };
    }

    function cardMatches(card, state) {
      if (state.category.length && state.category.indexOf(card.category) === -1) return false;
      if (state.weight.length && state.weight.indexOf(card.weight) === -1) return false;
      if (state.availability.length && state.availability.indexOf(card.availability) === -1) return false;
      if (card.price > state.maxPrice) return false;
      return true;
    }

    function sortCards(cards, sortValue) {
      var sorted = cards.slice();
      switch (sortValue) {
        case "new":
          sorted.sort(function (a, b) { return b.rank - a.rank; });
          break;
        case "price-asc":
          sorted.sort(function (a, b) { return a.price - b.price; });
          break;
        case "price-desc":
          sorted.sort(function (a, b) { return b.price - a.price; });
          break;
        default:
          sorted.sort(function (a, b) { return a.rank - b.rank; });
      }
      return sorted;
    }

    function syncMaxPriceDisplay() {
      var value = parseInt(maxPriceRange.value, 10);
      maxPriceValue.textContent = value >= MAX_PRICE_BOUND ? "Up to ₹" + MAX_PRICE_BOUND : "Up to ₹" + value;
      maxPriceNumber.value = value;
    }

    function buildChip(text, onRemove) {
      var chip = document.createElement("span");
      chip.className = "active-filter-chip";
      var label = document.createElement("span");
      label.textContent = text;
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove filter: " + text);
      removeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      removeBtn.addEventListener("click", onRemove);
      chip.appendChild(label);
      chip.appendChild(removeBtn);
      return chip;
    }

    function renderActiveFilterChips(state) {
      activeFiltersEl.innerHTML = "";
      var chipCount = 0;

      ["category", "weight", "availability"].forEach(function (group) {
        state[group].forEach(function (value) {
          chipCount += 1;
          activeFiltersEl.appendChild(buildChip(FILTER_LABELS[value] || value, function () {
            var input = filterForm.querySelector('input[name="' + group + '"][value="' + value + '"]');
            if (input) input.checked = false;
            currentPage = 1;
            render();
          }));
        });
      });

      if (state.maxPrice < MAX_PRICE_BOUND) {
        chipCount += 1;
        activeFiltersEl.appendChild(buildChip("Up to ₹" + state.maxPrice, function () {
          maxPriceRange.value = String(MAX_PRICE_BOUND);
          syncMaxPriceDisplay();
          currentPage = 1;
          render();
        }));
      }

      clearFiltersBtn.disabled = chipCount === 0;
      if (filterToggleBadge) {
        filterToggleBadge.hidden = chipCount === 0;
        filterToggleBadge.textContent = String(chipCount);
      }
    }

    function buildPageButton(label, page, opts) {
      opts = opts || {};
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "page-btn" + (opts.extraClass ? " " + opts.extraClass : "");
      btn.textContent = label;
      if (opts.current) {
        btn.classList.add("is-current");
        btn.setAttribute("aria-current", "page");
      }
      if (opts.disabled) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", function () {
          currentPage = page;
          render();
          var listingTop = document.getElementById("listingTop");
          if (listingTop) listingTop.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
        });
      }
      if (opts.label) btn.setAttribute("aria-label", opts.label);
      return btn;
    }

    function buildPagination(totalPages) {
      paginationRow.innerHTML = "";
      if (totalPages <= 1) return;

      paginationRow.appendChild(buildPageButton("Previous", currentPage - 1, {
        extraClass: "page-btn--prev",
        disabled: currentPage === 1,
        label: "Go to previous page"
      }));

      for (var page = 1; page <= totalPages; page++) {
        paginationRow.appendChild(buildPageButton(String(page), page, {
          current: page === currentPage,
          label: "Go to page " + page
        }));
      }

      paginationRow.appendChild(buildPageButton("Next", currentPage + 1, {
        extraClass: "page-btn--next",
        disabled: currentPage === totalPages,
        label: "Go to next page"
      }));
    }

    function render() {
      var state = readFilterState();
      var matching = allCards.filter(function (card) { return cardMatches(card, state); });
      var sorted = sortCards(matching, sortSelect.value);

      var totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      var startIndex = (currentPage - 1) * PAGE_SIZE;
      var pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);

      // Detach every card, then re-append only the current page's items in
      // sorted order — this re-flows the grid without rebuilding card markup,
      // so the click listeners wired at load time stay attached untouched.
      allCards.forEach(function (card) {
        if (card.col.parentNode) card.col.parentNode.removeChild(card.col);
      });
      pageItems.forEach(function (card) {
        productGrid.appendChild(card.col);
      });

      var hasResults = sorted.length > 0;
      emptyState.hidden = hasResults;
      productGrid.hidden = !hasResults;
      paginationRow.hidden = !hasResults;

      if (hasResults) {
        var rangeStart = startIndex + 1;
        var rangeEnd = Math.min(sorted.length, startIndex + pageItems.length);
        resultCount.textContent = "Showing " + rangeStart + "–" + rangeEnd + " of " + sorted.length + " products";
      } else {
        resultCount.textContent = "Showing 0 of " + allCards.length + " products";
      }

      renderActiveFilterChips(state);
      buildPagination(totalPages);
    }

    /* Filter form — checkboxes, price range/number, clear-filters */
    filterForm.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"]')) {
        currentPage = 1;
        render();
      }
    });

    maxPriceRange.addEventListener("input", function () {
      syncMaxPriceDisplay();
      currentPage = 1;
      render();
    });

    maxPriceNumber.addEventListener("change", function () {
      var value = parseInt(maxPriceNumber.value, 10);
      if (isNaN(value)) value = MAX_PRICE_BOUND;
      value = Math.max(0, Math.min(MAX_PRICE_BOUND, value));
      maxPriceRange.value = String(value);
      syncMaxPriceDisplay();
      currentPage = 1;
      render();
    });

    function clearAllFilters() {
      filterForm.querySelectorAll('input[type="checkbox"]').forEach(function (input) { input.checked = false; });
      maxPriceRange.value = String(MAX_PRICE_BOUND);
      syncMaxPriceDisplay();
      currentPage = 1;
      render();
    }

    clearFiltersBtn.addEventListener("click", clearAllFilters);
    emptyStateClear.addEventListener("click", clearAllFilters);

    /* Sort */
    sortSelect.addEventListener("change", function () {
      currentPage = 1;
      render();
    });

    /* Grid / List view toggle */
    function setViewMode(mode) {
      var isList = mode === "list";
      productGrid.classList.toggle("is-list-view", isList);
      viewGridBtn.classList.toggle("is-active", !isList);
      viewListBtn.classList.toggle("is-active", isList);
      viewGridBtn.setAttribute("aria-pressed", String(!isList));
      viewListBtn.setAttribute("aria-pressed", String(isList));
    }
    viewGridBtn.addEventListener("click", function () { setViewMode("grid"); });
    viewListBtn.addEventListener("click", function () { setViewMode("list"); });

    /* Mobile filter drawer — mirrors openDrawer/closeDrawer exactly */
    function openFilterPanel() {
      lastFocusedBeforeFilterPanel = document.activeElement;
      filterScrim.hidden = false;
      requestAnimationFrame(function () {
        filterScrim.classList.add("is-visible");
        filterSidebar.classList.add("is-open");
      });
      filterToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var focusable = getFocusable(filterSidebar);
      if (focusable.length) focusable[0].focus();
    }

    function closeFilterPanel() {
      filterScrim.classList.remove("is-visible");
      filterSidebar.classList.remove("is-open");
      filterToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      var hideDelay = prefersReducedMotion.matches ? 0 : 420;
      setTimeout(function () { filterScrim.hidden = true; }, hideDelay);
      if (lastFocusedBeforeFilterPanel) lastFocusedBeforeFilterPanel.focus();
    }

    if (filterToggle) {
      filterToggle.addEventListener("click", openFilterPanel);
      filterClose.addEventListener("click", closeFilterPanel);
      filterScrim.addEventListener("click", closeFilterPanel);
      showResultsBtn.addEventListener("click", closeFilterPanel);

      filterSidebar.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeFilterPanel();
          return;
        }
        if (e.key === "Tab") {
          var focusable = getFocusable(filterSidebar);
          if (!focusable.length) return;
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });

      desktopQuery.addEventListener("change", function (e) {
        if (e.matches && filterSidebar.classList.contains("is-open")) closeFilterPanel();
      });
    }

    syncMaxPriceDisplay();
    render();
  }

  /* ------------------------------------------------------------------ */
  /* Smooth-scroll for in-page nav links, honouring reduced motion       */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      if (drawer && drawer.classList.contains("is-open")) closeDrawer();
    });
  });

  /* ------------------------------------------------------------------ */
  /* Product image injection                                              */
  /* Cycles the 4 product images across every .product-card__media and   */
  /* .cart-item__img on the page — no HTML edits needed per card.        */
  /* ------------------------------------------------------------------ */
  var PRODUCT_IMGS = [
    "assets/images/products1.jpeg",
    "assets/images/products2.jpg",
    "assets/images/products3.jpg",
    "assets/images/products4.jpeg"
  ];

  function makeProductImg(src, alt, className) {
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.className = className;
    img.onerror = function () { this.style.display = "none"; };
    return img;
  }

  /* Inject into product cards (.product-card__media) */
  document.querySelectorAll(".product-card__media").forEach(function (media, idx) {
    if (media.querySelector(".product-card__img")) return; /* skip if already present */
    var placeholder = media.querySelector(".media-placeholder");
    var altText = placeholder ? placeholder.textContent.trim() : "Elsa product";
    var src = PRODUCT_IMGS[idx % PRODUCT_IMGS.length];
    media.insertBefore(makeProductImg(src, altText, "product-card__img"), media.firstChild);
  });

  /* Inject into cart item thumbnails (.cart-item__img) */
  document.querySelectorAll(".cart-item__img").forEach(function (wrap, idx) {
    if (wrap.querySelector(".cart-item__img-photo")) return;
    var placeholder = wrap.querySelector(".cart-item__media");
    var altText = placeholder ? placeholder.textContent.trim() : "Elsa product";
    var src = PRODUCT_IMGS[idx % PRODUCT_IMGS.length];
    wrap.insertBefore(makeProductImg(src, altText, "cart-item__img-photo"), wrap.firstChild);
  });

  /* Inject into checkout order item thumbnails (.chk-order-item__img-wrap) */
  document.querySelectorAll(".chk-order-item__img-wrap").forEach(function (wrap, idx) {
    if (wrap.querySelector(".chk-order-item__img-photo")) return;
    var placeholder = wrap.querySelector(".chk-order-item__media");
    var altText = placeholder ? placeholder.textContent.trim() : "Elsa product";
    var src = PRODUCT_IMGS[idx % PRODUCT_IMGS.length];
    var img = makeProductImg(src, altText, "chk-order-item__img-photo");
    /* Insert before the badge span so the badge stays on top */
    var badge = wrap.querySelector(".chk-order-item__badge");
    wrap.insertBefore(img, badge || null);
  });

})();
