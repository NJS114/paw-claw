export const visualDirection = {
  name: 'Paw & Claw — 2D Fantasy',
  rules: [
    'Illustration 2D dessinée / cel-shaded uniquement',
    'Chats et chiens anthropomorphes, debout sur deux pattes',
    'Silhouettes mignonnes et lisibles, anatomie cohérente',
    'Pas de rendu 3D, plastique, photoréaliste ou CGI',
    'Décors fantasy chaleureux, compositions simples et lisibles',
    'Combat principal en paysage 16:9, rouge contre bleu avec accents or',
    'Badge de famille hexagonal en haut à droite des cartes'
  ],
  rarity: {
    Commune: 'charbon / bronze sombre',
    Rare: 'saphir / bleu profond',
    Épique: 'violet profond',
    Légendaire: 'or antique',
    Horreur: 'rouge / cramoisi'
  },
  families: {
    Armée: 'rouge-bordeaux', Magiciens: 'violet', Nobles: 'or', Ombres: 'bleu nuit',
    Robots: 'acier-bleu', Nature: 'vert', Éléments: 'rouge-orange', Guérisseurs: 'menthe-turquoise',
    Pirates: 'brun-orange', Créatures: 'violet-rose'
  }
} as const;
