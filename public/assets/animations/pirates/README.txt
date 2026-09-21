PAW & CLAW — PIRATES V8

Extraire le ZIP puis ouvrir index.html. Ouvrir synergie.html pour la vague. Aucun serveur ni connexion nécessaires.
15 Pirates, face et dos. 800 poses de personnages + 32 images de VFX sur fond transparent.
Tous : attente, marche, attaque, dégâts, apparition, disparition. Sphynx : esquive tous les trois coups.
Grosses attaques : Rares, Épiques ET Légendaires. Sphynx : Baleine spectrale. Amiral Bouvier : Ancre des abysses. Les nouveaux ultimes ont huit dessins par orientation.

SYNERGIE : disponible à partir de 3 Pirates alliés vivants sur le plateau. Dans la démo, le troisième apparaît puis le lancement est automatique. Bouton 2 Pirates pour vérifier le seuil. Chaque ennemi dans le couloir reçoit un seul impact par vague. L'étourdissement bloque ses actions jusqu'à expiration.
Valeurs de démonstration réglables dans synergy-model.cjs : 30 dégâts, 2 secondes d'étourdissement. Le rythme de déclenchement reste à raccorder au moteur. La démo lance une vague par boucle ; elle ne définit pas la règle de cooldown du jeu.

Le décor reste fixe. Les poses et effets changent image par image. La vague est un VFX séparé qui se déplace sur le plateau. Les anciens sprites et les animations de base sont conservés. Première passe artistique, accessoires et proportions à harmoniser avant production. Aperçu autonome, non intégré au moteur du jeu.

CORRECTION : la synergie de 3 Pirates utilise le bateau pirate rouge porté par une vague agitée. La baleine appartient uniquement à l’ultime légendaire du Sphynx.

COMBAT V5 : déplacement réel vers la cible avec les poses walk. Arrêt à portée (112 pixels dans cet aperçu), attaque normale à portée uniquement. Si la cible s’éloigne, attaque annulée et poursuite. Stun : aucune marche ni attaque ; contrôle de la portée à la reprise. Attaques normales : 3 dégâts, intervalle 1,3 seconde (valeurs de démo). Le lecteur en mode Duel utilise aussi ce comportement ; choisir une action passe à la vue Face pour inspecter les poses.

ULTIMES ET BOOST V6 : le Sphynx invoque sa baleine après 4 secondes et l’Amiral son ancre après 8,5 secondes, une fois à portée et sans stun. Ce calendrier sert uniquement à présenter les animations. Huit poses, durée deux secondes, 14 dégâts de zone dans cet aperçu. À l’impact, les autres Pirates vivants de la même équipe gagnent +40 % de vitesse d’attaque pendant quatre secondes : pulsation depuis le lanceur, aura et compteur sur chaque bénéficiaire. Le bonus expire réellement et ne touche ni le lanceur ni les ennemis. Bateau à 12,5 secondes pour espacer la présentation des effets. Valeurs ajustables, non intégrées au moteur du jeu.

PLACEMENT V7 : gestes du lanceur et effets offensifs séparés. Baleine : trajet depuis le Sphynx vers sa cible, puis impact à 0,6 seconde. Ancre : chute centrée sur l’adversaire, impact à 0,6 seconde. Les dégâts sont appliqués à l’impact. Les auras de boost restent sur les Pirates alliés. Les anciens dessins composites restent des sources artistiques ; les aperçus de combat ne les utilisent plus sur le lanceur.

DEUX CAMPS V8 : chaque équipe contrôle séparément son nombre de Pirates vivants. Avec trois Pirates, elle peut déclencher son bateau. Le camp adverse utilise huit nouvelles images de face, proue vers le bas à gauche, sur le trajet inverse. Aucun dégât sur les alliés ; chaque cible adverse reçoit un seul impact et le stun. Dans la démo de 22 secondes, le premier bateau part à 12,5 secondes et celui du camp adverse à 16 secondes pour les montrer séparément. Deux sélecteurs permettent de tester 3 contre 3, 2 contre 3, 3 contre 2 ou 2 contre 2. Les ultimes et boosts précédents restent présents.
