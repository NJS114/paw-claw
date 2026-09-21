# Aperçus de combat des neuf autres familles

Ouvrir `/assets/animations/groups/index.html` depuis la Bibliothèque visuelle.

Cette première série contient **27 personnages, 9 atlas et 432 poses** : trois représentants par famille, huit poses de face et huit de dos par personnage. Les illustrations de référence sont celles des cartes existantes. Les noms artistiques ne sont pas associés arbitrairement aux identifiants des cartes du catalogue, qui ne correspondent pas tous aux planches.

Les familles sont Magiciens, Armée, Nobles, Ombres, Robots, Nature, Éléments, Guérisseurs et Créatures. Les poses distinguent attente, deux pas de marche, anticipation, attaque, récupération, charge et libération spéciale. Apparition et disparition utilisent la transparence ; les dégâts et le stun utilisent les poses existantes et un retour visuel. Il ne s'agit pas encore d'un pack complet pour toutes les cartes et toutes les actions.

Le moteur de démonstration déplace les unités vers leurs cibles, annule l'attaque si la cible s'éloigne avant le tir, applique les dégâts à l'impact et empêche les actions pendant le stun. Les projectiles déjà lancés terminent leur trajet. Les deux premières unités présentent une attaque spéciale ; leurs raretés d'origine sont conservées. Les ultimes offensifs atteignent l'ennemi ; les soins atteignent les alliés. Les boosts ne touchent que les autres alliés vivants et expirent après quatre secondes. Accélération, bouclier, régénération et esquive sont réellement calculés.

Chaque camp dispose de sa propre condition de trois unités vivantes pour la synergie de famille. Les contrôles 2/3, 3/2 et 2/2 permettent de vérifier les seuils. La direction des effets s'adapte au camp. Les Guérisseurs restaurent les PV de leur équipe. Les autres groupes frappent l'équipe adverse.

Les intitulés, effets de synergie et chiffres sont des **propositions de démonstration**, pas un changement des règles ou de l'équilibrage du jeu. Le calendrier de 24 secondes permet d'inspecter les effets successivement. Le moteur à tours de l'application n'est pas remplacé.

Les dessins ont été générés par l'outil intégré d'images à partir des planches de cartes correspondantes : grille 8 × 6, trois personnages, deux orientations, huit poses dessinées, fond transparent, projectiles offensifs séparés. Les fichiers WebP sont optimisés avec compression avec perte et transparence. Les blocs de 384 Ko maximum sont réassemblés par `npm run assets:groups`, également appelé pendant la compilation.

Vérifier avec `npm run test:groups`. Le lecteur autonome exporté incorpore toutes ses ressources et fonctionne sans serveur. Le lecteur du dépôt les charge à la demande et suspend la simulation en arrière-plan ; la préférence de mouvement réduit démarre la lecture en pause.
