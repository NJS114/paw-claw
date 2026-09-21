# Paw & Claw — Fantasy mignonne et animée

Base : branche main, commit 616f9fd. Révision de l'interface à partir des illustrations et boosters approuvés.

## Direction

Bleu nuit légèrement éclairci, crème et petites touches de rose ; dorures fines. Boutons en médaillons arrondis avec relief doux, typographie lisible, une grande illustration par écran. Les personnages et boosters existants restent les références visuelles. Les deux camps sont nommés **Moustaches** et **Truffes**. Les identifiants internes Chat/Chien restent compatibles avec les sauvegardes.

## Parcours recensés

| Écran ou état | État dans le dépôt |
| --- | --- |
| Chargement | Existant |
| Accueil | Nouvelle composition, illustrations fixes |
| Collection et filtres | Existant, contrôles adoucis |
| Carte détaillée et carte non découverte | Carnet crème, onglets Aptitudes / Talents / Histoire ; données réelles |
| Bibliothèque de decks / éditeur / deck incomplet | Existant, noms des camps mis à jour |
| Boutique / solde insuffisant / offres | Existant |
| Sélection de booster / inventaire vide | Existant |
| Découpe du booster | Nouveau geste horizontal, ouverture au bouton conservée |
| Charge / déchirure / révélation / bilan du booster | Existant, séquence fonctionnelle conservée sans animation CSS des images |
| Recherche et préparation du duel contre l'IA | Existant, présentation des nouveaux camps |
| Main de départ et remplacement de 2 cartes | Existant |
| Combat / tour adverse / synergies / fatigue | Existant |
| Victoire / défaite / égalité | Existant |
| Missions quotidiennes / hebdomadaires | Existant |
| Passe gratuit / premium | Existant |
| Profil | Existant |
| Histoires des personnages et familles | Existant dans Options du jeu |
| Carnet : guide en quatre étapes | Nouveau |
| Carnet : bannières Moustaches / Truffes | Nouveau, choix conservé localement |
| Carnet : historique des duels | Nouveau, utilise les vrais résultats enregistrés |
| Carnet : mouvement réduit | Nouveau, choix conservé localement |

Les règles du dépôt font foi : 20 cartes par deck joueur, 7 lignes, 5 cartes en main maximum, 40 tours maximum. Le booster actuel contient 12 cartes. Les anciens concepts à 12 cartes par deck et 3 lignes étaient des maquettes et ne décrivent pas ce moteur.

## Fiches descriptives — 21 septembre 2026

Présentation en carnet crème, encadrés arrondis, sections courtes, onglets bleu doux et accents dorés. Les cartes utilisent toujours GameCard et les illustrations du catalogue. Les statistiques viennent de gameCards, les synergies de FAMILY_RULES, les liens narratifs de LORE_BONDS et les histoires de flavor. Aucune statistique ou condition d’ascension fictive de la maquette n’est ajoutée. Dialog natif, navigation clavier des onglets, restauration du focus et défilement mobile.

Le guide, l’historique, les réglages, l’analyse de deck et le profil reprennent les surfaces de lecture crème.

## Règle d’animation obligatoire

**Interdit : déplacer, faire flotter, tourner, zoomer ou pulser une illustration fixe pour simuler un personnage vivant.** Les anciennes animations CSS sont désactivées dans le jeu. Les mises en page fixes et les gestes de jeu restent fonctionnels.

Le composant FrameSequence affiche successivement des cellules d’une planche dessinée, sans interpolation. Il attend le chargement, conserve l’image originale en cas d’erreur, arrête son minuteur hors écran/en arrière-plan, respecte le réglage local et prefers-reduced-motion, et libère les ressources au démontage.

Première séquence intégrée : **mag-007, Archimage persan**, huit images de clignement des yeux et de page tournée, dans sa fiche si la carte est possédée. Les autres cartes restent fixes tant qu’elles ne disposent pas de leur propre séquence : aucune animation empruntée à un autre personnage.

Asset : public/assets/animations/archimage-blink.webp (grille 4 × 2, cellule 3:4). Source : illustration existante public/assets/card-art/v1/mag-007-archimage-persan.webp. Génération par image_gen intégré ; consigne : conserver personnage, costume, cadrage et décor, dessiner huit étapes d’un clignement et d’une page tournée, sans déplacement global. Compression WebP uniquement après génération. Le PNG original de travail n’est pas une dépendance du jeu.

La découpe au doigt et l’ouverture des boosters fonctionnent encore ; aucun booster n’est consommé pour un geste interrompu. Les effets animés de déchirure, combat et révélation attendent leurs propres séquences dessinées et restent sans animation CSS.

## Limites et suite

Le dépôt n'a pas de serveur multijoueur : le duel est contre l'IA. Amis, classement en ligne, campagne avec carte de progression et évolution des cartes demandent encore leurs règles et leur stockage ; ils ne sont pas présentés comme opérationnels. Le choix de bannière dans le carnet ne modifie pas le deck actif. Les sauvegardes sont locales à l'appareil.

Vérification : compilation TypeScript/Vite et tests ciblés des parcours, du geste de découpe, de la consommation unique, des camps, du carnet et des préférences. Vérification visuelle sur appareil encore nécessaire avant fusion ; le navigateur distant ne peut pas ouvrir l'aperçu local dans cette session.

## Correction des calques

La séquence mag-007 utilise désormais archimage-background-v2.webp (décor fixe) et archimage-character-v2.webp (grille RGBA sans fond, compression sans perte). La robe, la silhouette et le bâton viennent de la même pose dans chaque cellule ; seules les régions des yeux et de la page sont remplacées par les dessins successifs. La dernière pose est identique à la première. Le lecteur attend le chargement des deux calques et conserve l’original si un calque échoue. Aucune interpolation ni fondu. Les pixels du décor exposé sont identiques dans chaque PNG composé (différence maximale mesurée : 0).
