# Manual QA — acceptance test sheet

Testing guide for owner/developer. The following checkboxes are NOT verified test outcomes.

## Desktop / Tablet / Mobile

- [ ] 1440 × 900: Hero headline does not overlap the team photo
- [ ] 1440 × 900: Container ~1170px centered, navigation fully visible
- [ ] 1280 × 800: Cards and quote images have no horizontal overflow
- [ ] 768 × 1024: Hamburger opens/closes; sections stack correctly
- [ ] 390 × 844: No horizontal overflow; buttons are tappable
- [ ] 360 × 800: Form inputs fully visible; phone does not clip

## Functionality

- [ ] All navigation links scroll to correct sections
- [ ] Mobile nav closes on link click / Escape
- [ ] Services next arrow changes visible service order
- [ ] Monthly/Yearly pricing buttons update pricing and aria state
- [ ] Yearly disclaimer visible when Yearly is chosen
- [ ] Testimonials prev/next rotate cards
- [ ] Empty contact form shows validation and does NOT claim submission
- [ ] Valid form opens local email app; user must send manually
- [ ] Image failures display placeholder.svg rather than broken image

## Content and launch readiness

- [ ] No lorem ipsum / unverified customer testimonials
- [ ] All images locally hosted, correctly licensed, and optimized
- [ ] Email/phone/address set to owned channels
- [ ] All sample pricing replaced and approved
- [ ] Replace blog `Read More` placeholder targets with real articles
- [ ] Confirm service/booking promises are factually accurate
- [ ] Lighthouse and screen reader checks completed

## v2.0 image QA

- [ ] Open `assets/images/asset-contact-sheet.jpg` to confirm 18 local slots
- [ ] Open `tools/image-manager.html`, pick every category, verify preview appears
- [ ] Upload a new JPG and export as WebP; replace sample file and refresh website
- [ ] Test Hero Desktop and Mobile each have their correct image
- [ ] Test service/team/about/quote/review/blog images when network is OFF
- [ ] Confirm no remote stock imagery URL is needed
- [ ] Remember images are demonstration crops, **not original Figma photos**
