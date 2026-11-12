# Decision Log / Anti-Pattern Register

| ID | Decision | Why | Trade-off / Risk |
|---|---|---|---|
| D-001 | Vanilla HTML/CSS/JS without framework | Simple GitHub Pages deployment; low maintenance | Larger apps may need a framework later |
| D-002 | CSS separated by tokens, reset, layout, components, sections, responsive | Easy redesign without rewriting content | Order matters; CSS specificity requires review |
| D-003 | Content isolated in `content.js` | Service and pricing data can be edited in one place | Not an admin dashboard / CMS |
| D-004 | Desktop Figma 1440 frame used as reference | Clear visual baseline | No verified mobile original; mobile is interpreted |
| D-005 | Avoid absolute pixels for entire page | Content can grow without overlap | May differ from Figma at fixed screenshot size |
| D-006 | Use local photo files instead of ephemeral Figma/external URLs | Offline reliability and editable named assets | AI-generated crops do not match original Figma photographs |
| D-007 | Mailto form with explicit disclosure | Prevent false lead-delivery promises | Users need email app; no server storage |
| D-008 | Yearly pricing marked as illustrative | Makes UI interaction demoable | Must replace with validated business prices |
| D-009 | Preserve 11 section structure first | Easy one-by-one comparison | Source copy includes demo placeholders |

| D-010 | Bundle 18 local WebP slots + Image Manager | User can replace files without code changes | Browser cannot overwrite local files itself; manual replace is required |
| D-011 | Keep AI photo master as PNG | Allow future retouch/crop by user | Raster master has no editable PSD/AI layers; subjects reused across crops |

## Anti-patterns to avoid

| Risk | Prevention |
|---|---|
| Fullpage screenshot used as website background | Build semantic DOM and responsive CSS, not rasterized screenshot |
| Images hotlinked to short-lived Figma URLs | Export appropriately licensed assets and serve locally |
| Generic template without service visual hierarchy | Keep hero > service > proof > price > conversion flow |
| Static-only CTAs with no destinations | Every CTA goes to section or functional mailto |
| Fake production-ready form | Show demo mailto behavior clearly, backend is not included |
| Unverified ratings and names presented as real evidence | Replace before launching; demo data is marked in docs |
| Nested CSS overrides accumulated across edits | Use CSS tokens/components, consolidate during refactor |
| Layout locked with fixed heights on mobile | Grid/flex + responsive breakpoints, content-driven height |
| Cross-domain photo URLs treated as owned content | Verify licenses and localize image assets |

## Printing / Design & Production adaptation (future, not included)

If adopting this design language for a real printing business, replace the generic services flow with: Hero (Design + Production), Product categories, Production capability, Real-work portfolio, Specification cards, File-upload quotation, Proof/approval workflow, Pricing factors, Case studies, FAQs, Contact/lead capture. Don't simply change "Cleaning" to "Printing" without revisiting the customer journey and production constraints.
