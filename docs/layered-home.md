# Layered illustrated home

The approved September 23 Paw & Claw mockup guides this home screen and pirate-family preview. The village, two home heroes, two pirate heroes and foreground foliage are separate WebP images with alpha where needed; controls and text remain native HTML.

- `MobileLobby.tsx` owns the home navigation. Other screens retain `GameNavigation`.
- Mouse parallax moves background, heroes and foliage at different speeds. Touch stays stable. The pause button and system reduced-motion preference disable movement.
- The native pirate dialog supports Escape, focus containment, backdrop dismissal and focus restoration. Its buttons route to the existing deck and collection; it does not promise an unimplemented timed event or rewards.
- Currency, booster count and mission progress use the existing saved game data.
- Existing card art, booster purchase/opening and battle logic are unchanged.

Assets were generated with the built-in image tool from the user-approved mockup: a clean village background without UI or heroes, then a transparent sheet containing cat, dog, pirate variants and foliage. Individual sprites were cropped and compressed to WebP. The source mockup is a visual reference, not a flattened interactive screen.

Validation: asset validation, unit tests, functional tests, TypeScript and production build. Browser screenshot verification was unavailable in this session because the browser could not access the local preview. Review the layout on physical devices before release.
