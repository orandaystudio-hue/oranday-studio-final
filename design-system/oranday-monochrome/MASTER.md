# Oranday Studio AI — Monochrome

## Direction

Minimal, precise and dark. A clean typographic signature, graphite surfaces, cool white foregrounds and silver details. User direction replaces the earlier cream/orange/green identity.

The UI/UX Pro Max query `minimalism monochrome dark studio` returned Minimalism & Swiss Style with high contrast, generous spacing, low visual cost and readable storytelling. The resolved system uses the user's monochrome preference and the already self-hosted Inter family instead of the suggested Archivo/Space Grotesk pairing.

## Tokens

| Role | Value |
| --- | --- |
| Background | #08090b |
| Surface | #111317 |
| Raised surface | #191c22 |
| Foreground / CTA | #f5f6f8 |
| Secondary text | #b0b4be |
| Subtle text | #8e949f |
| Decorative divider | #292d35 |
| Interactive border | #4a505b |

Inter is served locally with swap. Headings use 500 weight and tight tracking; body text uses regular weight and comfortable line height. SVG wordmarks have outlined glyphs. The approved compact symbol is formed by two opposed arch-shaped strokes. It is used for the favicon, app icon and simulated phone avatar. The lockup combines this symbol, lowercase `oranday` and the lowercase descriptor `studio ai`. The former `o.` icon is superseded. In Spanish body copy, use `IA` or `inteligencia artificial`.

## Experience

- Lead with the business offer and a single project CTA.
- Show an original interactive phone/workflow demo rather than invented testimonials or performance figures.
- Three service paths: web/positioning, acquisition/follow-up, AI automation.
- HVAC and solar are examples, not restrictions on the studio's audience.
- Visible controls for three scenarios and four stages, with play/pause/replay.
- Autoplay runs once only while at least 30% visible, stops on keyboard focus and page hiding, and is disabled for reduced motion.
- The demo is explicitly simulated. Customer replies and commercial commitments require human review; no messages or model calls are sent by the demo.
- Motion is limited to opacity/transform and meaningful state changes. Content stays usable without JavaScript.
- Responsive checks at 320, 390, 768 and 1440 px; semantic controls and visible focus.

## References inspected

- https://linear.app/ — concise hierarchy and product-led storytelling.
- https://vercel.com/ — clear primary/secondary actions and technical demonstrations.
- https://fin.ai/ — showing workflow capabilities through concrete examples.

These are design references, not evidence that the redesign has a proven conversion uplift. Original layout, assets and copy were implemented for Oranday.

## 21st.dev refinement

The user supplied https://21st.dev/ as the new component reference. Selected components were inspected on 2026-11-10.

- Lamp by Manu Arora: https://21st.dev/@manuarora700/components/lamp . Visual reference for the original silver halo and entry light in `refinements.css`. Its account-gated implementation was not copied.
- Spotlight by Julien Thibeaut: https://21st.dev/@ibelick/components/spotlight/border-only . Visual reference for the original pointer-driven silver card border in `refinements.css` and `refinements.js`. A keyboard focus treatment is equivalent; coarse pointers and reduced-motion skip tracking. No gated component source was retrieved.
- Animated Features Bento by Kedhareswer Naidu: https://21st.dev/@kedhareswer/components/ink-orbit-features . Layout reference for an original featured automation diagram and two secondary service cards. No source was copied.
- Animated Beam by Dillion Verma / Magic UI: https://21st.dev/@dillionverma/components/animated-beam . The public upstream measured-element SVG geometry is adapted in `beams.js`/`beams.css`. Full MIT attribution is in `THIRD_PARTY_NOTICES.md`. Beams share the demo state, pause and reduced-motion behavior.

These are HTML/CSS/JS adaptations for the existing static site. They do not introduce a React build, new runtime dependencies or an external component service.


## Approved identity — 12 November 2026

The user selected concept 02: a restrained sans wordmark with a two-arch symbol and the lowercase descriptor `studio ai`. Version 04 of the brand manual documents this direction. Use the existing SVG asset routes with updated vector artwork; the 288 × 96 lockup and 80 × 80 symbol preserve current consumers.

- Principal: cool-white artwork on black or graphite. Alternate: black artwork on white.
- Keep the symbol, name and descriptor proportions; use the symbol alone in small square spaces.
- Clear space: at least twice the symbol stroke width around the visible artwork, including the descriptor.
- Minimum complete lockup: 144 px / 35 mm; compact icon: 16 px / 6 mm. Always inspect the final rendered size.
- Inter remains the communication typeface. The logo is an outlined asset and must not be recreated as live text.
