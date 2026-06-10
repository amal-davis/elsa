# Elsar Product Listing Page (PLP) Specification
**Heaven Valley Industries — Elsar Curry Powder**
Production-ready, dev-handoff spec for a Bootstrap 5 + Django build.

This spec applies [[PRODUCT.md]] (register: product, audience: older/less tech-savvy home cooks restocking pantry staples, principle: "fast restocking, not discovery shopping — strong search, clear categories, minimal steps to checkout") and [[DESIGN.md]] (North Star: "The Trusted Pantry Counter" — restrained earthy palette, Spice-Red Accent at ≤10% of any surface, single humanist sans for reading + Fraunces for announcing per The Heritage Pairing Rule, flat-by-default surfaces, responsive-only motion). It also extends [[specs/homepage.md]], whose `SiteHeader` and `SiteFooter` are reused here verbatim — they are specified once and never redefined per page.

**Inspiration note:** Kerachakra's product listing (`kerachakra.com/products`) was reviewed as a category reference, not copied. Where that pattern leans toward dense, promotional grid merchandising, this spec deliberately goes calmer and plainer: fewer simultaneous visual signals, larger text and targets, plain-language filter labels, and zero promotional badges ("Sale," "New," countdown chips) — per PRODUCT.md's anti-reference on aggressive merchandising and DESIGN.md's Ten-Percent Rule. The result should read as "a clear shelf you can scan in seconds," not "a marketplace competing for your attention."

---

## 0. Foundation

**Feature summary.** The PLP is where a shopper who already knows roughly what they want — "the curry powder," "something in the 250g size," "the ghee under ₹500" — narrows a calm, complete catalog down to the one tin they're going to buy. It is a *finding* tool first and a *browsing* surface second. Every element on the page should make narrowing-and-confirming faster, never slower or noisier.

**Primary user action.** Filter or sort to a short, relevant list, then either add a product to the cart directly from its card or open it for a closer look — with minimal taps and zero moments of "wait, where am I now?"

**Design direction.**
- **Color strategy:** Restrained, identical to the homepage — Warm Paper page background, Surface-toned cards and sidebar, Spice-Red Accent reserved for prices, "Add to Cart," active filter states, and the active page-number in pagination (The Ten-Percent Rule still governs; a filter-heavy page is exactly where accent overuse creeps in, so audit this page's accent coverage specifically before sign-off).
- **Theme scene sentence:** The same woman from the homepage's scene has tapped "Products" because she wants to see every curry powder in stock before deciding between her usual and a size she hasn't tried — she needs to narrow by category and weight without hunting for tiny controls, see the price plainly, and get back to "add to cart" in under thirty seconds.
- **Anchor reference:** Raidco Foods (clean, institutional, plainly-labelled) remains the closest fit; Kerachakra is consulted only for "what does a spice PLP need structurally," then rebuilt calmer.

**Scope.** Production-ready, dev-handoff fidelity. Full breadth (hero/breadcrumb band, filter sidebar, product grid, listing controls, pagination, trust band) plus the two reusable shell components inherited from the homepage spec. Fully interactive (filtering, sorting, pagination, mobile filter drawer, quick view — reusing the homepage's `QuickViewDialog` component). Built for Bootstrap 5 markup conventions and Django template inheritance/includes.

**Key states to design for:**
| State | What the user needs to see/feel |
|---|---|
| Default (filters at rest, full catalog) | Calm, scannable — "I can see everything and narrow it whenever I want" |
| Filtered (one or more filters active) | Crystal clear about *what's* filtering the view (Active Filters chips) and an obvious, single-tap way to undo it |
| Empty result ("no products match these filters") | A plain, warm message + the exact filters currently applied + a one-tap "Clear Filters" — never a bare "No results" dead end |
| Loading (filter change, page change) | Stable layout (skeleton cards in brand-neutral tones, same grid dimensions as loaded state) — no content jumping as results resolve |
| Out-of-stock product | Visibly distinguished (muted image treatment + plain-language "Out of Stock" label) but never hidden — this audience often still wants to see it to plan a future reorder |
| Sidebar open / closed (mobile) | Background content inert (`aria-hidden`, scroll-locked) while the filter panel is open, exactly like the homepage's mobile drawer |
| Pagination at first/last page | "Previous"/"Next" visibly disabled (not just unresponsive) at the boundaries |
| Reduced motion | Filter-panel slide, skeleton-to-content transitions, and image hover-zoom all collapse to instant/crossfade per `prefers-reduced-motion: reduce` |

---

## 1. Detailed PLP Wireframe

Structural blocks, top to bottom. Each block is annotated with its DESIGN.md role (background tone, accent usage) so the wireframe doubles as a token-application map.

```
┌─────────────────────────────────────────────────────────────┐
│ STICKY HEADER  (reused SiteHeader — Surface tone)            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ PAGE BANNER  (Warm Paper band, no photography — calm & flat) │
│  Home  ›  Products                          (breadcrumb)     │
│  Products                                    (Display heading)│
│  Browse our collection of organic spices, curry powders,     │
│  tea powders, ready mixes, and traditional food products.    │
└─────────────────────────────────────────────────────────────┘
┌───────────────┬─────────────────────────────────────────────┐
│ FILTER SIDEBAR │ LISTING CONTROLS BAR                        │
│ (Surface, ☐    │  Showing 1–12 of 48 products                │
│  sticky on     │  [Curry Powders ✕] [In Stock ✕]   [Sort ▾] │
│  scroll)       │                              [▦ Grid][☰ List]│
│                ├─────────────────────────────────────────────┤
│ Category       │ ┌────────┐ ┌────────┐ ┌────────┐            │
│ ☐ Curry Powders│ │ image  │ │ image  │ │ image  │            │
│ ☐ Spice Powders│ │ name   │ │ name   │ │ name   │            │
│ ☐ Tea Powders  │ │category│ │category│ │category│            │
│ ☐ Ready Mixes  │ │ weight │ │ weight │ │ weight │            │
│ ☐ Ghee         │ │ price  │ │ price  │ │ price  │            │
│ ☐ Organic      │ │ desc…  │ │ desc…  │ │ desc…  │            │
│                │ │[Add to │ │[Add to │ │[Add to │            │
│ Price          │ │ Cart]  │ │ Cart]  │ │ Cart]  │            │
│ ₹0 ●━━━━● ₹1000│ │[View   │ │[View   │ │[View   │            │
│                │ │Details]│ │Details]│ │Details]│            │
│ Weight         │ └────────┘ └────────┘ └────────┘            │
│ ☐ 100g ☐ 250g  │      … 3 columns × N rows …                 │
│ ☐ 500g ☐ 1kg   │                                             │
│                │                                             │
│ Availability   │  ‹ Previous   1  [2]  3  …  8   Next ›      │
│ ☐ In Stock     │                                             │
│ ☐ Out of Stock │                                             │
│                │                                             │
│ [Clear Filters]│                                             │
└───────────────┴─────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ TRUST BAND  (Warm Paper, icon + label grid — same component  │
│ as homepage's Trust & Quality, reused with this page's list) │
│ [✓ ISO Certified] [🌿 Organic] [⌀ No Preservatives]          │
│ [📍 Kerala Sourced] [🏭 Hygienically Packed] [⏱ Freshness]   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ FOOTER  (reused SiteFooter — Ink-on-Surface, 4 columns)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy

```
ProductListingPage
├── SiteHeader                                  (reused verbatim from specs/homepage.md §2)
│
├── PageBannerSection
│   ├── Breadcrumb (Home › Products)
│   ├── PageTitle ("Products" — Display scale)
│   └── PageDescription (one calm sentence, Body scale)
│
├── ProductListingLayout
│   ├── FilterSidebar                           (desktop: fixed/sticky column · mobile: slide-in panel)
│   │   ├── FilterGroup — Category (checkbox list × 6)
│   │   ├── FilterGroup — Price (dual-handle range slider + numeric min/max fields)
│   │   ├── FilterGroup — Weight (checkbox list: 100g / 250g / 500g / 1kg)
│   │   ├── FilterGroup — Availability (checkbox list: In Stock / Out of Stock)
│   │   └── ClearFiltersButton (secondary/ghost, full-width)
│   │
│   └── ListingArea
│       ├── ListingControlsBar
│       │   ├── ResultCount ("Showing 1–12 of 48 products")
│       │   ├── ActiveFilterChips × N (each independently removable, "✕")
│       │   ├── SortDropdown (Popularity / New Arrivals / Price: Low to High / Price: High to Low)
│       │   └── GridViewToggle (Grid view / List view — labelled, not icon-only)
│       │
│       ├── ProductGrid (or ProductList, per GridViewToggle state)
│       │   └── ProductCard × 12 per page
│       │       ├── ProductImage (with subtle hover-zoom, desktop only)
│       │       ├── ProductCategory (small label, above the name)
│       │       ├── ProductName
│       │       ├── ProductWeight
│       │       ├── ProductPrice (Spice-Red Accent)
│       │       ├── ProductShortDescription (1–2 lines, truncated gracefully)
│       │       ├── AddToCartButton (primary, Spice-Red Accent)
│       │       └── ViewDetailsButton (secondary/ghost — opens QuickViewDialog or product page)
│       │
│       ├── EmptyResultState (shown in place of the grid when zero matches)
│       │
│       └── Pagination
│           ├── PreviousButton
│           ├── PageNumber × N (current page visually distinct, not color-only)
│           └── NextButton
│
├── QuickViewDialog                              (reused verbatim from specs/homepage.md — native <dialog>)
│
├── TrustBand                                    (same TrustBadge component as homepage §2, this page's six items)
│
└── SiteFooter                                   (reused verbatim from specs/homepage.md §2)
```

**Reuse note:** `SiteHeader`, `SiteFooter`, `QuickViewDialog`, and the `TrustBadge` grid pattern are not redefined here — they extend the same Django base template and partials specified in `specs/homepage.md` §2/§9/§10. Building them twice with subtly different markup is exactly the kind of drift that makes a site feel templated rather than considered.

---

## 3. Desktop Layout Specification (≥ 1200px / Bootstrap `xl`/`xxl`)

**Container:** `.container-xl`, identical outer rhythm to the homepage so the page-to-page transition feels seamless.

- **Page banner:** Single Warm Paper band, no photography (a PLP is a *finding* tool — a hero photo here would compete with the very thing the user came to do). Breadcrumb (Label scale, Ink-soft, with the current page in Ink and `aria-current="page"`) sits above a Display-scale `<h1>Products</h1>` and one calm, factual sentence beneath it. Generous vertical padding (`--space-xl`) but no full-bleed imagery — keep it light so the filter-and-grid below stays the visual anchor.
- **Two-column layout:** `row` with a fixed-width sidebar column (`col-lg-3`, ~280–320px) and a fluid listing column (`col-lg-9`). The sidebar is `position: sticky; top: [header height + space-md]` so it travels with the scroll and stays reachable without the shopper losing their place — DESIGN.md's Surface tone and a hairline border distinguish it from the page without a shadow (Flat-Counter Rule).
- **Filter groups:** Each group (Category, Price, Weight, Availability) is its own labelled `<fieldset>` with a visible `<legend>`, separated by hairline dividers (Border/Divider tone) rather than nested card chrome — nested cards inside a card is always the wrong call per the layout guidance, and a fieldset list reads calmer here than boxed sub-panels.
- **Listing controls bar:** A single horizontal row above the grid: result count left-aligned, active-filter chips beside it (wrapping to a second line if needed, never truncating), sort dropdown and grid/list toggle right-aligned. This bar is the page's "orientation strip" — the shopper should be able to glance at it and know exactly what they're looking at and how to change it.
- **Product grid:** 3-column grid (`row-cols-xl-3`) inside the `col-lg-9` listing column — narrower than the homepage's 4-up Featured grid because the sidebar claims real estate, and 3-up keeps cards spacious rather than cramped (DESIGN.md: "internal padding generous and consistent — enough breathing room that name, weight, and price never feel cramped"). 12 products per page = exactly 4 full rows at 3-up, a clean, predictable rhythm.
- **Pagination:** Centered below the grid, generous spacing from the last row (`--space-xl`). Previous/Next as labelled buttons (never bare arrows-only — PRODUCT.md: "plain-language labels... over icon-only controls"), page numbers as a row of equally-sized buttons, the active page visually distinct via background fill *and* a label change (`aria-current="page"`), never color alone.
- **Trust band:** Same six-item single-row treatment as the homepage's Trust & Quality section (`row-cols-xl-6`), reusing that exact component so the page doesn't introduce a second visual vocabulary for the same kind of content.

---

## 4. Tablet Layout Specification (≈ 768px–1199px / Bootstrap `md`/`lg`)

- **Header:** Identical collapse behavior to the homepage spec §4 — nav folds into the drawer pattern early rather than inventing a third in-between treatment.
- **Page banner:** Same single-band layout; heading and description remain comfortably sized (Display clamp naturally steps down).
- **Sidebar → collapsible panel:** The fixed sidebar becomes a collapsible block anchored above the grid — a full-width "Filters" toggle button (with a filter-count badge, e.g., "Filters (2)") expands an inline panel containing the same four filter groups, stacked. This keeps the *same* filter component and markup as desktop (just re-parented and made collapsible via a disclosure pattern), rather than building a second filter UI for this breakpoint — one well-tested component, two contexts.
- **Listing controls bar:** Wraps to two lines if needed: result count + active filters on the first line, sort + grid/list toggle on the second — never let the sort dropdown get squeezed to illegibility.
- **Product grid:** 2-column grid (`row-cols-md-2`). Re-check the short-description truncation at this width specifically — two columns is where description text most often starts wrapping awkwardly against the price/button stack.
- **Pagination:** Same centered treatment; if the page-number row would wrap, switch to the truncated pattern (`1 … 4 [5] 6 … 12`) rather than letting it wrap to a second line, which reads as broken on a touch surface.
- **Trust band:** 3-column grid (`row-cols-md-3`), two rows of three — identical to the homepage's tablet treatment of the same component.

---

## 5. Mobile Layout Specification (< 768px / Bootstrap `sm`/base)

This is the primary design target — same audience, same "phone in the kitchen" scene as the homepage.

- **Header:** Identical to the homepage's mobile header (logo, search icon, cart, hamburger) — no PLP-specific changes; consistency here is what makes the site feel like *one* considered product rather than a stitched-together set of pages.
- **Page banner:** Stacks naturally; breadcrumb remains visible (it's the shopper's "how do I get back" affordance, especially valuable for less tech-savvy users who may not trust the browser's back button). Heading and description keep their generous mobile sizing from the Display/Body clamps — never shrink below comfortable reading size.
- **Filter access — slide-in panel:** The sidebar is replaced by a full-width **"Filters"** button (with the same filter-count badge as tablet) sitting directly above the listing controls bar. Tapping it opens a slide-in panel from the right — **reuse the exact `MobileNavDrawer` component and motion spec from `specs/homepage.md` §5** (≈85% viewport width, 200–250ms ease-out-quart slide, scroll-locked, `aria-hidden` background, focus-trapped, dismissible via a close button, scrim tap, or <kbd>Esc</kbd>). The panel contains the same four filter groups stacked vertically, each with large checkboxes (≥24px) and large labels (Title scale, not Label scale — this is the one place on the page where slightly larger-than-default filter text earns its keep), and ends with a sticky **"Show Results"** primary button plus a **"Clear Filters"** ghost button side-by-side at the panel's bottom edge — so the shopper always sees how to both *commit* and *escape* the filter state without scrolling back up.
- **Listing controls bar:** Stacks to: result count (own line), active-filter chips (own line, horizontally scrollable if many), then sort dropdown and grid/list toggle paired on a final line. Never let this bar push the first product card below the fold — keep it compact and single-purpose.
- **Product grid:** Single column (`row-cols-1`) — per PRODUCT.md's "fast restocking, not discovery shopping," a single column reads calmer and lets each card's name/weight/price/description breathe at full width, which matters more here than fitting more tiles per screen. (This mirrors the homepage spec's explicit single-column recommendation for its Featured grid — same audience, same reasoning, same default.)
- **Pagination:** "Previous"/"Next" as large, full-width-feeling buttons flanking a compact page indicator (e.g., "Page 2 of 8") rather than a full row of page-number buttons, which would crowd a narrow screen and risk mis-taps for less precise input.
- **Trust band:** 2-column grid (`row-cols-2`), identical to the homepage's mobile treatment of the same component — three rows of two.
- **Footer:** Identical to the homepage's mobile footer.

---

## 6. Filter Sidebar — Detailed Specification

The filter sidebar is the page's most novel surface relative to the homepage, so it gets its own focused spec. Every choice below optimizes for the stated audience: **large checkboxes, large labels, high contrast, easy to use on tablets** (the brief's explicit accessibility callouts), layered on top of PRODUCT.md's broader "legible for every shopper" principle.

### 6.1 Category Filter
- Plain checkbox list, one row per category: **Curry Powders · Spice Powders · Tea Powders · Ready Mixes · Ghee · Organic Products** (the same six categories and order as the homepage's Category Strip — consistency lets a returning shopper map the two surfaces instantly).
- Checkbox size ≥24×24px with a generously-sized, fully-clickable label (the whole row is the tap target, not just the small box — critical for motor-impaired and older users).
- Each checkbox shows a live product count beside its label in Ink-soft, e.g., "Curry Powders (14)" — this lets a shopper gauge a filter's usefulness *before* tapping it, reducing trial-and-error taps.

### 6.2 Price Filter
- A **dual-handle range slider** (min/max) with the current selected range displayed plainly above it in large, high-contrast numerals (e.g., "₹95 – ₹540"), Spice-Red Accent on the active track segment only (Ten-Percent Rule — the rest of the track stays Border-toned).
- **Accessibility pairing (non-negotiable for this audience):** sliders alone are notoriously hard for low-precision input — provide two plain numeric `<input type="number">` fields (Min / Max) beside or beneath the slider as a fully equivalent, keyboard- and screen-reader-friendly alternative. Either control updates the other; neither is the "real" one.
- Slider handles ≥28px diameter, generous hit area beyond the visible handle, visible focus ring per DESIGN.md's Inputs spec, and arrow-key adjustability when focused.

### 6.3 Weight Filter
- Plain checkbox list: **100g · 250g · 500g · 1kg** — same large-checkbox/large-label treatment as Category. Multiple selectable (a shopper restocking for a big family might want both 500g and 1kg shown).

### 6.4 Availability Filter
- Plain checkbox list: **In Stock · Out of Stock**. Default state: both unchecked (= show everything, including out-of-stock items so a shopper can still see what they'd be waiting on) — never silently pre-filter the catalog on the shopper's behalf.

### 6.5 Sort
- Lives in the **listing controls bar**, not the sidebar (it sorts the *current* result set rather than narrowing it — keeping it visually distinct from the filter groups helps the shopper build an accurate mental model of "these change *what* I see, that changes *the order* I see it in").
- A native `<select>` (or a fully keyboard-operable custom dropdown matching the account-menu pattern) with plain-language options: **Popularity · New Arrivals · Price: Low to High · Price: High to Low**. No "Recommended" as a vague default — "Popularity" states plainly what the default ordering means.

### 6.6 Clear Filters
- A full-width secondary/ghost button at the foot of the sidebar (desktop/tablet) and inside the slide-in panel (mobile), labelled **"Clear Filters"** (a verb + object, per the copy guidance — never a bare "Reset" or "✕").
- Disabled (visibly, with a "not-allowed" cursor per DESIGN.md's Inputs spec) when no filters are active — its disabled state is itself a piece of feedback ("nothing to clear right now").
- Clearing filters returns focus to the top of the filter sidebar/panel and announces the change via an `aria-live="polite"` region near the result count ("Filters cleared. Showing all 48 products.") — screen-reader users need to hear the outcome, not just see it.

### 6.7 Active Filter Chips
- Each active filter (from any group, including individual price-range and weight selections) renders as a removable chip in the listing controls bar: plain-language label + an "✕" with an accessible name like "Remove filter: Curry Powders" (never a bare "✕" with no label — PRODUCT.md again). Removing the last chip returns the page to its unfiltered state and updates the `aria-live` region the same way "Clear Filters" does.

---

## 7. Product Card — Detailed Specification

The PLP card carries more information than the homepage's Featured card (it adds Category and a short description), so its internal hierarchy needs a clear reading order. Top to bottom:

1. **Product image** — square crop (matches the homepage's 1200×1200 product photography spec for catalog consistency), `aspect-ratio: 1/1`, rounded corners matching the card (`--radius-md`), `loading="lazy"` below the fold.
2. **Product category** — small Label-scale text in Ink-soft, e.g., "Curry Powder" — gives the shopper an at-a-glance sense of *what kind* of thing this is before reading the specific name (useful when scanning a mixed/filtered grid).
3. **Product name** — Title scale, Ink, semibold (matches the homepage card's name treatment exactly).
4. **Product weight** — Label/small scale, Ink-soft, e.g., "200 g tin" (identical pattern to the homepage card).
5. **Product price** — Title scale, Spice-Red Accent, semibold-to-bold (one of the Ten-Percent Rule's sanctioned uses — identical token application to the homepage card, so price always *looks* like price across the whole site).
6. **Short description** — Body-small, Ink (not Ink-soft — DESIGN.md's "no light-gray substitutes" applies to descriptive copy as much as to headings), 1–2 lines with a graceful `-webkit-line-clamp` truncation (never a hard character cut mid-word). This is new relative to the homepage card and is what makes a PLP card feel like *information*, not just a thumbnail-plus-button.
7. **Action row** — two buttons, equally weighted in size (unlike the homepage card's primary+icon pairing, both PLP actions are meaningful enough to deserve a label):
   - **"Add to Cart"** — primary, Spice-Red Accent, identical inline-confirmation behavior to the homepage spec §6 ("Added ✓" for ~2s, cart badge pulses).
   - **"View Details"** — secondary/ghost (Surface background, Ink border), opens the same `QuickViewDialog` component the homepage uses (or navigates to a full product detail page — pick one site-wide and apply it consistently; do not let "Quick View" on the homepage and "View Details" here open two different kinds of surfaces for what is functionally the same need).

**Card chrome:** Surface background, hairline Border/Divider, `--radius-lg` corners, generous internal padding (`--space-sm` minimum) — no shadow at rest (Flat-Counter Rule). On hover/focus-within: border shifts to Spice-Red Accent (matching the homepage card's hover treatment) *and* the product image receives a **subtle zoom** (`scale(1.04)` over `--duration-base` with `ease-out-quart`, `overflow: hidden` on the image wrapper so the zoom never spills past the card's rounded corners) — this is the one new motion this page introduces, and it stays small and responsive-only per the brief's "no excessive animations" and DESIGN.md's broader motion philosophy. Reduced-motion users get the border-shift only, no scale transform.

**Out-of-stock state:** Image rendered at reduced opacity (~60%) with a plain-language **"Out of Stock"** label overlay (Surface-toned chip, Ink text — never the Spice-Red Accent, which would visually conflate "unavailable" with "price/urgent," per DESIGN.md's note that error/status tones must stay distinct from the accent). "Add to Cart" is replaced with a disabled, clearly-labelled **"Notify When Available"** ghost button (a small, honest piece of added value — turns a dead end into a next step) if the catalog supports it; otherwise the button is simply disabled with a "not-allowed" cursor and the same plain label.

**Grid view vs. List view:** The `GridViewToggle` swaps the card's *layout* (image-above-content in Grid; image-beside-content in List, image fixed at ~30% width) without changing any of its content or token usage — same seven elements, same hierarchy, same hover/focus behavior, just re-flowed. This keeps the toggle genuinely useful (some shoppers scan descriptions faster in a list) without doubling the design-and-build surface area.

---

## 8. User Interaction Specification

| Element | Interaction | Feedback / behavior |
|---|---|---|
| **Breadcrumb** | Click "Home" | Standard navigation; visible hover/focus underline (never color alone) |
| **Category / Weight / Availability checkboxes** | Tap/click toggles; multi-select within each group | Grid updates; result count and active-filter chips update in the same motion; an `aria-live="polite"` region announces the new count ("Showing 8 of 48 products") so screen-reader users aren't left wondering whether anything happened |
| **Price range slider** | Drag handles, or type into the paired Min/Max number fields | Live numeric readout above the slider updates as it's dragged; grid updates on release (drag) or on blur/Enter (typed fields) — never on every keystroke, which would feel jumpy and unpredictable for this audience |
| **Sort dropdown** | Select an option | Grid re-orders in place (no page reload feel); current selection always visible in the closed control, never reverting silently |
| **Grid/List view toggle** | Tap/click either labelled option | Cards re-flow per §7's "Grid view vs. List view"; the active state is visually distinct *and* announced via `aria-pressed` |
| **Active filter chip "✕"** | Click/tap | Removes that one filter; grid and chips update; focus moves sensibly (to the next chip, or to the result count if it was the last one) — never left dangling on a now-removed element |
| **Clear Filters button** | Click/tap (enabled state only) | Resets every filter group to its default; `aria-live` announcement per §6.6; focus returns to the top of the sidebar/panel |
| **Mobile "Filters" button** | Tap | Opens the slide-in panel — identical motion, focus-trap, and scroll-lock behavior to the homepage's `MobileNavDrawer` (§5 of this spec; full spec in `specs/homepage.md` §5/§6) |
| **Mobile panel "Show Results"** | Tap | Applies pending filter changes, closes the panel, scrolls the listing area to the top of the grid, and updates the `aria-live` region — the shopper should land exactly where their new results begin |
| **Product card — Add to Cart** | Click/tap | Identical inline-confirmation pattern to the homepage spec §6 ("Added ✓" for ~2s + cart-badge pulse) — same component, same behavior, no second implementation |
| **Product card — View Details** | Click/tap | Opens the shared `QuickViewDialog` (native `<dialog>`, focus-trapped, `Esc`-dismissible, scrim-backed) populated with this card's full data — identical to the homepage's Quick View |
| **Product card — image hover/focus-within** | Mouse hover or keyboard focus on the card | Subtle `scale(1.04)` zoom, clipped to the rounded corners, `--duration-base`/`ease-out-quart`; border shifts to Spice-Red Accent simultaneously; reduced-motion users get the border shift only |
| **Pagination — Previous / Next / page numbers** | Click/tap | Navigates to the requested page; scrolls the listing area back to the top of the grid (not the top of the whole page — the shopper shouldn't have to re-scroll past the banner and filters they've already set); boundary buttons visibly `disabled` at first/last page; current page marked with `aria-current="page"` |
| **Sidebar scroll behavior (desktop)** | Page scroll | Sidebar stays `position: sticky` within the listing row's height — it should never detach and float over the footer; cap its sticky offset so it stops scrolling once the row's bottom edge approaches |
| **Global focus state** | Keyboard navigation throughout | Every interactive element — including every checkbox, slider handle, chip, and pagination control — gets the same visible focus ring as the rest of the site; this page introduces more interactive controls per screen than any other, making this the single highest-leverage accessibility check on the whole site |
| **Global motion** | All transitions | Responsive only; every animation listed above ships with a `prefers-reduced-motion: reduce` fallback (instant or crossfade) — no exceptions, including the new image-zoom hover |

---

## 9. Section-by-Section Content Hierarchy

### 1. Header
Reused verbatim from `specs/homepage.md` §7 — same logo, nav labels, search, account dropdown, cart. No PLP-specific changes.

### 2. Page Banner
- Breadcrumb: **Home › Products** (current page non-link, `aria-current="page"`)
- Title: **Products**
- Description (one calm, factual sentence — no promotional framing):
  > *Browse our collection of organic spices, curry powders, tea powders, ready mixes, and traditional food products.*

### 3. Filter Sidebar
- Group headings (as `<legend>` elements, Headline scale): **Category · Price · Weight · Availability**
- Category options: **Curry Powders · Spice Powders · Tea Powders · Ready Mixes · Ghee · Organic Products** (counts shown live, e.g., "(14)")
- Price: dual-handle slider, ₹0–₹1000 catalog-wide bounds (confirm against real catalog min/max at build time), paired Min/Max numeric fields
- Weight options: **100g · 250g · 500g · 1kg**
- Availability options: **In Stock · Out of Stock**
- Action: **Clear Filters**

### 4. Listing Controls Bar
- Result count: **"Showing 1–12 of 48 products"** (numbers populated from the live catalog; never hardcoded copy that could drift from reality)
- Active filter chips: one per active selection, each independently removable
- Sort label + options: **Sort by: Popularity · New Arrivals · Price: Low to High · Price: High to Low**
- View toggle: **Grid view · List view** (both labelled — never icon-only, per PRODUCT.md)

### 5. Product Cards
Per card: category label · product name · weight · price (₹) · 1–2 line description · **Add to Cart** · **View Details**. Example (using real catalog entries already established on the homepage, for continuity):
- *Curry Powder · Sambar Curry Powder · 200 g tin · ₹165 · "A balanced, slow-roasted blend for everyday sambar — coriander-forward with a gentle chilli warmth."*
- *Spice Powder · Kashmiri Chilli Powder · 100 g pouch · ₹95 · "Vivid color, mild heat — the chilli powder for cooks who want flavour and warmth without overpowering a dish."*
- *Tea Powder · Nilgiri Tea Powder · 250 g pack · ₹210 · "Full-bodied, aromatic loose tea from the Nilgiri hills, ground for a strong, comforting everyday cup."*
- *Ghee · Pure Cow Ghee · 500 ml jar · ₹540 · "Slow-simmered, traditionally clarified cow ghee — the kind your grandmother would recognise by smell alone."*

*(All description copy: specific, sensory, and factual — never "amazing," "best-in-class," or other empty superlatives, per the copy guidance against aphoristic/marketing-buzzword voice.)*

### 6. Pagination
- **Previous** · page numbers **1 2 3 … 8** · **Next** (desktop/tablet); **Previous · "Page 2 of 8" · Next** (mobile)

### 7. Trust Band
Heading: **"Why Shoppers Trust Elsar"** (reusing the homepage's exact heading and component for cross-page consistency)
Six items — note these use the brief's wording, which differs slightly from the homepage's existing trust copy ("No Preservatives" vs. homepage's "Chemical-Free," "Hygienically Packed" vs. "Hygienic Manufacturing," "Kerala Sourced" vs. "Premium Kerala Sourcing"). **Recommendation: reconcile to one wording set site-wide before build** (see §11 Open Questions) — shipping two phrasings of the same six claims across two pages is a small but real consistency tell.
- **ISO Certified**
- **Organic Products**
- **No Preservatives**
- **Kerala Sourced**
- **Hygienically Packed**
- **Freshness Guaranteed**

### 8. Footer
Reused verbatim from `specs/homepage.md` §7.

---

## 10. Bootstrap Grid Structure

Base container: `.container-xl` throughout — this page runs no full-bleed sections (no hero photography), which is itself part of what makes it read calmer than the homepage.

```html
<!-- Page banner -->
<section class="py-5 bg-warm-paper">
  <div class="container-xl">
    <nav aria-label="Breadcrumb"><ol class="breadcrumb"> <!-- Home › Products --> </ol></nav>
    <h1 class="page-title">Products</h1>
    <p class="page-lede">Browse our collection of organic spices, curry powders, tea powders, ready mixes, and traditional food products.</p>
  </div>
</section>

<!-- Listing layout -->
<section class="py-5">
  <div class="container-xl">
    <div class="row g-4">
      <!-- Sidebar: fixed column on desktop, collapsible block on tablet, off-canvas panel on mobile -->
      <aside class="col-lg-3">
        <div class="filter-sidebar"> <!-- sticky on lg+; toggled <details>/disclosure on md; MobileNavDrawer-pattern panel on sm -->
          <fieldset class="filter-group"> <!-- Category checkboxes --> </fieldset>
          <fieldset class="filter-group"> <!-- Price range slider + min/max fields --> </fieldset>
          <fieldset class="filter-group"> <!-- Weight checkboxes --> </fieldset>
          <fieldset class="filter-group"> <!-- Availability checkboxes --> </fieldset>
          <button class="btn btn-secondary w-100" disabled>Clear Filters</button>
        </div>
      </aside>

      <!-- Listing -->
      <div class="col-lg-9">
        <div class="listing-controls d-flex flex-wrap align-items-center gap-3 mb-4">
          <p class="result-count" aria-live="polite">Showing 1–12 of 48 products</p>
          <div class="active-filters d-flex flex-wrap gap-2"> <!-- removable chips --> </div>
          <div class="ms-lg-auto d-flex align-items-center gap-3">
            <label class="sort-control"> <!-- Sort by: <select> --> </label>
            <div class="view-toggle" role="group" aria-label="Choose layout"> <!-- Grid view / List view --> </div>
          </div>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4" id="productGrid">
          <!-- 12 × .product-card columns; swap row-cols classes via JS when List view is active -->
        </div>

        <!-- Empty state (hidden unless zero matches) -->
        <div class="empty-state text-center py-5" hidden> <!-- message + current filters + Clear Filters --> </div>

        <nav aria-label="Product pages" class="pagination-row mt-5">
          <!-- Previous / page numbers (or "Page X of Y" on mobile) / Next -->
        </nav>
      </div>
    </div>
  </div>
</section>

<!-- Trust band — identical markup pattern to specs/homepage.md §9's Trust & Quality section -->
<section class="py-5 bg-warm-paper">
  <div class="container-xl">
    <h2 class="text-center mb-4">Why Shoppers Trust Elsar</h2>
    <div class="row row-cols-2 row-cols-md-3 row-cols-xl-6 g-4 text-center"> <!-- 6 × badge --> </div>
  </div>
</section>
```

Notes:
- `bg-warm-paper`, `btn-primary`/`btn-secondary`, and the rest of the project-level utility vocabulary are the same overrides defined in `specs/homepage.md` §10 Phase 0 — this page introduces no new color or button variants.
- The sidebar's three responsive states (`fixed column` → `collapsible block` → `off-canvas panel`) share one underlying `filter-sidebar` partial and one set of `fieldset` markup; only the *wrapper* changes per breakpoint. This is the same "one component, several contexts" approach the homepage spec uses for its mobile drawer.
- `g-4` is used consistently for this page's grid rhythm — deliberately a calmer, more uniform feel than the homepage's varied gutters, because a listing page's job is to let the *products* establish rhythm, not the layout.

---

## 11. Accessibility Requirements Checklist (WCAG AA)

This page concentrates more interactive controls per screen than any other on the site, which makes it the highest-stakes accessibility surface. Beyond the global requirements inherited from `specs/homepage.md` §6 (focus rings, reduced motion, keyboard reachability), this page specifically requires:

- [ ] **Checkboxes ≥24×24px**, full-row clickable labels, ≥8px spacing between adjacent options (the brief's explicit "large checkboxes, large labels" — verify against real device testing, not just a ruler on a mockup)
- [ ] **Slider handles ≥28px**, fully operable by keyboard (arrow keys adjust by sensible increments, Home/End jump to bounds), with the numeric-field alternative always present and always in sync
- [ ] **Every filter, sort, and pagination control reachable by keyboard alone**, in a logical tab order (sidebar/panel → listing controls → grid → pagination), with no keyboard traps in the mobile filter panel
- [ ] **`aria-live="polite"` region** announces result-count changes after every filter, sort, page, or clear action — confirmed with an actual screen reader, not assumed from markup
- [ ] **Color is never the sole signal**: active filter state, current page, in-stock/out-of-stock, and active sort all pair a visual tone change with a text/shape/label change (bold weight, "✕" icon + text, "(current)" announcement, etc.)
- [ ] **Contrast audit** repeats the homepage's checklist for this page's *new* surfaces specifically: filter-group legends and labels, slider numeric readout, chip text-on-Surface, description copy (Ink, not Ink-soft), and the disabled-button states (which must stay legible, not fade to illegibility just because they're inactive)
- [ ] **Plain-language labels everywhere a brief might tempt an icon-only shortcut**: "Filters (2)" not a bare funnel icon; "Grid view"/"List view" not bare glyphs; "Remove filter: Curry Powders" not a bare "✕" — every one of these is named explicitly in the brief or PRODUCT.md for a reason
- [ ] **Empty-state and out-of-stock messaging** uses warm, plain language and offers a next step (Clear Filters / Notify When Available) — never a cold dead-end like "0 results"

---

## 12. Recommended Image Dimensions

Extends `specs/homepage.md` §8 — the PLP introduces no new image *types*, only reuses the catalog photography at the same square crop already specified for Product and Quick View cards.

| Asset | Recommended source dimensions | Aspect ratio | Notes |
|---|---|---|---|
| Product card image (Grid view) | 1200 × 1200 px | 1:1 | Identical spec and crop to the homepage's Product card — one consistent catalog shoot, reused everywhere |
| Product card image (List view) | Same source, displayed at ~30% card width | 1:1 (cropped tighter at render) | No second photoshoot — the List layout simply renders the same square asset narrower |
| Out-of-stock overlay treatment | CSS opacity + chip, no separate asset | — | Keeps the catalog to one image per product; availability is a data state, not a photography variant |

---

## 13. Development-Ready Implementation Plan

### Phase 0 — Confirm shared foundations (should already exist from the homepage build)
1. Verify `base.html`, `partials/_header.html`, `partials/_footer.html`, the `QuickViewDialog` controller, and the `TrustBadge` component from `specs/homepage.md` Phase 0 are in place and unchanged — this page is the first real test of whether those were built for reuse or merely for the homepage. If anything needs PLP-specific tweaks, that's a signal the original component wasn't generalized enough; fix the shared component, don't fork it.

### Phase 1 — Static structure
2. Build `products.html` extending `base.html`; lay down the page banner, two-column listing layout, and trust band per §10, with placeholder catalog data, verifying the three-breakpoint grid collapse (§3–5) before any filtering logic is wired in.
3. Build the `filter_sidebar.html` partial once, with the three responsive wrappers (`fixed column` / `collapsible block` / `off-canvas panel`) sharing the same `fieldset` markup — confirm it renders correctly in all three states with zero JS before adding interaction.

### Phase 2 — Filtering, sorting, and pagination logic
4. Wire category/weight/availability checkboxes and the price range (slider + numeric fields, kept in sync both directions) to live query-parameter-driven filtering — server-rendered results preferred over client-side filtering for this audience (predictable page loads beat snappy-but-occasionally-confusing live updates; confirm this trade-off against the project's actual stack before committing).
5. Build the `aria-live` result-count/announcement region and the active-filter-chip system (add/remove independently, "Clear Filters" resets all) as one coordinated state — they must never be able to drift out of sync with each other or with the actual grid contents.
6. Build the Sort dropdown and Grid/List view toggle; confirm the view toggle re-flows card layout via CSS class swap only (no re-render of card content) for instant, jank-free switching.
7. Build pagination: Previous/Next/page-number controls (desktop/tablet) and the "Page X of Y" compact pattern (mobile), both wired to the same underlying paging logic, both scrolling the listing area (not the whole page) back to the grid's top on navigation.

### Phase 3 — States and edge cases
8. Build the empty-result state (message + current filters + Clear Filters), the loading/skeleton state (same grid dimensions as loaded state, brand-neutral tones), and the out-of-stock card variant (muted image, plain label, disabled/alternate action) — confirm none of these can render in a half-finished or visually broken way under real data conditions (zero results, all-out-of-stock category, single-result page, etc.).

### Phase 4 — Accessibility & quality pass
9. Run the full §11 checklist with real assistive technology (not just automated scanners) — this page's filter sidebar and listing controls bar are the densest interactive surfaces on the site and the most likely place for keyboard traps, missing announcements, or icon-only regressions to hide.
10. Repeat the homepage's contrast and `prefers-reduced-motion` passes (specs/homepage.md Phase 3, steps 14/16) specifically against this page's new surfaces: filter groups, chips, slider, disabled states, and the new image-hover-zoom.

### Phase 5 — Responsive & performance QA
11. Walk all three breakpoints checking specifically: sidebar→collapsible→panel transition points, 3/2/1-column grid behavior, description-text wrapping at each card width, and pagination pattern switch (numbered row → "Page X of Y").
12. Confirm lazy-loading and `width`/`height` attributes prevent layout shift across filter/sort/page changes — this page re-renders its grid more often than any other, making CLS regressions easy to introduce and easy to miss in a quick visual check.

### Phase 6 — Content & sign-off
13. Replace placeholder copy with final catalog content; resolve the trust-band wording question (§14) before this page ships alongside the homepage.
14. Final read against PRODUCT.md's anti-references and DESIGN.md's Do's/Don'ts — with this page's filter-heavy surface, pay particular attention to the Ten-Percent Rule (it's easy for "active state" accent usage to creep past 10% once chips, sliders, checkboxes, and the active page number are all rendering at once) and to the "icon-only controls" ban (the temptation to compress filter labels to glyphs will be strongest here).

---

## 14. Open Questions Resolved as Defaults

- **Trust-band copy mismatch** → The brief's wording ("No Preservatives," "Kerala Sourced," "Hygienically Packed") differs slightly from the homepage's existing trust section ("Chemical-Free," "Premium Kerala Sourcing," "Hygienic Manufacturing"). **Default: reconcile to one wording set before build** — recommend adopting the brief's plainer phrasing site-wide (it reads slightly more direct and less marketing-adjacent, which fits PRODUCT.md's "clarity over persuasion" principle better) and updating the homepage's copy to match, rather than shipping two versions of the same six claims.
- **Filtering architecture (server-rendered vs. client-side)** → Default to server-rendered, query-parameter-driven filtering (§13, step 4) for predictable, back-button-friendly page states that this audience can trust; revisit only if the catalog size and stack make this genuinely impractical.
- **"View Details" destination (dialog vs. dedicated page)** → Default to reusing the homepage's `QuickViewDialog` (consistent with "Quick View" elsewhere, avoids building a second product-detail surface this spec doesn't otherwise cover); revisit only once a dedicated Product Detail Page is itself specified and built — at that point, reconcile *both* "Quick View" and "View Details" to point at the same kind of destination site-wide.
- **Mobile pagination pattern** → Default to "Previous · Page X of Y · Next" (compact, large-target, unambiguous) over a numbered row, which crowds narrow screens and risks mis-taps for this audience.
- **Out-of-stock "Notify When Available"** → Spec'd as the preferred treatment if the catalog/cart system supports it; falls back to a plainly-labelled disabled state if not. Either is acceptable; a bare hidden/removed out-of-stock product is not (PRODUCT.md: shoppers restocking household basics need to see the full picture, including what's temporarily unavailable).

---

## Recommended impeccable References for Implementation
- **layout.md** — for the sidebar/grid rhythm and the deliberate `g-4`-throughout consistency call in §10
- **interaction-design.md** — for the filter-panel disclosure pattern, slider behavior, and pagination interactions in §6/§8
- **clarify.md** — for the empty-state, out-of-stock, and filter-announcement copy in §0/§6/§7 — getting these plain-language moments right matters more here than almost anywhere else on the site
- **adapt.md** — for the sidebar's three-state responsive transformation (fixed → collapsible → panel) flagged throughout §3–6
- **harden.md** — for the loading/empty/out-of-stock edge states in §0 and Phase 3 of §13
- **animate.md** — for tuning the new image-hover-zoom (§7) so it stays "subtle" in practice, not just in spec language
