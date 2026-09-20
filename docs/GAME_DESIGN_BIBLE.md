# Paw & Claw — Bible de direction artistique et de game design

Version produit : 1.0 — document de référence pour la DA, l’UX, le combat, le contenu, la progression et la monétisation.

## 1. Vision du jeu

**Promesse en une phrase :** construire une collection de héros chats ou chiens, composer une équipe par familles et rôles, puis voir ses choix créer des combinaisons visibles directement dans une arène courte et lisible.

Paw & Claw doit se distinguer des jeux de cartes issus de mangas par trois éléments :

1. un univers original de royaume animal, immédiatement compréhensible ;
2. des cartes qui deviennent des unités et des constructions dans l’arène ;
3. des combinaisons de composition proches d’un jeu tactique : famille, rôle, position et histoire comptent ensemble.

### Piliers non négociables

- **Kawaii tactique, pas enfantin :** personnages attachants, mais décisions réelles.
- **Minimalisme fonctionnel :** une action principale et une information dominante par écran.
- **Collection utile :** une carte sert à jouer, créer une composition, progresser et découvrir une histoire.
- **Spectacle bref :** les grands effets durent de 0,5 à 1,2 seconde, puis rendent immédiatement le contrôle.
- **Compétitif équitable :** le paiement accélère la collection et personnalise, mais ne vend pas une puissance exclusive.
- **Chats contre chiens, sans camp moral :** chaque espèce possède des héros et des antagonistes ; le conflit vient des idéaux, pas de la nature de l’animal.

### Format de partie cible

- Deck de 20 héros d’une seule espèce : Chat ou Chien.
- 7 lignes de combat.
- 20 PV de héros.
- Main maximale de 5 cartes.
- Énergie renouvelée au début du tour.
- Durée visée : 4 à 7 minutes.
- Victoire : héros adverse à 0 PV ; égalité forcée au tour 40.

## 2. État du produit et cible de contenu

Le prototype possède déjà l’accueil, la collection, les decks, la boutique, les boosters et une arène jouable. Le catalogue courant contient moins que la cible éditoriale et les familles Armée et Pirates ne disposent pas encore de leur série jouable complète.

### Catalogue cible

Chaque famille doit contenir exactement **20 héros** : 10 Chats et 10 Chiens. Pour chaque espèce d’une famille :

| Rareté | Quantité par espèce | Quantité par famille | Fonction dominante |
|---|---:|---:|---|
| Commune | 4 | 8 | règle simple, base de composition |
| Rare | 3 | 6 | interaction de rôle ou de ligne |
| Épique | 2 | 4 | pièce de moteur ou retournement limité |
| Légendaire | 1 | 2 | identité de deck, jamais obligatoire |
| **Total** | **10** | **20** | — |

Les 10 familles donnent donc **200 héros normaux**, auxquels s’ajoutent 10 Ultra Rares transversales. Une Ultra Rare est limitée à un exemplaire par deck et ne doit jamais être strictement meilleure qu’une Légendaire : elle doit ouvrir une stratégie différente.

## 3. Direction artistique minimaliste

### Style général

- Illustration 2D peinte, mélange gouache douce et crayon visible.
- Silhouettes compactes, grandes oreilles, grandes pattes et accessoires lisibles à 64 px.
- Trois valeurs par personnage : ombre, couleur locale, lumière. Pas de rendu 3D ni photoréalisme.
- Décors composés de trois plans maximum : avant-plan décoratif, zone de jeu, fond atmosphérique.
- Aucun emoji dans l’interface. Toutes les icônes appartiennent au même set au trait arrondi.
- Les visuels horrifiques noir et rouge sont réservés à la carte Ultra Rare **Error 404**.

### Palette système

| Usage | Couleur | Règle |
|---|---|---|
| Fond principal | bleu nuit `#10182b` | jamais noir pur sauf Error 404 |
| Surface | bleu ardoise `#202d46` | aplats opaques, très peu de flou |
| Texte principal | ivoire `#fff5dc` | contraste AA minimum |
| Texte secondaire | gris lavande `#b9bfd2` | informations non critiques |
| Action | or ancien `#d8ad55` | un seul bouton or principal par écran |
| Danger | corail `#d85d5d` | dégâts, suppression, défaite |
| Soin | menthe `#65c6a3` | soins et validation secondaire |
| Technologie | cyan `#50c7d9` | Robots et Pet Tank |
| Pirate | orange cuivre `#ce7d42` | Pirates, butin, sabotage |

### Raretés

- Commune : bronze sombre, finition mate.
- Rare : bleu royal, halo intérieur discret.
- Épique : violet, liseré animé uniquement sur l’inspection.
- Légendaire : or antique, brillance locale lente sur les bords.
- Ultra Rare : traitement propre à la carte. Aucun arc-en-ciel générique et aucune étoile multicolore.

### Typographie et grille

- Titres : serif ronde ou display royale, deux graisses maximum.
- Interface et chiffres : sans-serif très lisible.
- Base d’espacement : 8 px ; marges 16 px mobile, 24 px tablette.
- Rayon : 12 px pour les cartes d’interface, 18 px pour les panneaux majeurs.
- Zone tactile minimale : 44 × 44 px.
- Une page n’utilise jamais plus de trois tailles de texte ni plus de deux CTA visibles simultanément.

### Mouvement

- Micro-interaction : 120 à 180 ms.
- Changement de panneau : 220 à 300 ms.
- Combo tactique : 700 à 1 200 ms.
- Ouverture de booster : contrôlée par le joueur, carte par carte.
- Toutes les animations respectent `prefers-reduced-motion` et deviennent alors des fondus courts.

## 4. Architecture des écrans

Les menus sont conçus en portrait. L’arène reste responsive et peut exploiter le paysage sur téléphone large ; aucun écran ne doit exiger une rotation forcée. La navigation permanente contient cinq destinations : Accueil, Collection, Combat, Decks, Boutique.

### 4.1 Démarrage

**But :** charger les données et rappeler l’identité.

- Centre : blason Paw & Claw et une patte lumineuse.
- Bas : progression de chargement textuelle, jamais un faux pourcentage.
- Une seule illustration, aucun bouton sauf si une erreur demande « Réessayer ».
- Premier lancement : consentement, langue, son et choix Chat/Chien en trois étapes séparées.

### 4.2 Accueil — Le camp du Gardien

**Hiérarchie :** héros favori, bouton Jouer, progression du jour.

- Haut : profil, niveau et portefeuille compact.
- Centre : héros favori vivant dans le camp ; un tap ouvre sa fiche.
- CTA principal : « Jouer ».
- Sous le CTA : une mission quotidienne et le prochain palier de passe.
- Bas : barre de navigation.
- Ne pas afficher simultanément boutique, événement, cadeau, missions et passe sous forme de pop-ups. Un seul ruban contextuel est autorisé.

### 4.3 Carte de l’histoire

**But :** donner du contexte et enseigner les familles.

- Carte verticale de 10 régions, une par famille.
- Chaque région contient 5 combats, 1 duel narratif et 1 défi de composition.
- Une région verrouillée montre son nom et sa silhouette, pas cinq cadenas.
- Le chapitre sélectionné affiche résumé, récompense et équipe adverse avant « Commencer ».

### 4.4 Collection

**But :** trouver une carte en moins de trois actions.

- Barre de recherche persistante.
- Filtres en tiroir : espèce, famille, rareté, rôle, possédée/non possédée.
- Grille de deux cartes en portrait ; la rareté reste visible sans ouvrir la fiche.
- Une carte non possédée garde sa silhouette et son texte de règle afin que le joueur puisse planifier.
- Progression en haut : `possédées / 210`, avec détail par famille à la demande.

### 4.5 Fiche de personnage

**But :** relier collection, tactique, maîtrise et histoire.

- Face avant : illustration, coût, ATQ, PV, famille, rôle et rareté.
- Onglet Compétences : passif, technique signature et combo conseillé.
- Onglet Maîtrise : niveaux 1/3/5/7/10 et récompenses.
- Onglet Histoire : 60 à 120 mots, deux liens de relation maximum.
- CTA : « Ajouter au deck » ou « Voir le deck » ; « Faire évoluer » n’apparaît que si disponible.

### 4.6 Atelier des decks

**But :** construire vite et comprendre les conséquences.

- Haut : nom, espèce et `x/20`.
- Milieu : cartes du deck, regroupables par coût ou famille.
- Bas : catalogue filtré.
- Panneau Analyse : courbe de coût, nombre de rôles et combos presque actifs.
- Exemple de conseil : « Pet Tank : 2/3 Défense Robot, 1/1 Attaque Robot ».
- Blocage explicite : une carte non possédée ou d’une autre espèce explique pourquoi elle ne peut pas entrer.

### 4.7 Précombat

- Choix du mode : Histoire, Duel IA, Classé, Défi.
- Aperçu du deck, difficulté et récompenses exactes.
- En classé : rang et temps d’attente ; aucun taux de victoire adverse caché ou intimidant.
- CTA unique « Entrer dans l’arène ».

### 4.8 Arène

**Ordre visuel :** PV héros, plateau, main, énergie, fin de tour.

- 7 lignes clairement séparées.
- Les constructions occupent un dock hors des lignes ; elles ne masquent jamais les unités.
- Un tap sur une carte montre sa portée et les lignes valides.
- Le journal garde les trois derniers événements ; l’historique complet est dans un tiroir.
- Les synergies actives sont des badges courts. Les détails apparaissent au maintien.
- Chaque combo affiche condition, résultat et cible avant validation si une décision est requise.

### 4.9 Résultat

- Une phrase : victoire, défaite ou égalité.
- Récompenses exactes, progression de maîtrise et une leçon tactique.
- CTA principal « Rejouer » ; secondaires « Modifier le deck » et « Accueil ».
- Après une défaite, aucune offre payante immédiate. Une suggestion de deck gratuite peut apparaître.

### 4.10 Salle des boosters

- Le joueur déchire visuellement le haut du paquet.
- Les 12 cartes sont empilées, puis retournées une par une au tap.
- Résumé final : nouvelles cartes, doublons transformés en Essence et progression de famille.
- Les probabilités sont accessibles avant tout achat depuis « Chances ».
- Pas de bouton d’achat pendant la révélation : le spectacle reste séparé de la vente.

### 4.11 Boutique

- Trois sections maximum : Sélection, Cosmétiques, Gemmes.
- Chaque offre indique contenu, prix, durée réelle et quantité déjà possédée.
- Le booster à monnaie gratuite reste visible à côté de l’offre premium.
- Aucun prix barré sans historique réel ; aucun faux compteur ; aucune fenêtre surgissante au lancement.

### 4.12 Missions et passe

- Trois missions quotidiennes et trois hebdomadaires maximum.
- Au moins deux missions quotidiennes sont réalisables sans gagner.
- Piste gratuite et piste premium alignées, avec aperçu de toutes les récompenses.
- Le pass ne contient aucun héros exclusif compétitivement supérieur.

### 4.13 Profil et maîtrise

- Résumé : parties, victoires, collection, pièces, gemmes et Essence.
- Galerie de titres et cadres cosmétiques.
- Historique des 10 dernières parties avec deck utilisé.
- Pas de ratio agressif mis en avant aux nouveaux joueurs.

### 4.14 Paramètres et accessibilité

- Sons, musique, vibration, qualité, langue et notifications.
- Réduction des mouvements, taille de texte, contraste renforcé et mode daltonisme.
- Probabilités des objets aléatoires, confidentialité, restauration des achats et suppression du compte.

## 5. Monde et histoire

### Prémisse

Le Royaume des Mille Pattes était gouverné par la **Couronne d’Accord**, une relique qui transformait les différences en force commune. Lorsque la Couronne s’est brisée, ses dix éclats ont choisi dix régions et amplifié leurs idéaux. Chats et Chiens accusent chacun l’autre camp d’avoir provoqué la Fracture.

Le joueur est le **Gardien des Liens**, capable de voir les résonances entre les héros. Son objectif n’est pas de conquérir un peuple, mais de reconstituer la vérité en formant des équipes que les deux camps croyaient impossibles.

### Actes narratifs

1. **La Fracture :** découverte du conflit, Nature et Armée servent de tutoriel.
2. **Les Dix Serments :** chaque famille révèle sa version des événements.
3. **La Guerre des Reflets :** les Ombres manipulent des preuves ; les Pirates transportent un éclat volé.
4. **Le Cœur mécanique :** les Robots prouvent qu’un éclat peut créer une vie autonome, le Pet Tank.
5. **Le Royaume sans nom :** Error 404 efface des fragments de mémoire et devient la menace transversale.
6. **L’Accord nouveau :** le joueur choisit une alliance de valeurs ; Chats et Chiens restent rivaux mais ne sont plus ennemis absolus.

### Les dix régions

| Famille | Région | Idéal | Conflit | Signature visuelle |
|---|---|---|---|---|
| Armée | Remparts de Bravoure | devoir | obéir ou protéger | bordeaux, acier, fanions |
| Magiciens | Archives d’Aster | connaissance | révéler ou cacher | indigo, craie, constellations |
| Nobles | Cité de la Couronne | unité | héritage ou mérite | or, ivoire, velours bleu |
| Ombres | Toits de Minuit | liberté | secret ou vérité | bleu nuit, mauve, lanternes |
| Robots | Atelier Zéro | progrès | calcul ou émotion | cyan, cuivre, formes carrées |
| Nature | Bois des Racines | équilibre | croissance ou contrôle | vert mousse, fleurs plates |
| Éléments | Archipel des Quatre Souffles | transformation | puissance ou mesure | quatre aplats élémentaires |
| Guérisseurs | Sanctuaire d’Émeraude | soin | sauver ou laisser choisir | menthe, ivoire, halos ronds |
| Pirates | Mer des Fanions | liberté | partage ou pillage | cuivre, turquoise, voiles |
| Créatures | Vallée des Formes | instinct | identité ou mutation | violet, rose, silhouettes hybrides |

## 6. Système de combat et de combinaisons

### Couches de décision

1. **Espèce :** définit le deck et certains liens narratifs.
2. **Famille :** donne un bonus à 3 unités et une version renforcée à 5.
3. **Rôle :** Attaque, Défense, Soutien ou Contrôle.
4. **Position :** choix de la ligne et des voisins.
5. **Recette :** combinaison précise créant une construction ou une cinématique.

### Identité mécanique des familles

| Famille | À 3 unités | À 5 unités | Faiblesse prévue |
|---|---|---|---|
| Armée | armure de ligne | formation renforcée | peu de dégâts explosifs |
| Magiciens | énergie flexible | première carte moins chère | fragile sans préparation |
| Nobles | +1 PV à l’équipe | bouclier du héros | lent à installer |
| Ombres | bonus sur cible blessée | exécution limitée | faible endurance |
| Robots | bonus au 3e déploiement | réseau +1/+1 | dépend des rôles précis |
| Nature | soin des unités | soin du héros | sensible au burst |
| Éléments | réaction +1 dégât | réaction multi-ligne | coûteux en énergie |
| Guérisseurs | soin de fin de tour | un sauvetage à 1 PV | pression offensive réduite |
| Pirates | énergie après élimination | pioche de butin | irrégulier sans cible |
| Créatures | +1 PV aux Créatures | rage à mi-vie | nécessite d’accepter des dégâts |

### Recette Robot — Pet Tank

**Condition :** contrôler au moins 4 Robots, dont au moins 3 de rôle Défense et 1 de rôle Attaque.

**Résultat :** le Pet Tank apparaît dans le dock de construction avec 6 PV. À chaque fin de tour, il tire avec une puissance de 2 sur le héros adverse ; le Bouclier peut absorber ce tir. La recette ne s’active qu’une fois par combat.

**Lecture visuelle :** quatre câbles relient brièvement les Robots, un plan de montage se dessine, puis le Pet Tank tombe en trois pièces qui s’emboîtent. Durée maximale : 900 ms.

**Contre-jeu :** éliminer un Robot avant le quatrième déploiement, saboter la construction avec les Pirates, ou conserver un Bouclier.

### Recette Pirate — Raid du navire

**Condition :** contrôler 4 Pirates.

**Résultat :** le bateau pirate envahit la zone adverse et inflige 3 dégâts à la construction ennemie ayant le plus de PV. Sans construction, il inflige 1 dégât direct au héros. Une activation par combat.

**Storyboard de l’animation :**

1. 0–150 ms : l’arène s’assombrit légèrement et une vague plate turquoise entre par le bord.
2. 150–550 ms : bateau 2D de profil, fanion orange, traverse la zone adverse.
3. 550–750 ms : un boulet en arc touche la construction ; flash ivoire et perte de PV.
4. 750–950 ms : bateau et vague sortent ; le journal annonce la cible et les dégâts.

L’animation ne déplace pas réellement les cartes et n’utilise ni fumée réaliste ni secousse longue.

### Autres recettes à développer

| Nom | Composition | Effet | Contre-jeu |
|---|---|---|---|
| Bastion royal | 3 Armée + 2 Nobles | construction 7 PV ; +1 Bouclier à la fin du tour | Raid pirate, dégâts directs |
| Tempête arcanique | 3 Magiciens + 2 Éléments | 2 dégâts répartis sur deux lignes | armure, soin |
| Jardin sanctuaire | 3 Nature + 2 Guérisseurs | construction 5 PV ; soigne l’allié le plus faible de 1 | sabotage, burst |
| Chasse nocturne | 3 Ombres + 2 Créatures | la cible adverse la plus faible perd 2 ATQ un tour | purification |
| Cour des inventions | 2 Nobles + 3 Robots | le prochain Robot coûte 1 de moins et gagne 1 PV | pression rapide |
| Pacte du large | 2 Pirates + 3 Éléments | premier dégât direct du tour crée 1 Butin | bouclier |
| Escorte sacrée | 3 Armée + 2 Guérisseurs | empêche une destruction puis retire le bonus | dégâts multiples |
| Mutation interdite | 3 Créatures + 2 Magiciens | échange ATQ/PV d’une unité alliée choisie | contrôle de passif |

### Constructions

- Elles ont PV, puissance et fréquence d’effet, mais aucune ATQ de mêlée.
- Elles occupent un dock de deux emplacements maximum par camp.
- Une construction à 0 PV est détruite avant son prochain déclenchement.
- Une seconde copie d’une même construction répare 2 PV au lieu de dupliquer l’effet.
- Les Pirates sont les principaux saboteurs ; Ombres et Éléments ont des réponses plus coûteuses.

## 7. Fiche de conception obligatoire pour chaque personnage

Chaque héros, actuel ou futur, doit posséder les champs suivants avant validation :

1. identité : nom, espèce, race éventuelle, famille, rareté, rôle ;
2. silhouette : trois signes lisibles sans couleur ;
3. fantasme de jeu en une phrase ;
4. coût, ATQ, PV et justification du budget de puissance ;
5. passif : nom, timing, cible, valeur, limite et contre-jeu ;
6. technique signature : mêmes informations ;
7. combo conseillé et familles compatibles ;
8. animation d’entrée, d’attaque et de victoire ;
9. histoire courte, désir, peur et relation avec deux héros ;
10. évolution aux niveaux 1, 3, 5, 7 et 10 ;
11. texte accessible expliquant l’effet sans jargon ;
12. tests : cas normal, cumul, cible absente, destruction simultanée et limite par tour.

Le fichier `src/data/characterDesign.ts` garantit déjà un passif, une technique, une animation et cinq paliers de maîtrise à tous les héros du catalogue. Un profil spécifique peut ensuite remplacer le modèle de famille pour les héros narratifs.

### Vingt personnages piliers

Ces personnages servent de référence pour construire les 180 autres héros normaux. Chaque duo montre les deux interprétations de la même famille.

| Famille | Personnage | Espèce / rôle | Passif détaillé | Technique signature | Histoire et animation |
|---|---|---|---|---|---|
| Armée | Capitaine Brava | Chienne / Défense | **Ligne tenue** : le premier dégât reçu chaque tour est réduit de 1 si une unité alliée est voisine. | **Ralliement** : donne +1 PV max aux deux voisins ; une fois par combat. | Elle a refusé un ordre mettant des civils en danger. Fanion planté, onde bordeaux. |
| Armée | Voltigeur Miro | Chat / Attaque | **Élan** : +1 ATQ si sa ligne était vide au début du tour. | **Percée** : après une élimination, inflige 1 dégât direct. | Messager accusé à tort d’avoir livré la Couronne. Traînée d’écu courte. |
| Magiciens | Sélène des Craies | Chatte / Contrôle | **Annotation** : le passif de la cible opposée est révélé puis suspendu un combat. | **Page blanche** : annule le prochain effet d’entrée sur sa ligne. | Archiviste qui a découvert une page effacée par Error 404. Cercle de craie en deux traits. |
| Magiciens | Orso Étincelle | Chien / Soutien | **Réserve** : rend 1 énergie si un Magicien est déjà présent, une fois par tour. | **Sort partagé** : copie à moitié le dernier bonus de famille. | Il enseigne la magie par le jeu plutôt que par les rangs. Glyphe jaune, petit claquement. |
| Nobles | Reine Alba | Chienne / Soutien | **Hospitalité** : la prochaine unité posée gagne +1 PV max. | **Audience** : soigne de 1 toutes les unités déjà blessées. | Elle cherche à remplacer la vieille Couronne par un pacte élu. Sceau or doux. |
| Nobles | Prince Sifflot | Chat / Contrôle | **Étiquette** : la cible opposée ne reçoit qu’un bonus ce tour. | **Décret bref** : retire 1 Bouclier et bloque sa régénération un tour. | Héritier charmant qui doute de sa légitimité. Parchemin déroulé en 300 ms. |
| Ombres | Lame Nyx | Chienne / Attaque | **Proie blessée** : +1 ATQ contre une cible sous ses PV max. | **Fin silencieuse** : détruit après combat une cible restée à 1 PV. | Elle vole des preuves pour les rendre au peuple. Deux silhouettes puis une entaille mauve. |
| Ombres | Tisse-Masque | Chat / Contrôle | **Voile** : la cible perd 1 ATQ pendant le premier combat. | **Identité volée** : copie le rôle adverse jusqu’à la fin du tour. | Ancien acteur devenu espion, il ignore quel masque était le sien. Masque plat qui se fend. |
| Robots | Rempart K-9 | Chien / Défense | **Partage de blindage** : transfère 1 dégât au Robot allié ayant le plus de PV. | **Plaque mobile** : donne 1 armure à sa ligne et à une ligne voisine ce tour. | Prototype construit pour garder un atelier vide. Plaques cyan qui se verrouillent. |
| Robots | Pixel Griffe | Chatte / Attaque | **Cible marquée** : +1 ATQ après l’arrivée d’un autre Robot. | **Tir calibré** : +1 dégât contre une cible ayant plus de PV. | Elle veut prouver qu’un calcul peut devenir un choix. Scan, recul de deux pixels. |
| Nature | Dalia Racine | Chienne / Soutien | **Rosée** : soigne de 1 l’allié voisin le plus blessé en fin de tour. | **Deux saisons** : distribue 2 soins entre les alliés. | Elle protège l’arbre où fut trouvé le premier éclat. Deux feuilles et une pousse. |
| Nature | Ronronce | Chat / Défense | **Écorce vivante** : le premier soin reçu vaut +1. | **Mue de bois** : absorbe les 2 prochains dégâts. | Petit gardien impatient dans une armure trop grande. Écorce en trois aplats. |
| Éléments | Braise Vive | Chatte / Attaque | **Surchauffe** : le premier dégât de synergie allié gagne +1. | **Réaction** : 2 dégâts, ou 3 avec cinq Éléments. | Elle pense que la Couronne doit être fondue, pas réparée. Flash corail de 120 ms. |
| Éléments | Noro des Marées | Chien / Contrôle | **Marée basse** : retire le Bouclier de la cible pendant le combat. | **Reflux** : repousse la cible vers une ligne libre ; sinon -1 ATQ. | Marin capable d’entendre l’éclat sous l’océan. Vague plate bleu clair. |
| Guérisseurs | Sœur Menta | Chatte / Soutien | **Veille** : soigne le héros de 1 si elle n’a pas subi de dégâts ce tour. | **Soin partagé** : 2 PV distribués aux deux alliés les plus faibles. | Elle soigne les deux camps anonymement. Anneau menthe ascendant. |
| Guérisseurs | Frère Pavois | Chien / Défense | **Seconde chance** : le premier allié soigné gagne +1 PV max ce tour. | **Garde vitale** : empêche le prochain dégât létal, une fois par combat. | Il a survécu à la Fracture et refuse de choisir un camp. Halo ivoire en forme d’écu. |
| Pirates | Capitaine Roussette | Chatte / Contrôle | **Sabotage** : la construction adverse la plus solide perd 1 PV à l’entrée. | **À l’abordage** : attaque puis inflige 1 dégât à une construction. | Elle a volé un éclat pour empêcher une guerre. Corde tendue et fanion cuivre. |
| Pirates | Bosco Marée | Chien / Soutien | **Part du butin** : la première élimination alliée rend 1 énergie. | **Carte au trésor** : pioche après une élimination ; une fois par tour. | Il tient les comptes d’un équipage qui partage tout. Parchemin, boussole, clin d’œil. |
| Créatures | Astra Kitsune | Chatte / Contrôle | **Effroi** : la cible opposée perd 1 ATQ ce tour à l’entrée. | **Neuf reflets** : annule le prochain bonus d’entrée adverse. | Sa mutation a commencé au contact de la Couronne. Ombre à neuf queues puis silhouette. |
| Créatures | Grom le Doux | Chien / Défense | **Instinct de garde** : à mi-vie, gagne 1 Bouclier personnel une fois. | **Mue** : perd 1 ATQ et gagne 2 PV max. | Titan redouté qui collectionne de minuscules graines. Grande ombre, petite fleur finale. |

### Budget de puissance

- Coût 1 : environ 3 points de statistiques, effet conditionnel léger.
- Coût 2 : 4 à 5 points, effet de ligne simple.
- Coût 3 : 6 à 7 points, moteur limité à une fois par tour.
- Coût 4 : 8 à 9 points, effet de composition.
- Coût 5+ : 10 à 12 points, effet spectaculaire avec contre-jeu.
- 1 ATQ ou 1 PV vaut environ 1 point ; pioche vaut 2,5 ; énergie vaut 2 ; dégât direct vaut 1,5 ; désactivation de passif un tour vaut 2.
- Toute boucle de pioche, soin, énergie ou réanimation possède une limite par tour.

## 8. Évolution des personnages

L’évolution est une **maîtrise**, pas une ascension pay-to-win. Les statistiques de base restent identiques en PvP classé.

| Niveau | Nom | Déblocage | Coût cible |
|---:|---|---|---|
| 1 | Recrue | passif et carte jouable | carte obtenue |
| 3 | Éveillé | entrée animée, histoire courte | 100 Essence + usage |
| 5 | Vétéran | technique signature en Histoire/Défis | 250 Essence + 500 pièces |
| 7 | Héros | réplique, pose de victoire, cadre de famille | 500 Essence + objectif personnel |
| 10 | Maîtrise | variante visuelle et titre | défi de maîtrise, pas d’achat direct |

### Gain de maîtrise

- Jouer la carte : 5 XP.
- Survivre à un combat : +3 XP.
- Déclencher son passif : +2 XP, maximum deux fois par partie.
- Participer à une recette : +10 XP.
- Terminer son défi narratif : +50 XP une fois.

Les objets d’XP vendus accélèrent uniquement l’accès aux cosmétiques et au contenu PvE. Ils ne donnent aucune statistique exclusive en classé.

## 9. Économie

### Les ressources

| Ressource | Origine | Utilisations | Règle d’équilibre |
|---|---|---|---|
| Pièces | matchs, missions, histoire | booster standard, évolution, reroll de mission limité | monnaie quotidienne ; environ 5 à 7 matchs par booster |
| Gemmes | achat, passe gratuit, événements rares | cosmétiques, pass, booster premium, confort | prix premium toujours affiché clairement |
| Essence | doublons au-delà de la limite, événements | fabriquer une carte ciblée, maîtrise | protège contre les doublons inutiles |
| XP de passe | jeu et missions | paliers saisonniers | non achetable directement sauf rattrapage plafonné |
| XP de maîtrise | utilisation d’un héros | évolution du héros | lié au jeu, pas aux boosters |

### Valeurs de départ du prototype

- Booster standard : 400 pièces.
- Victoire : 60 pièces + 60 XP.
- Égalité : 30 pièces + 35 XP.
- Défaite : 20 pièces + 25 XP.
- Pub récompensée optionnelle : 50 pièces, plafond journalier recommandé de 3.
- Conversion de doublons au-delà de la limite : Commune 10 Essence, Rare 25, Épique 60, Légendaire 150.
- Limite de copies conservées : 4 / 3 / 2 / 1 selon la rareté.

### Booster standard de 12 cartes

- 8 Communes.
- 3 Rares.
- Dernier emplacement : 85 % Épique, 15 % Légendaire.
- Une Ultra Rare peut remplacer le dernier emplacement à 1 %, avec limite d’un exemplaire par deck.
- Protection recommandée : une Légendaire garantie au plus tard au 10e booster sans Légendaire.
- Le détail des chances et le fonctionnement de la protection doivent être visibles avant l’achat.

## 10. Monétisation saine et efficace

Le bon objectif n’est pas de forcer un paiement après une frustration. Il faut présenter une valeur claire lorsque le joueur a déjà compris ce qu’il aime : collection, personnalisation ou progression saisonnière.

### Offres recommandées

| Offre | Moment pertinent | Contenu | Prix indicatif |
|---|---|---|---:|
| Pack de bienvenue | après 3 parties, une seule fois | 600 gemmes, 2 boosters, dos de carte | 2,99 € |
| Passe saisonnier | après avoir atteint 2 paliers gratuits | piste premium et cosmétiques | 7,99 € |
| Tenue de famille | après 10 parties avec une famille | skin, entrée, emote non textuelle | 4,99 € |
| Pack de région | après le chapitre correspondant | 3 boosters, Essence, bannière | 5,99 € |
| Bundle collectionneur | après 70 % d’une famille | variantes artistiques, pas de stats | 9,99 € |

### Règles de présentation

- Une offre maximum par session en dehors de la boutique.
- Aucun écran commercial juste après une défaite.
- Une option « Ne plus afficher cette saison ».
- Un achat affiche toujours le contenu exact et la valeur de chaque monnaie.
- Les objets aléatoires affichent leurs probabilités avant l’achat.
- Les monnaies premium achetées n’expirent pas.
- Les achats restaurables et le contrôle parental restent accessibles.

### Publicité

- Pub récompensée volontaire : 50 pièces, après une partie ou depuis la boutique.
- Aucun bouton placé de manière à provoquer un tap accidentel.
- Interstitiel seulement après trois combats terminés, avec au moins trois minutes d’intervalle ; jamais pendant un booster ou un écran narratif.
- Achat quelconque recommandé pour supprimer les interstitiels, sans supprimer les récompenses volontaires.

### Ce qui doit être évité

- vente d’un héros exclusif dominant ;
- énergie payante obligatoire pour continuer l’histoire ;
- fausse réduction ou compte à rebours réinitialisé ;
- achat en un tap sans confirmation ;
- multiplication des monnaies ;
- offre ciblée immédiatement après une série de défaites ;
- doublons sans compensation.

## 11. Boucles de rétention

### Session de 5 minutes

1. récupérer une mission ;
2. jouer un duel ;
3. faire progresser deux héros ;
4. voir l’avancée vers le prochain booster ;
5. choisir : rejouer, améliorer le deck ou quitter sans pénalité.

### Jour 1

- Tutoriel en trois combats.
- Deck de départ cohérent de 20 cartes prêté, puis 12 cartes réellement offertes.
- Premier booster contrôlé montrant au moins une carte de la famille choisie.
- Découverte d’une première recette simple à trois unités.

### Semaine 1

- Une région d’histoire complète.
- Choix d’un second deck d’espèce opposée.
- Premier héros au niveau 3.
- Événement limité fondé sur une règle, pas sur un bonus de statistiques payant.

### Indicateurs à suivre

- taux de fin du tutoriel ;
- première construction de deck ;
- temps avant première recette ;
- parties/jour et durée moyenne ;
- taux de retour J1, J7, J30 ;
- boosters obtenus gratuitement par semaine ;
- taux de conversion par type d’offre ;
- écart de victoire entre payeurs et non-payeurs à niveau de jeu équivalent ;
- taux de consultation des probabilités et taux de remboursement.

Un écart durable de victoire lié à la dépense est un signal de déséquilibre, pas un succès commercial.

## 12. Feuille de route

### Phase A — Fondations, 2 semaines

- stabiliser Pet Tank, raid pirate et dock de constructions ;
- afficher rôle, passif, technique et maîtrise sur chaque fiche ;
- centraliser les valeurs d’économie ;
- ajouter tests de combos, migration des sauvegardes et mode mouvement réduit ;
- exposer les chances du booster avant achat.

### Phase B — Vertical slice, 4 semaines

- créer 20 cartes Armée et 20 Pirates selon la distribution cible ;
- terminer une région Histoire de 7 niveaux ;
- intégrer Bastion royal et Jardin sanctuaire ;
- ajouter progression de maîtrise persistante ;
- instrumenter les événements d’analyse sans données personnelles inutiles.

### Phase C — Catalogue, 8 à 12 semaines

- normaliser les 200 héros avec 10 Chats et 10 Chiens par famille ;
- écrire 200 histoires courtes et au moins 50 liens narratifs ;
- équilibrer avec simulations puis playtests humains ;
- créer les 10 Ultra Rares, une par famille ou thème transversal.

### Phase D — Lancement contrôlé

- classé saisonnier, passe et boutique cosmétique ;
- localisation, accessibilité, consentement et restauration d’achat ;
- soft launch sur un territoire, sans augmenter les prix pendant le test ;
- corriger rétention et compréhension avant d’optimiser la conversion.

## 13. Traduction technique dans ce dépôt

| Besoin | Fichier actuel ou cible |
|---|---|
| catalogue | `src/data/cards.ts`, puis migration vers une entrée par héros |
| profils, rôles et maîtrises | `src/data/characterDesign.ts` |
| combos et constructions | `src/data/battleEngine.ts` |
| badges de synergie | `src/data/synergies.ts` |
| persistance d’une partie | `src/data/battleSession.ts` |
| économie | `src/data/economy.ts`, `src/data/progression.ts` |
| doublons et Essence | `src/data/collection.ts` |
| boosters | `src/data/booster.ts` |
| arène et cinématiques | `src/BattleArena.tsx`, `src/tactical-combos.css` |
| fiche de carte | `src/App.tsx`, `src/character-profile.css` |

### Critères d’acceptation pour tout nouveau héros

- toutes les informations obligatoires de la fiche existent ;
- l’effet tient en deux phrases et indique sa limite ;
- le héros a au moins un allié et un contre naturel ;
- la silhouette reste identifiable sans son cadre ;
- les cinq niveaux de maîtrise sont renseignés ;
- ses effets fonctionnent avec une cible absente et lors d’une destruction simultanée ;
- aucun achat n’est nécessaire pour obtenir son équivalent mécanique ;
- la carte passe les tests de catalogue, de profil et de combat.

### Définition de « minimaliste » pour Paw & Claw

Minimaliste ne signifie pas vide. Cela signifie qu’à chaque instant le joueur sait : **ce qui vient de se passer, ce qu’il peut faire et pourquoi son choix compte**. Toute décoration, animation, monnaie ou bouton qui n’aide pas l’une de ces trois réponses doit être retiré ou déplacé dans un niveau de détail secondaire.
