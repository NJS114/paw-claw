# Animations Pirates validées

Le pack de 15 Pirates est accessible depuis la Bibliothèque visuelle :

- `/assets/animations/pirates/index.html` : personnages de face et de dos, actions individuelles et duel à portée.
- `/assets/animations/pirates/synergie.html` : combat avec ultimes, boosts et bateaux des deux équipes.

800 poses et 32 images d'effets : baleine du Sphynx, ancre de l'Amiral, bateau rouge et bateau adverse dessiné dans le sens inverse. Les personnages marchent vers leur cible et attaquent uniquement à portée. Le stun bloque déplacement et attaque. Les effets offensifs rejoignent l'adversaire, les dégâts arrivent à l'impact et les boosts bénéficient aux autres Pirates vivants de la même équipe. Chaque camp contrôle indépendamment son seuil de trois Pirates.

Les atlas WebP optimisés pour le jeu (poses de 192 px, effets de 384 px, transparence conservée) sont suivis dans `assets/pirates/`, découpés en parties de 384 000 octets maximum réassemblées par `npm run assets:pirates`. Le démarrage et la compilation reconstruisent les 833 PNG (800 poses, 32 effets et décor). `npm run test:pirates` vérifie les fichiers, les scripts des lecteurs, les déplacements, la portée, le stun, les boosts et les seuils indépendants 3/3, 2/3, 3/2 et 2/2.

Il s'agit du pack artistique et de la simulation validés, accessibles dans l'application. Le moteur à tours existant n'est pas remplacé. Les identifiants artistiques ne sont pas arbitrairement associés aux anciennes cartes. Les dégâts, délais et bonus de la démonstration ne constituent pas les décisions d'équilibrage du jeu.
