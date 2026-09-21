# Paw & Claw — Fantasy mignonne et animée

Base : branche main, commit 616f9fd. Révision de l'interface à partir des illustrations et boosters approuvés.

## Direction

Bleu nuit légèrement éclairci, crème et petites touches de rose ; dorures fines. Boutons en médaillons arrondis avec relief doux, typographie lisible, une grande illustration par écran. Les personnages et boosters existants restent les références visuelles. Les deux camps sont nommés **Moustaches** et **Truffes**. Les identifiants internes Chat/Chien restent compatibles avec les sauvegardes.

## Parcours recensés

| Écran ou état | État dans le dépôt |
| --- | --- |
| Chargement | Existant |
| Accueil | Nouvelle composition, mascottes et boutons animés |
| Collection et filtres | Existant, contrôles adoucis |
| Carte détaillée et carte non découverte | Existant |
| Bibliothèque de decks / éditeur / deck incomplet | Existant, noms des camps mis à jour |
| Boutique / solde insuffisant / offres | Existant |
| Sélection de booster / inventaire vide | Existant |
| Découpe du booster | Nouveau geste horizontal, ouverture au bouton conservée |
| Charge / déchirure / révélation / bilan du booster | Existant, animations enrichies |
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

## Mouvement intégré

- Respiration et flottement léger des deux mascottes ; réaction au toucher.
- Étincelles espacées ; pas de fond rempli de particules.
- Enfoncement des boutons, rebond de l'onglet actif.
- Entrée des écrans et pages du carnet en 300–400 ms.
- Défilement de la ligne de découpe au doigt ou à la souris ; aucun booster consommé si le geste est interrompu.
- Charge, déchirure puis retournement des cartes. La consommation est protégée contre les déclenchements multiples.
- Préférence locale de mouvement réduit et respect de prefers-reduced-motion.

Il s'agit d'animations d'interface et de sprites complets, pas d'un rig image par image des yeux, oreilles et queues.

## Limites et suite

Le dépôt n'a pas de serveur multijoueur : le duel est contre l'IA. Amis, classement en ligne, campagne avec carte de progression et évolution des cartes demandent encore leurs règles et leur stockage ; ils ne sont pas présentés comme opérationnels. Le choix de bannière dans le carnet ne modifie pas le deck actif. Les sauvegardes sont locales à l'appareil.

Vérification : compilation TypeScript/Vite et tests ciblés des parcours, du geste de découpe, de la consommation unique, des camps, du carnet et des préférences. Vérification visuelle sur appareil encore nécessaire avant fusion ; le navigateur distant ne peut pas ouvrir l'aperçu local dans cette session.
