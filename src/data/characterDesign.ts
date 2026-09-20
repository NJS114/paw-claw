import type { CardData, Rarity } from "./cards";
import { deployAbilityFor } from "./abilitySystem";

export type CombatRole = "Attaque" | "Défense" | "Soutien" | "Contrôle";
export type AbilityDetail = {
  name: string;
  timing: "Entrée" | "Passive" | "Combat" | "Fin de tour";
  description: string;
};
export type EvolutionStep = {
  level: 1 | 3 | 5 | 7 | 10;
  name: string;
  unlock: string;
};
export type CharacterProfile = {
  role: CombatRole;
  archetype: string;
  fantasy: string;
  passive: AbilityDetail;
  signature: AbilityDetail;
  rarityAbility: AbilityDetail & { rarityLabel: string; power: number };
  comboHint: string;
  entranceAnimation: string;
  attackAnimation: string;
  evolution: EvolutionStep[];
};

type FamilyKit = {
  archetype: string;
  fantasy: string;
  passive: Record<CombatRole, string>;
  signature: Record<CombatRole, string>;
  comboHint: string;
  entrance: string;
  attack: string;
};

const FAMILY_KITS: Record<string, FamilyKit> = {
  Armée: {
    archetype: "Front discipliné",
    fantasy:
      "Tenir une ligne, protéger son partenaire et gagner par une formation lisible.",
    passive: {
      Attaque:
        "Gagne +1 ATQ pendant un combat si une unité alliée occupe une ligne voisine.",
      Défense:
        "Le premier dégât reçu à chaque tour est réduit de 1 lorsque Formation I est active.",
      Soutien:
        "La prochaine unité Armée posée coûte 1 énergie de moins, une fois par tour.",
      Contrôle:
        "La cible opposée perd 1 ATQ pendant son prochain combat après l’entrée en jeu.",
    },
    signature: {
      Attaque:
        "Charge la ligne opposée ; si elle est vide, inflige 1 dégât direct supplémentaire.",
      Défense:
        "Donne 1 Bouclier au héros et +1 PV max à une unité Armée adjacente.",
      Soutien:
        "Déplace une unité alliée vers une ligne libre et la soigne de 1 PV.",
      Contrôle:
        "Verrouille la ligne opposée : aucune nouvelle unité ne peut y être posée ce tour.",
    },
    comboHint:
      "4 Armée : Ordre de bataille (+1 ATQ/+1 PV à tous les alliés et 2 Boucliers). Variante croisée : 3 Armée + 2 Nobles pour le Bastion royal.",
    entrance:
      "Un fanion se plante dans la ligne puis une onde rouge-bordeaux révèle le personnage.",
    attack: "Course courte, impact d’écu et retour immédiat sur la carte.",
  },
  Magiciens: {
    archetype: "Tempo arcanique",
    fantasy:
      "Préparer une combinaison de sorts et transformer l’énergie en avantage tactique.",
    passive: {
      Attaque:
        "Après la première carte jouée dans le tour, gagne +1 ATQ jusqu’à la résolution.",
      Défense:
        "Si au moins 2 énergies restent, réduit de 1 le premier dégât reçu ce tour.",
      Soutien:
        "À l’entrée, rend 1 énergie si un autre Magicien est déjà présent.",
      Contrôle:
        "La carte opposée coûte virtuellement +1 énergie à réinvoquer après sa destruction.",
    },
    signature: {
      Attaque:
        "Projette un trait arcanique qui inflige 1 dégât à l’unité située sur une ligne voisine.",
      Défense: "Crée une rune de garde absorbant 2 dégâts sur cette ligne.",
      Soutien:
        "Copie le dernier bonus de famille déclenché avec une puissance réduite de moitié.",
      Contrôle:
        "Suspend l’effet passif de la cible opposée jusqu’à la prochaine fin de tour.",
    },
    comboHint:
      "4 Magiciens : Tempête arcanique, 1 dégât à toute la zone adverse et +1 énergie. Variante croisée : 3 Magiciens + 2 Éléments.",
    entrance:
      "Un cercle de craie lumineuse se trace en deux gestes, sans particules envahissantes.",
    attack:
      "Glyphe bref, projectile coloré selon la famille, flash blanc de deux images à l’impact.",
  },
  Nobles: {
    archetype: "Protection et commandement",
    fantasy:
      "Faire grandir toute l’équipe et imposer une présence royale durable.",
    passive: {
      Attaque: "Gagne +1 ATQ si le héros possède un Bouclier.",
      Défense:
        "À l’entrée, gagne +1 PV max pour chaque autre Noble, limité à +2.",
      Soutien:
        "La première unité alliée posée après ce personnage gagne +1 PV max.",
      Contrôle:
        "L’unité opposée ne peut recevoir qu’un seul bonus pendant ce tour.",
    },
    signature: {
      Attaque:
        "Ordre royal : l’allié le plus faible attaque avec +1 ATQ pendant ce combat.",
      Défense: "Accorde 2 Boucliers au héros si la ligne opposée est occupée.",
      Soutien: "Soigne de 1 PV toutes les unités ayant déjà subi des dégâts.",
      Contrôle:
        "Retire 1 Bouclier adverse puis bloque sa régénération jusqu’au prochain tour.",
    },
    comboHint:
      "4 Nobles : Couronne unifiée (+1 PV max à tous les alliés et 3 Boucliers). Variante croisée : 3 Nobles + 2 Armée pour le Bastion royal.",
    entrance:
      "Un sceau d’or antique descend derrière le personnage, puis s’efface en 400 ms.",
    attack:
      "Geste de commandement, trait doré vers l’allié ou coup d’épée sobre selon le rôle.",
  },
  Ombres: {
    archetype: "Embuscade et exécution",
    fantasy:
      "Créer une menace courte, frapper les lignes fragiles puis disparaître.",
    passive: {
      Attaque: "Gagne +1 ATQ contre une cible déjà blessée.",
      Défense:
        "La première attaque reçue lorsque ce personnage est seul sur sa moitié de plateau est réduite de 1.",
      Soutien:
        "À l’entrée, révèle la carte supérieure du deck adverse dans le journal de combat.",
      Contrôle: "À l’entrée, retire 1 ATQ à la cible opposée pendant un tour.",
    },
    signature: {
      Attaque:
        "Exécute une cible à 1 PV après la résolution normale du combat.",
      Défense: "Échange sa ligne avec une Ombre alliée avant la résolution.",
      Soutien:
        "Récupère dans la main une Ombre alliée blessée ; elle coûte 1 de moins ce tour.",
      Contrôle:
        "Pose un Voile : la ligne opposée ne bénéficie pas de bonus de rôle ce tour.",
    },
    comboHint:
      "4 Ombres : Nuit totale, les deux adversaires les plus solides perdent 2 ATQ. Variante croisée : 3 Ombres + 2 Créatures.",
    entrance:
      "La silhouette apparaît par masque découpé bleu nuit, jamais par fumée réaliste.",
    attack:
      "Deux images fantômes plates, une entaille diagonale puis disparition immédiate.",
  },
  Robots: {
    archetype: "Construction et réseau",
    fantasy:
      "Assembler des rôles complémentaires jusqu’à fabriquer une unité de soutien autonome.",
    passive: {
      Attaque:
        "Après l’arrivée d’un autre Robot, gagne +1 ATQ pendant le prochain combat.",
      Défense:
        "Partage 1 point de dégâts avec le Robot allié ayant le plus de PV.",
      Soutien:
        "Répare de 1 PV le Robot allié le plus endommagé en fin de tour.",
      Contrôle:
        "Marque la cible opposée ; le prochain Robot qui l’attaque gagne +1 ATQ.",
    },
    signature: {
      Attaque:
        "Tir calibré : inflige 1 dégât supplémentaire si la cible possède davantage de PV.",
      Défense:
        "Déploie une plaque de blindage donnant 1 armure à sa ligne pour un tour.",
      Soutien:
        "Transfère 1 énergie non utilisée vers le prochain tour, une seule fois.",
      Contrôle:
        "Court-circuite la cible opposée et désactive son passif pendant un tour.",
    },
    comboHint:
      "4 Robots dont 3 Défense + 1 Attaque : invoque un Pet Tank (6 PV, tir de puissance 2 à chaque fin de tour).",
    entrance:
      "Quatre segments cyan s’assemblent autour de la silhouette avec un petit scan horizontal.",
    attack:
      "Recul mécanique de deux pixels, rayon cyan court et étincelle carrée à l’impact.",
  },
  Nature: {
    archetype: "Régénération progressive",
    fantasy:
      "Occuper le plateau, survivre aux échanges et gagner grâce aux soins répétés.",
    passive: {
      Attaque: "Gagne +1 ATQ lorsque ses PV reviennent au maximum.",
      Défense: "Le premier soin reçu chaque tour soigne 1 PV supplémentaire.",
      Soutien: "Soigne de 1 PV l’allié adjacent le plus blessé en fin de tour.",
      Contrôle:
        "Enracine la cible opposée : elle ne peut pas changer de ligne ce tour.",
    },
    signature: {
      Attaque:
        "Frappe de ronces : 1 dégât supplémentaire si la cible a été soignée ce tour.",
      Défense: "Fait pousser une écorce absorbant les 2 prochains dégâts.",
      Soutien: "Distribue 2 soins entre les unités blessées.",
      Contrôle:
        "Réduit de 1 l’ATQ de la cible et soigne ce personnage de 1 PV.",
    },
    comboHint:
      "4 Nature : Grande floraison (+1 PV max et jusqu’à 2 soins à tous les alliés). Variante croisée : 3 Nature + 2 Guérisseurs.",
    entrance:
      "Deux feuilles plates tournent autour des pattes, puis une pousse apparaît sous la carte.",
    attack:
      "Liane souple ou rafale de feuilles, palette verte sans surcharge de particules.",
  },
  Éléments: {
    archetype: "Dégâts de réaction",
    fantasy:
      "Accumuler une même énergie puis déclencher une réaction spectaculaire mais courte.",
    passive: {
      Attaque: "Le premier dégât direct infligé par une synergie gagne +1.",
      Défense:
        "Choisit automatiquement une résistance réduisant de 1 le premier dégât du tour.",
      Soutien:
        "La prochaine réaction de famille déclenchée gagne +1 de valeur.",
      Contrôle: "La cible opposée perd son bonus de Bouclier pour ce combat.",
    },
    signature: {
      Attaque:
        "Explosion élémentaire : 2 dégâts, ou 3 si Réaction II est active.",
      Défense: "Change d’élément et gagne 2 PV temporaires pendant ce combat.",
      Soutien: "Transforme 1 point de soin excédentaire en 1 Bouclier.",
      Contrôle:
        "Gèle, brûle ou repousse la ligne selon l’élément visuel du personnage.",
    },
    comboHint:
      "4 Éléments : Cataclysme maîtrisé, 2 dégâts aux trois adversaires les plus solides. Variante croisée : 3 Éléments + 2 Magiciens.",
    entrance:
      "Un seul symbole élémentaire grand et lisible remplace les multiples effets.",
    attack:
      "Impact plein écran de 120 ms dans la couleur de l’élément, puis retour instantané.",
  },
  Guérisseurs: {
    archetype: "Sauvetage et endurance",
    fantasy:
      "Empêcher une élimination décisive sans rendre l’équipe immortelle.",
    passive: {
      Attaque: "Gagne +1 ATQ lorsque le héros est à 10 PV ou moins.",
      Défense:
        "Le premier allié soigné chaque tour gagne aussi 1 PV max jusqu’à la fin du combat.",
      Soutien:
        "Soigne de 1 PV le héros à la fin du tour si ce personnage n’a pas subi de dégâts.",
      Contrôle: "Retire un effet négatif de l’allié le plus faible à l’entrée.",
    },
    signature: {
      Attaque: "Lumière punitive : inflige 1 dégât et soigne le héros de 1 PV.",
      Défense:
        "Place une garde empêchant le prochain dégât létal sur une unité.",
      Soutien:
        "Soigne 2 PV, répartis automatiquement sur les deux alliés les plus faibles.",
      Contrôle: "Apaise la ligne opposée : sa cible perd 1 ATQ pour ce combat.",
    },
    comboHint:
      "4 Guérisseurs : Grand miracle, 4 soins au héros et jusqu’à 2 par allié. Variante croisée : 3 Guérisseurs + 2 Nature.",
    entrance:
      "Un anneau menthe s’ouvre sous les pattes et remonte en aplats translucides.",
    attack:
      "Onde courte en forme de croix abstraite, sans symbole médical réaliste.",
  },
  Pirates: {
    archetype: "Butin et sabotage",
    fantasy:
      "Détruire une cible, récupérer une ressource et affaiblir les constructions adverses.",
    passive: {
      Attaque:
        "Après une élimination alliée, gagne +1 ATQ pour le prochain combat.",
      Défense: "Quand une construction adverse est endommagée, gagne 1 PV.",
      Soutien: "La première élimination du tour rend 1 énergie.",
      Contrôle:
        "À l’entrée, la construction adverse ayant le plus de PV perd 1 PV.",
    },
    signature: {
      Attaque:
        "Abordage : attaque la ligne opposée puis inflige 1 dégât à une construction.",
      Défense: "Pose un baril-bouclier qui absorbe 2 dégâts sur la ligne.",
      Soutien: "Pioche une carte après la première élimination du tour.",
      Contrôle: "Vole 1 Bouclier adverse et le transfère au héros allié.",
    },
    comboHint:
      "4 Pirates : un bateau traverse l’arène, inflige 3 dégâts à une construction adverse ou 1 dégât au héros si aucune construction n’existe.",
    entrance:
      "Une planche de bois glisse sous la carte, corde tendue et fanion orange.",
    attack:
      "Trajectoire en arc de boulet stylisé, sans fumée réaliste ni explosion envahissante.",
  },
  Créatures: {
    archetype: "Adaptation et rage",
    fantasy:
      "Devenir plus dangereux en étant blessé et surprendre par des formes fantastiques.",
    passive: {
      Attaque: "À 50 % de PV ou moins, gagne +1 ATQ.",
      Défense:
        "La première fois que les PV passent sous 50 %, gagne 1 Bouclier personnel.",
      Soutien:
        "Lorsqu’une Créature alliée tombe, soigne de 1 PV l’allié le plus faible.",
      Contrôle:
        "À l’entrée, effraie la cible opposée et lui retire 1 ATQ pour ce tour.",
    },
    signature: {
      Attaque:
        "Instinct féroce : double le bonus de blessure pendant un combat.",
      Défense: "Mue : échange 1 ATQ contre 2 PV max.",
      Soutien: "Appel du terrier : donne +1 PV à toutes les Créatures.",
      Contrôle:
        "Rugissement : annule le prochain bonus d’entrée de la ligne opposée.",
    },
    comboHint:
      "4 Créatures : Éveil primal (+2 ATQ/+1 PV à toutes les Créatures). Variante croisée : 3 Créatures + 2 Ombres.",
    entrance:
      "Une ombre animale se déploie derrière la carte puis rejoint la silhouette.",
    attack:
      "Bond élastique et trace de griffe ou de patte en aplat violet-rose.",
  },
};

const ATTACK_WORDS = [
  "assassin",
  "lame",
  "archer",
  "faucheur",
  "champion",
  "chasseur",
  "canon",
  "artilleur",
  "berserker",
];
const DEFENSE_WORDS = [
  "gardien",
  "protecteur",
  "paladin",
  "chevalier",
  "golem",
  "titan",
  "colosse",
  "sentinelle",
  "bastion",
];
const SUPPORT_WORDS = [
  "soigneur",
  "soigneuse",
  "prêtresse",
  "oracle",
  "bibliothécaire",
  "mécanicien",
  "chambellan",
  "druide",
  "invocateur",
];

export function roleOf(
  card: Pick<CardData, "name" | "atk" | "hp" | "cost">,
): CombatRole {
  const name = card.name.toLowerCase();
  if (ATTACK_WORDS.some((word) => name.includes(word))) return "Attaque";
  if (DEFENSE_WORDS.some((word) => name.includes(word))) return "Défense";
  if (SUPPORT_WORDS.some((word) => name.includes(word))) return "Soutien";
  const atk = card.atk ?? 0;
  const hp = card.hp ?? 1;
  if (atk > hp) return "Attaque";
  if (hp >= atk + 1) return "Défense";
  return card.cost >= 5 ? "Contrôle" : "Soutien";
}

function rarityMastery(rarity: Rarity) {
  if (rarity === "Légendaire")
    return "une pose d’entrée alternative et un titre de maîtrise doré";
  if (rarity === "Épique")
    return "un effet de compétence violet localisé et un titre de maîtrise";
  if (rarity === "Rare")
    return "une bordure animée discrète et une réplique de victoire";
  return "une pose de victoire et une variante de cadre bronze";
}

export function getCharacterProfile(card: CardData): CharacterProfile {
  const role = roleOf(card);
  const kit = FAMILY_KITS[card.family] ?? FAMILY_KITS.Créatures;
  const name = card.name;
  const rarityAbility = deployAbilityFor(card, role);
  return {
    role,
    archetype: kit.archetype,
    fantasy: kit.fantasy,
    passive: {
      name: `${name} · Instinct`,
      timing: "Passive",
      description: kit.passive[role],
    },
    signature: {
      name: `${name} · Technique signature`,
      timing:
        role === "Soutien"
          ? "Fin de tour"
          : role === "Contrôle"
            ? "Entrée"
            : "Combat",
      description: kit.signature[role],
    },
    rarityAbility: {
      name: `${name} · ${rarityAbility.name}`,
      timing: "Entrée",
      description: rarityAbility.description,
      rarityLabel: rarityAbility.rarityLabel,
      power: rarityAbility.rank,
    },
    comboHint: kit.comboHint,
    entranceAnimation: kit.entrance,
    attackAnimation: kit.attack,
    evolution: [
      {
        level: 1,
        name: "Recrue",
        unlock: "Carte jouable et compétence passive.",
      },
      {
        level: 3,
        name: "Éveillé",
        unlock: "Animation d’entrée et fiche d’histoire courte.",
      },
      {
        level: 5,
        name: "Vétéran",
        unlock: "Technique signature disponible dans les modes compatibles.",
      },
      {
        level: 7,
        name: "Héros",
        unlock:
          "Réplique, pose de victoire et effet de cadre propre à la famille.",
      },
      {
        level: 10,
        name: "Maîtrise",
        unlock: `${rarityMastery(card.rarity)} ; aucun bonus brut exclusif en PvP.`,
      },
    ],
  };
}

export function profilesFor(cards: CardData[]) {
  return cards
    .filter((card) => card.type === "Héros")
    .map((card) => ({ card, profile: getCharacterProfile(card) }));
}
