# Elsar Homepage Specification
**Heaven Valley Industries — Elsar Curry Powder**
Production-ready, dev-handoff spec for a Bootstrap 5 + Django build.

This spec applies [[PRODUCT.md]] (register: product, audience: older/less tech-savvy home cooks restocking pantry staples, principle: "fast restocking, not discovery shopping") and [[DESIGN.md]] (North Star: "The Trusted Pantry Counter" — restrained earthy palette, Spice-Red Accent at ≤10% of any surface, single humanist sans, flat-by-default surfaces, responsive-only motion). Every decision below traces back to one of those two documents; where this spec adds detail, it stays inside their rules.

---

## 0. Foundation

**Feature summary.** The homepage is the front door of a calm, credible spice-and-food storefront. It needs to do three things fast: let a returning shopper find their usual product and start buying, establish enough trust for a first-time visitor to feel safe ordering food online from a name they may not know, and never get in the way of either with noise.

**Primary user action.** Get to a product (via search, a category, or a featured item) and add it to the cart — or, for a first-time visitor, get convinced enough by the trust signals to keep browsing toward that same action.

**Design direction.**
- **Color strategy:** Restrained (per DESIGN.md and the user's confirmation) — the hero stays in the same earthy register as the rest of the page; large product photography and calm typography carry the first impression, not a saturated color block. The Spice-Red Accent appears only on primary CTAs and price/cart cues (The Ten-Percent Rule).
- **Theme scene sentence:** A woman in her 50s, mid-morning, glances at her phone in the kitchen between cooking tasks to reorder the curry powder she's run low on — she needs large text, an obvious search/category path, and zero friction between "I found it" and "it's in my cart."
- **Anchor reference:** Raidco Foods' storefront (clean, institutional, product-led, minimal promotional noise) — named explicitly in both PRODUCT.md and DESIGN.md as the closest fit.

**Scope.** Production-ready, dev-handoff fidelity. Full breadth (entire homepage, plus the two reusable shell components — header and footer — that every other page depends on). Fully interactive (carousels, dropdowns, mobile drawer, quick view). Built for Bootstrap 5 markup conventions and Django template inheritance/includes.

**Key states to design for:**
| State | What the user needs to see/feel |
|---|---|
| Default (page loaded, content present) | Calm, complete, orienting — "I know where I am and what to do next" |
| Loading (slow connection, first paint) | Stable layout (no shift) — skeleton blocks in brand-neutral tones, never blank white flashes |
| Empty featured-products feed (admin hasn't populated yet) | A plain, honest message + link to the full catalog — never a broken-looking empty grid |
| Carousel/slider at rest vs. mid-interaction | Controls always visible on hover/focus, never hidden until discovery |
| Hover / focus / active on every interactive element | Visible, deliberate, generous — this audience needs confirmation that something is clickable before and after they click it |
| Reduced motion | Every animated element (carousel, drawer, hover transition) has a crossfade-or-instant fallback under `prefers-reduced-motion: reduce` |
| Mobile drawer open / closed | Background content is inert (`aria-hidden`, scroll-locked) while the drawer is open |

---

## 1. Detailed Homepage Wireframe

Structural blocks, top to bottom. Each block is annotated with its DESIGN.md role (background tone, accent usage) so the wireframe doubles as a token-application map.

```
┌─────────────────────────────────────────────────────────────┐
│ STICKY HEADER  (Surface tone, hairline bottom border)        │
│ [Logo]   Home  Products  About Us  Contact Us   [Search]     │
│                                   [Account ▾] [Cart] [☰ on mobile] │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ HERO CAROUSEL (full-bleed, 3 slides, Warm Paper / photography)│
│   Large product photography + headline + sub-line            │
│              [ Primary CTA — Spice-Red Accent button ]       │
│   ‹ prev            • • •  (slide indicators)        next ›  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CATEGORY STRIP  ("Shop by Category" — Display heading)       │
│  ⟨ [img] Curry  [img] Spice  [img] Tea  [img] Mixes … ⟩ →    │
│        (horizontal scroll-snap carousel, swipe on mobile)    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ FEATURED PRODUCTS  ("Customer Favourites" — Display heading) │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│  │ image  │ │ image  │ │ image  │ │ image  │                │
│  │ name   │ │ name   │ │ name   │ │ name   │                │
│  │ weight │ │ weight │ │ weight │ │ weight │                │
│  │ price  │ │ price  │ │ price  │ │ price  │                │
│  │[Add to │ │[Add to │ │[Add to │ │[Add to │                │
│  │ Cart]  │ │ Cart]  │ │ Cart]  │ │ Cart]  │  Quick View ⌕  │
│  └────────┘ └────────┘ └────────┘ └────────┘                │
│                  [ View All Products → ]                     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ABOUT US  (Surface-tone band, two columns)                   │
│  ┌──────────────┐   Heading: Heaven Valley Industries        │
│  │              │   Body: founders, ISO-certified, organic…  │
│  │  large image │   ┌───────┐┌───────┐┌───────┐┌───────┐    │
│  │  (founders / │   │ 31+yrs││Organic││ Award ││ Global│    │
│  │  facility)   │   └───────┘└───────┘└───────┘└───────┘    │
│  │              │   [ Read More → ]                          │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ TRUST & QUALITY  (Warm Paper, icon + label grid)             │
│  [✓ ISO]  [🌿 Organic]  [⌀ Chemical-Free]  [📍 Kerala]       │
│  [🏭 Hygienic]   [⏱ Freshness Guaranteed]                    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ TESTIMONIALS  ("What Our Customers Say" — carousel)          │
│        ┌─────────────────────────────────┐                   │
│        │ "quoted testimonial text…"       │                   │
│        │  ★★★★★  (avatar) Name, location  │                   │
│        └─────────────────────────────────┘                   │
│              ‹ prev   • • •   next ›                          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ FOOTER  (Ink-on-Surface or deep neutral band, 4 columns)     │
│ [Logo]        Main Links     Categories      Contact         │
│ description   Home           Curry Powders   Address          │
│ (social ⊙⊙⊙)  Products       Spice Powders   Phone            │
│               About Us       Tea Powders     Email            │
│               Contact Us     Ready Mixes     Business Hours   │
│                              Ghee                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy

```
HomePage
├── SiteHeader                         (reusable shell — every page)
│   ├── Logo
│   ├── PrimaryNav (Home / Products / About Us / Contact Us)
│   ├── SearchControl (icon → expandable field on mobile, persistent field on desktop)
│   ├── AccountDropdown
│   │   ├── DropdownTrigger (profile icon)
│   │   └── DropdownMenu (My Account / Track Orders / Sign In)
│   ├── CartIcon (badge shows item count)
│   └── MobileMenuToggle (hamburger ⇄ close)
│       └── MobileNavDrawer (slides in from right)
│           ├── PrimaryNav (stacked, large touch targets)
│           ├── AccountLinks (My Account / Track Orders / Sign In)
│           └── CartShortcut
│
├── HeroCarousel
│   └── HeroSlide × 3
│       ├── BackgroundImage
│       ├── Eyebrow / Headline / Subcopy
│       └── PrimaryCTAButton
│   └── CarouselControls (prev/next, indicator dots, autoplay pause toggle)
│
├── CategoryCarousel
│   ├── SectionHeading ("Shop by Category")
│   └── CategoryCard × 6 (image, title, link)
│   └── ScrollControls (desktop arrow buttons; touch/swipe on mobile & tablet)
│
├── FeaturedProductsSection
│   ├── SectionHeading ("Customer Favourites" + optional subcopy)
│   ├── ProductGrid
│   │   └── ProductCard × N
│   │       ├── ProductImage
│   │       ├── ProductName
│   │       ├── ProductWeight
│   │       ├── ProductPrice
│   │       ├── AddToCartButton (primary, Spice-Red Accent)
│   │       └── QuickViewButton (secondary/ghost)
│   ├── QuickViewDialog (native <dialog>, populated per product)
│   └── ViewAllProductsCTA
│
├── AboutSection
│   ├── MediaColumn (founders/facility image)
│   └── ContentColumn
│       ├── Heading ("Heaven Valley Industries")
│       ├── BodyCopy (founders, certification, mission)
│       ├── StatCard × 4 (31+ Years / Organic / Award-Recognised / International Reach)
│       └── ReadMoreButton (links to full About Us page)
│
├── TrustQualitySection
│   ├── SectionHeading ("Why Shoppers Trust Elsar")
│   └── TrustBadge × 6 (icon + short label, no card chrome — see §6)
│
├── TestimonialsCarousel
│   ├── SectionHeading ("What Our Customers Say")
│   └── TestimonialCard × N
│       ├── CustomerAvatar
│       ├── CustomerName + Location
│       ├── StarRating
│       └── TestimonialText
│   └── CarouselControls (prev/next, indicator dots)
│
└── SiteFooter                         (reusable shell — every page)
    ├── BrandColumn (logo, short description, SocialIcons)
    ├── MainLinksColumn (Home / Products / About Us / Contact Us)
    ├── CategoriesColumn (Curry / Spice / Tea / Mixes / Ghee)
    └── ContactColumn (Address / Phone / Email / Business Hours)
```

`SiteHeader` and `SiteFooter` are the two components explicitly built for reuse — every other page in the site extends the same Django base template that wraps them, so they're specified once here and never redefined per page.

---

## 3. Desktop Layout Specification (≥ 1200px / Bootstrap `xl`/`xxl`)

**Container:** Bootstrap `.container-xl` (max-width ~1140–1320px), centered, with generous outer gutters so content never touches the viewport edge even on ultra-wide monitors.

- **Header:** Single row. Logo far left; primary nav inline to its right with generous letter-spacing (Label scale, sentence case — never tracked-out caps); search field shown persistently (not icon-only) at center-right since desktop has the room and this audience benefits from always-visible affordances; account dropdown, cart icon, with badge, anchor the right edge. Height ~80px so touch/click targets stay generous even though desktop doesn't strictly need touch sizing — consistency matters more than micro-optimizing per input type.
- **Hero:** Full-bleed carousel, fixed aspect ratio (~21:9 to 16:9, see §8 for exact px), headline and CTA positioned left-third over a subtle scrim (never a hard color block — the photography carries the moment, the scrim only ensures text contrast). One slide visible at a time, prev/next arrows at the vertical center of the left/right edges, indicator dots bottom-center.
- **Category strip:** Six category cards laid out in a single row with no wrap; if all six fit without scrolling at this width, the "carousel" becomes a static row (still keep the same markup/controls so the behavior is consistent down to tablet, where it starts scrolling).
- **Featured products:** 4-column grid (Bootstrap `row-cols-xl-4`). Section heading left-aligned, "View All Products" CTA right-aligned on the same baseline, or centered below the grid — pick one and keep it consistent with the Category strip's heading treatment.
- **About Us:** Two-column row, image column ~5/12, content column ~7/12 (`col-lg-5` / `col-lg-7`). Stat cards arranged in a 4-up row inside the content column (or 2×2 if the content column is narrow at this breakpoint — test both and keep whichever avoids cramped numerals).
- **Trust & Quality:** Six items in a single row (`row-cols-xl-6`), icon-over-label, no card borders or shadows (Flat-Counter Rule) — this section reads as a calm checklist, not a row of badges competing for attention.
- **Testimonials:** One large card centered (~8/12 width) with generous whitespace either side; prev/next controls flank the card rather than overlapping it.
- **Footer:** Four equal columns (`row-cols-xl-4`), generous column gaps, top border in Border/Divider tone separating it from the page body above.

---

## 4. Tablet Layout Specification (≈ 768px–1199px / Bootstrap `md`/`lg`)

- **Header:** Logo and primary nav remain inline if they fit; if the four nav links plus search start to crowd, collapse the nav into the same `MobileNavDrawer` pattern early (don't invent a third, in-between nav pattern — two well-tested patterns beat three). Search collapses to an icon that expands a field on tap. Account and cart icons remain visible.
- **Hero:** Same carousel, slightly taller relative aspect ratio (text needs more vertical room as the image gets narrower); CTA button remains full touch-target size, never shrinks below the mobile minimum.
- **Category strip:** Switches to active horizontal scroll-snap — roughly 3.5 cards visible at once (the partial card is the affordance that signals "more to scroll").
- **Featured products:** 2-column grid (`row-cols-md-2`). Card internal padding stays generous; this is where cramped layouts usually start, so re-check line-wrapping on product names at this width specifically.
- **About Us:** Stacks to a single column — image first (full width, capped height so it doesn't dominate), then content, then a 2×2 stat-card grid, then the Read More button.
- **Trust & Quality:** 3-column grid (`row-cols-md-3`), two rows of three.
- **Testimonials:** Card width grows to ~10/12 or full width with side padding; controls move below the card if side-flanking gets cramped.
- **Footer:** 2-column grid (`row-cols-md-2`) — Brand+MainLinks paired, Categories+Contact paired, or Brand alone on its own row with the other three as a 3-up — choose whichever keeps the Contact column's longer lines (address, hours) from wrapping awkwardly.

---

## 5. Mobile Layout Specification (< 768px / Bootstrap `sm`/base)

This is the primary design target — the scene sentence describes a phone in a kitchen.

- **Header:** Logo left, hamburger (`MobileMenuToggle`) right, search icon adjacent (expands to a full-width field below the header bar on tap, doesn't navigate away). Cart icon visible in the bar itself (shoppers should always see their cart count without opening the menu). Account access lives inside the drawer.
  - **Mobile drawer:** Slides in from the right, ~85% viewport width (never full-bleed — a sliver of the page behind it reinforces "this is an overlay, tap outside to dismiss"). Animation: 200–250ms ease-out-quart transform, with an instant-show/hide fallback under reduced motion. Background scroll-locked and `aria-hidden`. Order top-to-bottom: primary nav links (large, ~56px touch height, generous spacing), divider, account links (My Account / Track Orders / Sign In), divider, cart shortcut. Close via the toggle (now an "✕"), a tap on the scrim, or <kbd>Esc</kbd>.
- **Hero:** Taller, more vertical aspect ratio crop (portrait-leaning) so the product photo doesn't shrink to illegibility; headline sizes down via the Display clamp but never below comfortable reading size; CTA button is full-width or near-full-width — the single clearest tap target on the slide. Swipe gestures move slides; dots remain the position indicator (arrows can hide on touch devices where swipe is the primary input).
- **Category strip:** Horizontal swipe carousel, ~1.5–2 cards visible (partial-card peek signals scrollability). Card images square, titles beneath in Title scale.
- **Featured products:** Single column (`row-cols-1`) or, if the catalog and card design support it, a tight 2-column grid — test both; single column reads calmer and matches "fast restocking" better than a dense grid for this audience, but confirm product imagery doesn't look too small at 2-up before deciding. **Default recommendation: single column**, "View All Products" as a full-width button beneath.
- **About Us:** Single column — image (cropped to a wide banner ratio so it doesn't push content far down the page), heading, body copy (capped at 65–75ch, which on mobile means edge-to-edge with side padding), stat cards stacked 2-up, Read More as a full-width or clearly tappable button.
- **Trust & Quality:** 2-column grid (`row-cols-2`) — six items as 3 rows of 2, icon-over-label, generous vertical spacing between rows so adjacent items don't visually merge.
- **Testimonials:** Single card, full width minus side gutters; swipe to advance; dots below.
- **Footer:** Stacks to a single column. Order: Brand (logo, description, social icons), Main Links, Categories, Contact — each column becomes its own labeled block with a small heading, generous spacing between blocks so the long list of links doesn't read as one undifferentiated wall of text.

---

## 6. User Interaction Specification

| Element | Interaction | Feedback / behavior |
|---|---|---|
| **Sticky header** | Persists on scroll | Stays pinned; on scroll-down past the hero it may compress slightly (reduce height) to reclaim vertical space — subtle, instant, no bounce |
| **Search** | Tap/click icon (mobile) or focus field (desktop) | Field expands or is already present; submits to a results page; Enter key submits; clear (×) button appears once text is entered |
| **Account dropdown** | Click/tap toggles; hover does *not* trigger on touch devices | Opens a menu (My Account / Track Orders / Sign In) anchored below the icon; closes on outside click, item selection, or <kbd>Esc</kbd>; each item is a real link with visible focus state |
| **Cart icon** | Click navigates to cart; badge shows live item count | Badge updates with a brief, subtle pulse (responsive motion only — confirms "that action landed", nothing decorative) |
| **Mobile hamburger** | Tap toggles the drawer | Icon morphs hamburger ⇄ close; drawer slides in from right per §5; focus moves into the drawer on open and returns to the toggle on close (focus management is mandatory, not optional, for this audience) |
| **Hero carousel** | Autoplay (≈6–7s/slide, generous — this audience should never feel rushed to read); pauses on hover, focus-within, and touch interaction | Manual prev/next controls and indicator dots always present and reachable by keyboard; swipe on touch; crossfade transition (`ease-out-quart`, ~400ms); reduced-motion users get an instant cut with no animated transform |
| **Category carousel** | Drag/swipe on touch; arrow buttons on desktop (appear on hover/focus, not hidden entirely at rest — discoverability matters more than minimalism here) | Scroll-snap per card; reaching the end disables (visibly, not just silently) the forward control |
| **Product card — Add to Cart** | Click/tap | Inline state change on the button itself (e.g., label briefly becomes "Added ✓" with a tonal shift, reverting after ~2s) *and* the cart badge updates — two small, calm confirmations rather than one disruptive modal or toast. No celebratory animation; this is a routine action for a routine shopper |
| **Product card — Quick View** | Click/tap | Opens a `<dialog>` (native, focus-trapped, `Esc`-dismissible, scrim-backed) showing larger image, full name, weight options if any, price, description excerpt, and its own Add to Cart — lets the shopper confirm details without losing their place in the grid |
| **About Us — Read More** | Click/tap | Navigates to the full About Us page (this is a homepage teaser, not an accordion-expand — keeps the homepage focused and gives About its own dedicated, link-shareable surface) |
| **Trust & Quality badges** | Static (no interaction) | Purely informational — resist the urge to make these clickable just because icons "look interactive"; that would be a false affordance |
| **Testimonials carousel** | Manual prev/next + swipe; *no autoplay* | Unlike the hero (which sells the brand), testimonials are read-at-the-user's-pace content — autoplay risks cutting someone off mid-read. Controls always visible, large enough to tap confidently |
| **Footer links / social icons** | Standard link behavior | Visible hover/focus states (tone shift + underline on text links — never color alone, for colorblind users); social icons sized to the same generous touch-target minimum as everything else |
| **Global focus state** | Keyboard navigation throughout | Every interactive element gets a visible focus ring per DESIGN.md's Inputs spec ("clearly visible, not a subtle color nudge") — this is non-negotiable for the stated accessibility requirements, not a nice-to-have |
| **Global motion** | All transitions | Responsive only (DESIGN.md: "confirm the action that happened, and stop there"); every animation listed above ships with a `prefers-reduced-motion: reduce` fallback that crossfades or cuts instantly — no exceptions |

---

## 7. Section-by-Section Content Hierarchy

### 1. Header
- Logo (wordmark/lockup — links to homepage)
- Nav labels: **Home · Products · About Us · Contact Us**
- Search placeholder: *"Search curry powders, spices, tea…"* (specific to the catalog, not a generic "Search…")
- Account dropdown items: **My Account · Track Orders · Sign In**
- Cart label (visually an icon + count; needs an accessible label like "Cart, 3 items")

### 2. Hero Carousel (3 slides — trust-focused, no discounts/urgency)
1. **Slide 1 — Heritage/quality:** Headline e.g. *"Spices crafted the way your grandmother trusted"* · Sub-line grounding it in fact (Kerala-sourced, ISO-certified) · CTA: **"Shop Curry Powders"**
2. **Slide 2 — Purity/process:** Headline e.g. *"No preservatives. No artificial colours. Just spice."* · Sub-line on the flavour-lock process · CTA: **"See What Makes Us Different"** (→ About/Quality)
3. **Slide 3 — Range/restocking:** Headline e.g. *"Everything your kitchen reaches for, in one place"* · Sub-line naming the categories · CTA: **"Browse All Products"**

*(All three are statements of fact and craft — never "Sale," "% off," or countdown language, per PRODUCT.md's anti-reference on promotional pressure.)*

### 3. Category Strip
Heading: **"Shop by Category"**
Cards: **Curry Powders · Spice Powders · Tea Powders · Ready Mixes · Ghee · Organic Products** — each with one representative product photo and its plain-language title (no "01/02" numbering — PRODUCT.md and DESIGN.md both reject numbered-eyebrow scaffolding).

### 4. Featured Products
Heading: **"Customer Favourites"** (or "Most Reordered" — leans into the "restocking" framing rather than generic "Featured")
Per card: product photo · name · weight (e.g. "200 g") · price (₹, in Spice-Red Accent per the Ten-Percent Rule — this is one of its sanctioned uses) · **Add to Cart** (primary button) · **Quick View** (secondary/ghost button or icon-link)
Section close: **"View All Products →"**

### 5. About Us
Heading: **"Heaven Valley Industries"**
Body (condensed from the provided company info — full version lives on the About page):
> *Founded by Shri. Varghese Muttom and Smt. Elsa Varghese, Heaven Valley Industries is an ISO-certified maker of organic spices and blended spice powders — sourced in Kerala, made without preservatives or artificial colours, and trusted by households for over three decades.*

Stat cards (four, each: a number/label pair, plain and unembellished — no animated counters, this audience doesn't need a number to roll up to feel real):
- **31+ Years** — of trusted service
- **100% Organic** — no preservatives, no artificial colours
- **Award-Recognised** — for quality and craft
- **Global Reach** — trusted by customers across countries

CTA: **"Read More About Us →"**

### 6. Trust & Quality
Heading: **"Why Shoppers Trust Elsar"**
Six items, icon + short label (label does the explaining — icon reinforces, never substitutes):
- **ISO Certified**
- **Organic Products**
- **Chemical-Free**
- **Premium Kerala Sourcing**
- **Hygienic Manufacturing**
- **Freshness Guaranteed**

### 7. Testimonials
Heading: **"What Our Customers Say"**
Per card: customer photo (real, with consent — never stock-photo generic), name + general location (e.g. "Anita R., Kochi"), star rating (visual stars *plus* a text equivalent like "5 out of 5" for screen readers and for users who can't distinguish the icon at a glance), and a short, specific quote — favor concrete detail ("the curry powder tastes like my mother's") over generic praise ("great product!").

### 8. Footer
- **Column 1 (Brand):** Logo, one-line description (e.g. *"Traditional spices and food essentials, made the honest way since [founding year]."*), social icons (each with a real accessible label: "Follow Elsar on Instagram", not "Social link 1")
- **Column 2 (Main Links):** Home · Products · About Us · Contact Us
- **Column 3 (Categories):** Curry Powders · Spice Powders · Tea Powders · Ready Mixes · Ghee
- **Column 4 (Contact):** Address · Phone (tel: link) · Email (mailto: link) · Business Hours (plain-language, e.g. "Mon–Sat, 9 AM – 6 PM IST")

---

## 8. Recommended Image Dimensions

All raster images: provide `srcset`/responsive variants and modern formats (WebP/AVIF with a JPEG fallback), `width`/`height` attributes set to prevent layout shift, and `loading="lazy"` for everything below the hero.

| Asset | Recommended source dimensions | Aspect ratio | Notes |
|---|---|---|---|
| Logo (header) | SVG preferred; PNG fallback ~ 320×96px @2x | — | Must stay legible at ~160×48 rendered size |
| Hero slide image — desktop | 2400 × 1000 px | ~21:9 | Crop-safe zone: keep focal subject in the center 60%; left third will carry text overlay |
| Hero slide image — tablet | 1600 × 1000 px | ~16:10 | |
| Hero slide image — mobile | 1080 × 1350 px | ~4:5 (portrait) | Needs its own art-directed crop, not a scaled-down desktop crop — the subject must still read at this orientation |
| Category card image | 800 × 800 px | 1:1 | Square crop, single product or ingredient as subject, consistent framing across all six for a calm, ordered feel |
| Product card image | 1200 × 1200 px | 1:1 | Consistent neutral or Warm-Paper-toned background across the catalog — this is what makes a grid feel intentional rather than templated |
| Quick View image | 1600 × 1600 px | 1:1 | Larger crop of the same product photo, not a different shot |
| About Us image | 1600 × 2000 px (desktop two-col) / 1600 × 900 px (mobile banner crop) | ~4:5 desktop / ~16:9 mobile | Real photo of founders or facility — this is a trust signal, must not look stock |
| Stat card icons (if used) | SVG, 48 × 48 px viewbox | — | Inline SVG per DESIGN.md component rules — no icon-font dependency |
| Trust & Quality icons | SVG, 64 × 64 px viewbox | — | One consistent stroke-weight/style across all six — mismatched icon styles is a fast tell of a thrown-together page |
| Testimonial avatar | 192 × 192 px | 1:1 (circular crop) | Real customer photos with consent; provide a calm, brand-toned placeholder (initials on a Surface-tone circle) for customers without photos — never a generic silhouette icon |
| Footer social icons | SVG, 24 × 24 px viewbox | — | |

---

## 9. Bootstrap Grid Structure

Base container: `.container-xl` for all sections except the Hero and Trust & Quality bands, which run full-bleed (`.container-fluid` or no container, with an inner `.container-xl` for text/controls so copy still aligns with the rest of the page).

```html
<!-- Header -->
<header class="navbar navbar-expand-lg sticky-top">
  <div class="container-xl">
    <!-- logo / nav / search / account / cart / toggler -->
  </div>
</header>

<!-- Hero -->
<section class="hero-carousel"> <!-- full-bleed; carousel controls inside .container-xl overlay --> </section>

<!-- Category strip -->
<section class="py-5">
  <div class="container-xl">
    <div class="d-flex justify-content-between align-items-end mb-4"> <!-- heading + (optional) view-all --> </div>
    <div class="category-scroller d-flex flex-nowrap overflow-auto gap-3"> <!-- 6 × .category-card, scroll-snap-x --> </div>
  </div>
</section>

<!-- Featured products -->
<section class="py-5 bg-surface">
  <div class="container-xl">
    <h2 class="mb-4">Customer Favourites</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4"> <!-- N × .product-card columns --> </div>
    <div class="text-center mt-5"><a class="btn btn-secondary btn-lg" href="...">View All Products</a></div>
  </div>
</section>

<!-- About Us -->
<section class="py-5">
  <div class="container-xl">
    <div class="row align-items-center g-5">
      <div class="col-12 col-lg-5"> <!-- image --> </div>
      <div class="col-12 col-lg-7">
        <!-- heading, copy -->
        <div class="row row-cols-2 row-cols-lg-4 g-3 my-4"> <!-- 4 × stat card --> </div>
        <a class="btn btn-primary btn-lg" href="...">Read More About Us</a>
      </div>
    </div>
  </div>
</section>

<!-- Trust & Quality -->
<section class="py-5 bg-warm-paper">
  <div class="container-xl">
    <h2 class="text-center mb-4">Why Shoppers Trust Elsar</h2>
    <div class="row row-cols-2 row-cols-md-3 row-cols-xl-6 g-4 text-center"> <!-- 6 × badge --> </div>
  </div>
</section>

<!-- Testimonials -->
<section class="py-5">
  <div class="container-xl">
    <h2 class="text-center mb-4">What Our Customers Say</h2>
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8"> <!-- carousel --> </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="bg-ink text-warm-paper pt-5 pb-4">
  <div class="container-xl">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <!-- 4 × footer column -->
    </div>
  </div>
</footer>
```

Notes:
- `bg-surface`, `bg-warm-paper`, `bg-ink`, `text-warm-paper`, `btn-primary` (Spice-Red Accent), `btn-secondary` (Surface/Ink-bordered ghost) are project-level utility/variable overrides mapped to the DESIGN.md tokens — not Bootstrap's stock blue/gray palette. Define them once in the SCSS variable layer (see §10) so every page inherits the same vocabulary.
- `g-3`/`g-4`/`g-5` gap utilities replace manual margin juggling and keep rhythm consistent across breakpoints — vary the step deliberately between sections (per DESIGN.md's "vary spacing for rhythm"), don't let every section default to the same `g-4`.
- Carousels use Bootstrap's `.carousel` JS component as the base, extended with the custom autoplay-pause/reduced-motion/swipe behaviors specified in §6 — don't hand-roll a slider from scratch when the framework component covers 80% of it.

---

## 10. Development-Ready Implementation Plan

### Phase 0 — Tokens & shell (foundation; nothing else can start cleanly without this)
1. Translate DESIGN.md's token set into a Bootstrap 5 SCSS variable override file (`_variables.scss`): map `$primary` → Spice-Red Accent, `$body-bg`/`$light` → Warm Paper, `$body-color` → Ink, a new `$surface` → Surface, `$border-color` → Border/Divider. Resolve the placeholder hex values in DESIGN.md to real OKLCH-derived hex during this step (the seed marks them `[to be resolved during implementation]` — this is that implementation).
2. Set the type scale: import the chosen humanist sans (DESIGN.md names the *direction*, not the family yet — pick one in the Inter/Public Sans/Source Sans family as noted, confirm license and self-host for performance and offline reliability), wire up the Display/Headline/Title/Body/Label scale as Bootstrap's `$font-size-*` and heading overrides.
3. Build `base.html` (Django): blocks for `title`, `extra_css`, `content`, `extra_js`; includes `{% raw %}{% include "partials/_header.html" %}{% endraw %}` and `{% raw %}{% include "partials/_footer.html" %}{% endraw %}` so every future page inherits the reusable shell from day one.
4. Build `partials/_header.html` and `partials/_footer.html` exactly per §2/§3-5 — these are the two components explicitly specified for reuse; get them right once, here, before any page-specific work begins.

### Phase 1 — Static structure (markup before behavior)
5. Build `home.html` extending `base.html`; lay down all eight sections' markup per §9, with placeholder copy/images, verifying the Bootstrap grid collapses correctly at all three breakpoints (§3-5) before any JS is added.
6. Wire Django context so each section pulls real data where it exists (featured products from the catalog app, categories from the category model) and degrades honestly to the empty-state copy from §0 when data is missing — never ship a section that can silently render blank.

### Phase 2 — Interactive components
7. Hero carousel: extend Bootstrap's `.carousel` with autoplay timing, hover/focus-pause, swipe, and the reduced-motion crossfade fallback from §6.
8. Category & testimonial carousels: scroll-snap + swipe + arrow controls; testimonials carousel ships *without* autoplay per §6's reasoning.
9. Mobile nav drawer: build as a custom off-canvas (Bootstrap's `.offcanvas` is the right base) configured to slide from the right, with focus-trap, scroll lock, and `aria-hidden` management on the background per §5.
10. Account dropdown: Bootstrap `.dropdown`, click-toggled (not hover) so it behaves identically on touch and pointer devices.
11. Quick View: native `<dialog>` populated via a small JS controller reading each card's product data attributes; focus-trapped, `Esc`-dismissible, scrim-backed.
12. Add-to-cart inline confirmation: small state-machine on the button (`idle → added → idle`) plus a cart-badge update event — both wired to the same cart action so they can never fall out of sync.

### Phase 3 — Accessibility & quality pass
13. Keyboard-only walkthrough of the entire page: every control in §6 reachable, in a sensible order, with the visible focus ring DESIGN.md specifies. Fix tab order before fixing anything cosmetic.
14. Contrast audit: run Ink-on-Warm-Paper, Spice-Red-on-Warm-Paper (for the price/CTA use), and all button states through a contrast checker against the 4.5:1 (body) / 3:1 (large text) thresholds in the skill's color rules — DESIGN.md's "no light-gray substitutes" rule is the one most likely to get quietly violated under deadline pressure, so check it explicitly.
15. Screen-reader pass: confirm the cart badge, star ratings, social icons, and carousel controls all have meaningful accessible names (per the specific examples called out in §7) — not generic "button" or "link" announcements.
16. `prefers-reduced-motion` pass: toggle the OS setting and confirm every animated element in §6 has its fallback engaged, with no element left permanently hidden (the reveal-gating pitfall DESIGN.md's general rules warn about).

### Phase 4 — Responsive & performance QA
17. Walk all three breakpoints (§3/§4/§5) on real devices where possible, checking specifically: header collapse point, category-strip card count at each width, featured-grid column count decision (the "test both, default to single-column" call in §5), and footer column-pairing choice on tablet.
18. Image pipeline: generate the `srcset` variants from §8's source dimensions, serve WebP/AVIF with JPEG fallback, confirm `width`/`height` attributes prevent layout shift, lazy-load everything below the hero.
19. Lighthouse / Core Web Vitals pass on the assembled page — pay particular attention to CLS (carousel and image-grid layout stability) and LCP (the hero image, which should be preloaded, not lazy-loaded).

### Phase 5 — Content & sign-off
20. Replace placeholder copy with final content per §7 (hero headlines, product favourites, About Us condensed copy, trust labels, real testimonials with consent-cleared photos).
21. Final read against PRODUCT.md's anti-references and DESIGN.md's Do's/Don'ts as a checklist — confirm nothing resembling a generic template, promo banner, countdown timer, drop-shadowed card, or gray-on-cream body text has crept in during build.

---

## Recommended impeccable References for Implementation
- **layout.md** — for the multi-section rhythm and grid decisions in §3-5 (varying spacing deliberately between sections rather than defaulting to one gap value everywhere)
- **interaction-design.md** — for the carousel, drawer, dropdown, and Quick View dialog behaviors in §6
- **typeset.md** — for resolving the humanist-sans family choice and tuning the Display/Headline/Title/Body/Label scale from DESIGN.md's directional spec into real values
- **animate.md** — for the responsive-motion transitions (carousel crossfades, button confirmation states, drawer slide) and their reduced-motion fallbacks
- **harden.md** — for the empty/loading/error states in §0 and the honest-degradation behavior in Phase 1, step 6
- **adapt.md** — for the breakpoint-specific decisions flagged as "test both" in §5 (featured-grid column count, footer column pairing)

---

## Open Questions Resolved as Defaults
- **Featured-grid mobile column count** → default to single column (§5); re-test with real product photography before locking.
- **Header nav collapse point on tablet** → collapse early into the same mobile drawer pattern rather than inventing a third nav treatment (§4).
- **Hero autoplay timing** → 6–7 seconds per slide, generous and unhurried, consistent with the "calm, never rushed" brand personality.
- **Testimonial carousel autoplay** → off by default; this is read-paced content, not brand messaging (§6).
