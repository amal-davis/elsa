<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: elsa
description: A clean, credible storefront for restocking traditional spices, masalas, tea, mixes, and ghee.
---

# Design System: elsa

## 1. Overview

**Creative North Star: "The Trusted Pantry Counter"**

elsa should feel like the shop counter you already trust: the one where you walk in, point at the tin you always buy, and walk out in under a minute. The system is restrained and earthy — tinted neutrals doing the heavy lifting, one warm spice-anchored accent appearing only where it earns its place (primary actions, key product cues). Calm replaces persuasion; clarity replaces decoration. Raidco Foods' clean, institutional storefront is the closest fit: minimal visual noise, product information stated plainly, trust built through legibility rather than promotional pressure.

The system explicitly rejects the **generic Shopify-template look** — the interchangeable grid-of-cards storefront that could be selling sneakers, soap, or spices with no change to the shell. Every surface in elsa should read unmistakably as a food storefront: weights in grams/kg, ingredient and freshness cues, product photography that does the talking, never a templated stand-in.

**Key Characteristics:**
- Earthy, restrained palette: tinted warm neutrals with a single spice-toned accent at ≤10% of any surface
- Humanist sans throughout — warm, legible, no serif heritage flourish competing with the shopping task
- Responsive motion only: feedback and transitions on real actions (add to cart, page change), nothing performative
- Generous type scale and touch targets by default, tuned for older and less tech-savvy shoppers
- Flat-by-default surfaces; depth conveyed through tonal layering, not drop shadows

## 2. Colors

**The Restrained Earthy Rule.** Tinted warm neutrals carry the surface; one spice-anchored accent (dried red chili / paprika territory — exact hue **[to be resolved during implementation]**) appears on ≤10% of any screen, reserved for primary actions and the cues that matter (price, "add to cart", order status).

### Primary
- **Spice-Red Accent** (`[to be resolved during implementation]`, anchor: dried red chili / paprika): Primary buttons, active states, price emphasis, and order-status cues. Used sparingly — its rarity is what makes it register as "this matters."

### Neutral
- **Warm Paper** (`[to be resolved during implementation]`, light warm-tinted neutral): Page background. Tinted toward the accent's own hue at low chroma — not generic cream-by-default.
- **Ink** (`[to be resolved during implementation]`, near-black warm neutral): Body text and headings. Must clear 4.5:1 against Warm Paper; no light-gray substitutes.
- **Surface** (`[to be resolved during implementation]`, slightly deeper than Warm Paper): Cards, input fields, and raised UI regions — distinguished from the page by tone, not by shadow.
- **Border / Divider** (`[to be resolved during implementation]`, low-chroma warm gray): Hairline separators between list rows, table cells, and form fields.

### Named Rules (optional, powerful)
**The Ten-Percent Rule.** The spice-red accent never exceeds roughly a tenth of any given screen's surface. If it's everywhere, it stops meaning "pay attention here."

## 3. Typography

**Display Font:** `Fraunces` (warm display serif, semibold) — section titles, hero headlines, the "elsa" wordmark.
**Body Font:** `Source Sans 3` (humanist sans) — body copy, labels, navigation, prices, every reading task.
**Label/Mono Font:** Not used. Prices and quantities render in Source Sans 3 at a heavier weight; no monospace digit treatment needed for this surface.

**Character:** A warm display serif carries the "crafted, trusted for generations" feeling at headline size, where its character reads as heritage rather than decoration; a clean humanist sans handles every task that demands fast, comfortable reading. Two families, each doing one job — never competing on the same line.

### Hierarchy
- **Display** (semibold–bold, `clamp(1.75rem, 4vw, 2.5rem)`, tight line-height): Page and section titles — used sparingly; this is a commerce surface, not an editorial one.
- **Headline** (semibold, `~1.25rem`–`1.5rem`): Category names, product names on detail pages.
- **Title** (medium, `~1.125rem`): Card and list-row titles (product names in grids, cart line items).
- **Body** (regular, `~1rem`–`1.0625rem`, 1.5 line-height, capped at 65–75ch): Product descriptions, ingredient lists, help and policy copy. Sized up from typical default — this audience reads at arm's length, not squinting.
- **Label** (medium, `~0.875rem`, slightly open letter-spacing, sentence case — never tracked-out all-caps body): Form field labels, filter chips, status tags.

### Named Rules (optional)
**The Heritage Pairing Rule.** elsa uses exactly two type families, split cleanly by job: Fraunces for anything that announces (headlines, section titles, the wordmark), Source Sans 3 for anything that's read at length (body, labels, prices, navigation). Never both on the same element, never a third family introduced.

## 4. Elevation

elsa is flat by default. Depth is conveyed through tonal layering — Surface sits one step deeper than Warm Paper — not through drop shadows. Shadows, where they appear at all, are reserved for genuinely floating elements (modals, toasts, dropdown menus) and stay soft and close to the surface; they signal "this is temporarily above the page," not "this card is fancy."

### Shadow Vocabulary (if applicable)
- **Floating** (`box-shadow: 0 8px 24px rgba(20, 14, 10, 0.12)`): Modals, popovers, toasts, and dropdown menus — anything genuinely overlaying the page. Never applied to standard cards or product tiles.

### Named Rules (optional)
**The Flat-Counter Rule.** Surfaces sit at rest, distinguished by tone, not lifted by shadow. A shadow appears only when something is genuinely floating above the page — never as default card styling.

## 5. Components

No components exist yet — elsa is pre-implementation. The canonical primitives below are best-practice defaults consistent with the rules above; they should be replaced with real extracted tokens on the next `/impeccable document` pass once there's code.

### Buttons
- **Shape:** Gently rounded corners (`[radius to be chosen — likely 6–8px]`), never pill-shaped or sharp-square; reads approachable without looking playful.
- **Primary:** Spice-Red Accent background, Warm Paper text, generous horizontal padding (`~16px 32px`) — sized for confident tapping, not minimal chrome.
- **Hover / Focus:** Slight deepening of the accent on hover; a visible focus ring (not just a color shift) on keyboard focus, sized generously for low-vision and motor-impaired users.
- **Secondary / Ghost:** Surface-toned background or transparent with an Ink border — used for "back," "cancel," and secondary actions that shouldn't compete with the primary buy action.

### Cards / Containers
- **Corner Style:** Gently rounded (`[radius to be chosen, consistent with Buttons]`).
- **Background:** Surface tone, one step deeper than the page — never pure white-on-cream-on-white nesting.
- **Shadow Strategy:** None at rest (see Elevation: The Flat-Counter Rule).
- **Border:** Hairline Border/Divider tone where separation is needed instead of a shadow.
- **Internal Padding:** Generous and consistent — enough breathing room that product name, weight, and price never feel cramped.

### Inputs / Fields
- **Style:** Surface-tone background, hairline border, rounded corners matching Buttons/Cards.
- **Focus:** Border shifts to the Spice-Red Accent with a soft outer glow — clearly visible, not a subtle color nudge that low-vision users will miss.
- **Error / Disabled:** Errors use a clearly distinct (not accent-red-adjacent) warning tone with plain-language copy beneath the field; disabled fields drop to a flatter, lower-contrast Surface tone with a "not-allowed" cursor.

### Navigation
- **Style:** A simple horizontal bar (desktop) collapsing to a clear, labeled bottom or hamburger pattern (mobile) — categories, search, cart, and account given equal visual weight, none buried.
- **Typography:** Label-scale type, sentence case, medium weight.
- **States:** Active category underlined or tonally distinguished (not just color-shifted, for colorblind legibility); hover deepens tone slightly; focus shows a visible ring.
- **Mobile treatment:** Touch targets sized generously (`≥44px`), labels kept visible rather than icon-only — this audience needs words, not glyphs, to navigate confidently.

## 6. Do's and Don'ts

### Do:
- **Do** keep the Spice-Red Accent to roughly a tenth of any screen — primary actions, price, and order-status only (The Ten-Percent Rule).
- **Do** size body text and touch targets generously by default — this is a surface for older and less tech-savvy shoppers, and legibility is the brand promise, not an accessibility afterthought.
- **Do** state product facts plainly: weight, ingredients, freshness — let accuracy build the trust that promotional language would otherwise have to manufacture.
- **Do** keep motion responsive only — confirm the action that happened (added to cart, order placed), and stop there.

### Don't:
- **Don't** build a generic Shopify-template storefront — a grid-of-cards shell that could sell anything. Every screen should read unmistakably as a food storefront (units, ingredients, photography), per PRODUCT.md's anti-reference.
- **Don't** add aggressive promotional banners, countdown timers, or discount popups — the DoubleHorse pattern PRODUCT.md explicitly rejects. elsa earns trust through clarity, not urgency.
- **Don't** layer heritage storytelling, recipe hubs, or cultural narrative blocks over the buy path — reserve that content (if it exists at all) for clearly secondary surfaces that never compete with checkout.
- **Don't** use light-gray body text on warm-tinted backgrounds. If the contrast is even close, push Ink darker — this audience cannot afford to squint.
- **Don't** add drop shadows to standard cards or product tiles. Depth comes from tonal layering (The Flat-Counter Rule); shadows are reserved for genuinely floating elements only.
2