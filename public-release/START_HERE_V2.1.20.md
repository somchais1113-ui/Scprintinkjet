# SCWORK Inkjet Sticker V2.1.20 — Visual Refinement

This is an incremental patch over V2.1.19. **Retain the existing design, pictures and functionality.**

## Changes

1. **Homepage cinematic banner**: each image gently scales up (1.00 → 1.075 over 9s); at the existing 7.4s interval this yields around 6% zoom. It is a background-image effect only; text, buttons and navigation remain fixed. The old image retains its animation through the 880ms crossfade; motion stops for visitors who request reduced motion.
2. **Orange CTA buttons**: orange #FF6900 unchanged, text white #FFFFFF across all public pages, including the responsive mobile bottom bars, banner CTA and support bar. Secondary, inactive, disabled or outlined actions are not converted into orange CTAs.

## Delivery

- Master: `SCWORK_Inkjet_Sticker_V2.1.20_Full_Package.zip` (includes private tools, QA, source assets).
- Deploy: `SCWORK_Inkjet_Sticker_V2.1.20_Public_Website.zip` (only public storefront files).
- To rebuild: `npm run build:public -- /path/to/new-output-folder`.
- Regression check: `npm run check:v2120` and existing `check:v2119`, `check:v2118`, `check:pricing`, `check:locales`.

## Note on contrast

White #FFFFFF on the orange #FF6900 CTA creates approx. 2.89:1 contrast, and does not satisfy WCAG AA for ordinary-sized text. This is the requested design direction; adjust to a darker orange only with approval if strict accessibility compliance is required.
