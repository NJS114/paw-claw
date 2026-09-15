# Lobby V3 — source artistique et assets individuels

Cette révision répond au refus visuel du Lobby V2 par l'utilisateur. Référence
principale : l'image jointe `0980e1d9-143b-4614-8a6f-ab434ff79bf8.png`, cité dorée
avec héros et interface fantasy. Les autres planches fournies guident le portrait.
Ce document ne constitue pas une validation du rendu responsive.

## Fichiers livrés

| Consommateur | Fichier permanent | Traitement |
| --- | --- | --- |
| `world.lobby-day` | `public/assets/backgrounds/bg-lobby-royal-v3.webp` | Décor reconstruit sans UI ni personnages |
| `lobby.hero-cat` et avatar du Lobby | `public/assets/characters/lobby-cat-v3.webp` | Chat régénéré depuis le sprite du ZIP, alpha conservé |
| `lobby.hero-dog` | `public/assets/characters/lobby-dog-v3.webp` | Chien régénéré depuis le sprite du ZIP, alpha conservé |
| `lobby.logo` | `public/assets/ui/paw-claw-logo-v3.webp` | Logo isolé depuis la référence, alpha conservé |

Génération : outil imagegen intégré. Encodage : Sharp WebP qualité 90,
alphaQuality 100, sans redimensionnement ni recadrage. Les sources précédentes
restent disponibles. Les sprites régénérés peuvent présenter de légères différences
de dessin ; ils ne sont pas des extractions pixel pour pixel de la référence.
Le texte du logo est fixe ; tous les boutons, valeurs, libellés et barres de
progression du Lobby restent des éléments HTML. Les icônes de navigation sont
des SVG sémantiques dans `LobbyIcon.tsx`.

## Prompts de production

### Décor

Use case: precise-object-edit. Asset type: production background layer for Paw & Claw landscape game lobby, wide 16:9, high resolution. Edit the supplied reference: reconstruct ONLY the richly illustrated city background behind the interface and behind the two large foreground animal characters. Preserve the reference's exact warm golden afternoon lighting, elaborate storybook medieval castle town, soaring towers, bridges, left-hand timber building with navy and gold banners, airships, climbing flowers, warm foreground stonework, depth and painterly details. Remove ALL interface: profile, portrait, currency, labels, logo, text, buttons, panels, icons. Remove the two foreground cat and dog heroes completely; they will be separate interactive-independent art layers in the app. Reconstruct architecture naturally in removed regions. Foreground center should have broad warm stone steps/terrace for separate heroes to stand on, not a huge empty flat courtyard. Keep the rich dramatic densely layered city composition and near foreground, avoid simplified pastel village. No words anywhere, no UI frames, no borders, no large foreground characters, no watermark. One single complete landscape artwork, not a contact sheet.

### Chat

Use case: background-extraction / identity-preserve. Production single character sprite for Paw & Claw. Restore this exact white royal kitten mage as a clean high resolution RGBA transparent cutout. Preserve identity, seated pose, blue eyes, facial expression, crown with blue gem, navy and gold cloak, steampunk gold armor, blue orb staff, tail and all limbs exactly. Repair ONLY jagged edges and red/yellow/gray fringing left by poor cutout. Keep detailed warm painterly fantasy rendering. Full body fully visible and small transparent margin around staff ears tail feet. Genuine transparent background, alpha channel, no scene, no ground plane, no added glow, no labels, no text, no extra characters. The output is one standalone kitten sprite.

### Chien

Use case: identity-preserve / background-extraction. Single production game sprite. Recreate this exact cute brown-and-white spaniel knight, preserving face, proportions, pose, warm gold armor, dark navy outfit, red gold-trimmed cape, sword angled down to left, whole feet, head and cape. Restore image at high resolution with clean antialiased alpha edges. Remove all red/yellow contamination along cutout edges. Transparent background, no matte color, no opaque background, no floor, no shadow around silhouette, no scene. Give 4 percent transparent padding on all sides; no element touching the canvas edge. Full body standalone sprite. Match the painterly storybook gold-and-navy fantasy reference precisely. No text, no UI, no extra characters.

### Logo

Use case: background-extraction. Produce ONE isolated logo game asset from the central PAW & CLAW logo in the supplied reference. Keep the reference's polished embossed gold fantasy serif lettering, the dark navy/brown ornamental backing plaque and its gold trim, the gold crown above with a paw emblem. Exact text: PAW & CLAW. No other text, NO subtitle, NO tagline. Clean standalone centered logo on GENUINELY TRANSPARENT alpha background. Landscape composition 2:1, tight composition but 6% transparent margin all around, entire crown visible. Reference image is solely the visual source for the logo, do not include its interface, city, characters, or buttons. Preserve the warm gold dimensional lettering and dark plaque contrast. Sharp readable lettering at small mobile game size, premium fantasy game emblem. One asset, not a sheet.

## Vérifications et limites

- Les quatre fichiers ont été inspectés ; dimensions, présence et alpha sont
  contrôlés après encodage. Ils sont référencés par des consommateurs du Lobby.
- 34 tests passent, dont un test de progression réelle de la quête, de son seuil
  de récupération et de son état déjà récupéré. Les destinations existantes sont
  conservées. Aucune économie ni mécanique de combat n'est changée.
- L'audit Lobby et la compilation ne valent pas contrôle de layout. Les autres
  manques du catalogue restent suivis dans `ASSET_DELIVERY.md`.
- Pas de capture navigateur V3 ni d'accord visuel utilisateur à ce stade.
  La PR reste en brouillon. Contrôler les tailles de la matrice avant fusion.
