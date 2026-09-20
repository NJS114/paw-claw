export type CompanionSpecies = "Chat" | "Chiot";
export type CompanionRarity = "Commune" | "Rare" | "Épique" | "Légendaire";

export const COMPANION_FAMILIES = [
  "Armée",
  "Magiciens",
  "Nobles",
  "Ombres",
  "Robots",
  "Nature",
  "Éléments",
  "Guérisseurs",
  "Pirates",
  "Créatures",
] as const;

export type CompanionFamily = (typeof COMPANION_FAMILIES)[number];

export const COMPANION_RACES: Record<CompanionSpecies, string[]> = {
  Chat: ["Européen", "Maine Coon", "Persan", "Siamois", "Bengal", "Sphynx"],
  Chiot: ["Shiba", "Beagle", "Corgi", "Husky", "Labrador", "Berger"],
};

export const COMPANION_OUTFITS = [
  "Aventure",
  "Cape royale",
  "Armure douce",
  "Pyjama étoilé",
  "Tenue de pirate",
  "Atelier robot",
] as const;

export const COMPANION_COLORS = [
  { id: "abricot", label: "Abricot", value: "#ef947d" },
  { id: "lilas", label: "Lilas", value: "#b497e9" },
  { id: "menthe", label: "Menthe", value: "#73c9ad" },
  { id: "azur", label: "Azur", value: "#6faee8" },
  { id: "miel", label: "Miel", value: "#e6b95f" },
  { id: "nuit", label: "Nuit", value: "#59658f" },
] as const;

export type CompanionColor = (typeof COMPANION_COLORS)[number]["id"];
export type CompanionOutfit = (typeof COMPANION_OUTFITS)[number];

export type PlayerCompanion = {
  name: string;
  species: CompanionSpecies;
  race: string;
  family: CompanionFamily;
  outfit: CompanionOutfit;
  color: CompanionColor;
  createdAt: number;
};

export const DEFAULT_COMPANION: PlayerCompanion = {
  name: "Braisou",
  species: "Chat",
  race: "Européen",
  family: "Éléments",
  outfit: "Aventure",
  color: "abricot",
  createdAt: 0,
};

export type FamilyPower = {
  role: string;
  passive: string;
  rare: string;
  epic: string;
  legendary: string;
};

export const FAMILY_POWERS: Record<CompanionFamily, FamilyPower> = {
  Armée: {
    role: "Défenseur",
    passive: "Formation : gagne 1 Bouclier près d’un allié.",
    rare: "Ralliement : donne 1 ATQ à un allié adjacent.",
    epic: "Rempart royal : protège les deux alliés voisins.",
    legendary: "Dernier bastion : toute l’équipe gagne 2 Boucliers.",
  },
  Magiciens: {
    role: "Contrôle",
    passive: "Étude arcanique : la première compétence coûte 1 de moins.",
    rare: "Étincelle double : touche une seconde cible.",
    epic: "Écho de sort : répète le prochain effet à 50 %.",
    legendary: "Grand rituel : inflige 2 dégâts à tous les ennemis.",
  },
  Nobles: {
    role: "Soutien",
    passive: "Présence royale : l’allié le plus faible gagne 1 PV.",
    rare: "Décret : soigne et renforce un allié.",
    epic: "Garde d’honneur : deux alliés gagnent 2 PV.",
    legendary: "Couronnement : l’équipe gagne 1 ATQ et 2 PV.",
  },
  Ombres: {
    role: "Contrôle",
    passive: "Pas feutré : ignore le premier malus reçu.",
    rare: "Marque obscure : réduit l’ATQ d’une cible.",
    epic: "Voile nocturne : affaiblit deux ennemis.",
    legendary: "Nuit totale : tous les ennemis perdent 2 ATQ ce tour.",
  },
  Robots: {
    role: "Défenseur",
    passive: "Auto-réparation : récupère 1 PV après deux tours.",
    rare: "Module garde : donne 2 Boucliers à une cible.",
    epic: "Tourelle jumelle : attaque deux lignes.",
    legendary: "Pet Tank : invoque un tank qui tire puissance 2 chaque tour.",
  },
  Nature: {
    role: "Soutien",
    passive: "Repousse : récupère 1 PV après avoir subi des dégâts.",
    rare: "Liane protectrice : soigne un allié.",
    epic: "Floraison : soigne deux alliés et augmente leurs PV max.",
    legendary: "Forêt vivante : régénère toute l’équipe pendant 2 tours.",
  },
  Éléments: {
    role: "Attaque",
    passive: "Flammes vives : appliquer Brûlure donne 1 Hâte.",
    rare: "Étincelle : 2 dégâts et 50 % de chance de Brûlure.",
    epic: "Orage croisé : frappe deux ennemis.",
    legendary: "Cataclysme : dégâts de zone et altération élémentaire.",
  },
  Guérisseurs: {
    role: "Soutien",
    passive: "Patte douce : les soins rendent 1 PV supplémentaire.",
    rare: "Pansement rapide : soigne et retire un malus.",
    epic: "Onde de réconfort : soigne deux alliés.",
    legendary: "Miracle du Refuge : soigne toute l’équipe et relève un allié.",
  },
  Pirates: {
    role: "Attaque",
    passive: "Butin : gagne 1 pièce tactique après une élimination.",
    rare: "Coup de canon : endommage une cible ou une construction.",
    epic: "Bordée : frappe deux emplacements adverses.",
    legendary: "Navire envahisseur : le bateau réduit les constructions ennemies.",
  },
  Créatures: {
    role: "Attaque",
    passive: "Instinct : gagne 1 ATQ sous la moitié de ses PV.",
    rare: "Rugissement : effraie une cible et réduit sa défense.",
    epic: "Fureur liée : renforce deux Créatures.",
    legendary: "Forme primordiale : attaque en zone et gagne Rage.",
  },
};

const STORAGE_KEY = "paw-claw.player-companion.v1";

export function rarityForLevel(level: number): CompanionRarity {
  if (level >= 35) return "Légendaire";
  if (level >= 20) return "Épique";
  if (level >= 10) return "Rare";
  return "Commune";
}

export function nextEvolution(level: number) {
  if (level < 10) return { level: 10, rarity: "Rare" as const };
  if (level < 20) return { level: 20, rarity: "Épique" as const };
  if (level < 35) return { level: 35, rarity: "Légendaire" as const };
  return null;
}

export function companionStats(level: number, family: CompanionFamily) {
  const role = FAMILY_POWERS[family].role;
  const attackBonus = role === "Attaque" ? 2 : role === "Contrôle" ? 1 : 0;
  const healthBonus = role === "Défenseur" ? 4 : role === "Soutien" ? 2 : 0;
  return {
    attack: 3 + Math.floor(level / 5) + attackBonus,
    health: 7 + Math.floor(level / 4) + healthBonus,
    cost: Math.min(7, 2 + Math.floor(level / 12)),
  };
}

export function unlockedPowers(family: CompanionFamily, level: number) {
  const powers = FAMILY_POWERS[family];
  return [
    { level: 1, rarity: "Commune", name: "Talent de famille", description: powers.passive, unlocked: true },
    { level: 10, rarity: "Rare", name: "Technique rare", description: powers.rare, unlocked: level >= 10 },
    { level: 20, rarity: "Épique", name: "Pouvoir épique", description: powers.epic, unlocked: level >= 20 },
    { level: 35, rarity: "Légendaire", name: "Ultime légendaire", description: powers.legendary, unlocked: level >= 35 },
  ];
}

export function loadCompanion(): PlayerCompanion {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!value || !COMPANION_FAMILIES.includes(value.family)) return DEFAULT_COMPANION;
    return { ...DEFAULT_COMPANION, ...value };
  } catch {
    return DEFAULT_COMPANION;
  }
}

export function saveCompanion(companion: PlayerCompanion) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companion));
}
