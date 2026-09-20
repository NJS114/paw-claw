import type { CardData, Rarity } from "./cards";
import type { CombatRole } from "./characterDesign";
import { rarityRule } from "./rarityBalance";

export type RarityRank = 0 | 1 | 2 | 3;
export type DeployEffect =
  | "formation"
  | "arcane"
  | "command"
  | "ambush"
  | "repair"
  | "growth"
  | "reaction"
  | "miracle"
  | "sabotage"
  | "instinct";

export type DeployAbilitySpec = {
  active: boolean;
  rank: RarityRank;
  rarityLabel: string;
  name: string;
  effect: DeployEffect;
  magnitude: number;
  targetCount: number;
  description: string;
};

const FAMILY_EFFECT: Record<string, DeployEffect> = {
  Armée: "formation",
  Magiciens: "arcane",
  Nobles: "command",
  Ombres: "ambush",
  Robots: "repair",
  Nature: "growth",
  Éléments: "reaction",
  Guérisseurs: "miracle",
  Pirates: "sabotage",
  Créatures: "instinct",
};

const EFFECT_NAMES: Record<DeployEffect, string> = {
  formation: "Ordre de formation",
  arcane: "Décharge arcanique",
  command: "Présence royale",
  ambush: "Frappe depuis l’ombre",
  repair: "Protocole de renfort",
  growth: "Poussée vitale",
  reaction: "Réaction élémentaire",
  miracle: "Onde de soin",
  sabotage: "Coup de flibuste",
  instinct: "Instinct éveillé",
};

function scope(rank: RarityRank) {
  if (rank === 3) return "toute la zone concernée";
  if (rank === 2) return "jusqu’à 2 cibles";
  if (rank === 1) return "1 cible";
  return "la synergie de famille";
}

function roleClause(role: CombatRole) {
  if (role === "Attaque")
    return "Le profil Attaque privilégie les dégâts ou l’ATQ.";
  if (role === "Défense")
    return "Le profil Défense privilégie les PV et le Bouclier.";
  if (role === "Soutien")
    return "Le profil Soutien privilégie les soins et les alliés.";
  return "Le profil Contrôle privilégie les malus d’ATQ et la perturbation.";
}

function familyClause(effect: DeployEffect, rank: RarityRank) {
  const magnitude = rank === 3 ? 2 : 1;
  const targetScope = scope(rank);
  switch (effect) {
    case "formation":
      return `Renforce ${targetScope} de +${magnitude} ATQ ou +${magnitude} PV selon le rôle.`;
    case "arcane":
      return `Rend de l’énergie et projette une décharge sur ${targetScope}.`;
    case "command":
      return `Accorde du Bouclier au héros et +1 PV max à ${targetScope}.`;
    case "ambush":
      return `Affaiblit l’ATQ de ${targetScope} ; les profils offensifs blessent aussi la cible la plus faible.`;
    case "repair":
      return `Répare ${targetScope} Robot et renforce le blindage selon le rôle.`;
    case "growth":
      return `Soigne ${targetScope} ; une Légendaire fait aussi croître les PV max.`;
    case "reaction":
      return `Inflige ${magnitude} dégât${magnitude > 1 ? "s" : ""} de zone à ${targetScope}.`;
    case "miracle":
      return `Soigne le héros et ${targetScope} alliée${rank === 1 ? "" : "s"}.`;
    case "sabotage":
      return `Endommage une construction de ${rank} ou attaque ${targetScope} si aucune structure n’est présente.`;
    case "instinct":
      return `Renforce en priorité les alliés blessés sur ${targetScope}.`;
  }
}

export function rarityRank(rarity: Rarity): RarityRank {
  return Math.max(0, rarityRule(rarity).rank - 1) as RarityRank;
}

export function deployAbilityFor(
  card: Pick<CardData, "family" | "rarity">,
  role: CombatRole,
): DeployAbilitySpec {
  const rank = rarityRank(card.rarity);
  const effect = FAMILY_EFFECT[card.family] ?? "instinct";
  return {
    active: rank > 0,
    rank,
    rarityLabel:
      rank === 3
        ? "Impact légendaire"
        : rank === 2
          ? "Impact épique"
          : rank === 1
            ? "Impact rare"
            : "Fondation commune",
    name: EFFECT_NAMES[effect],
    effect,
    magnitude: rank === 3 ? 2 : rank > 0 ? 1 : 0,
    targetCount: rank === 3 ? 7 : rank,
    description:
      rank === 0
        ? "Cette carte commune consolide la composition et les paliers de famille sans effet d’entrée supplémentaire."
        : `${familyClause(effect, rank)} ${roleClause(role)}`,
  };
}

export const RARITY_POWER_RULES = [
  "Commune : statistiques lisibles, passif de rôle et progression de famille.",
  "Rare : effet d’entrée tactique sur une cible.",
  "Épique : version renforcée touchant jusqu’à deux cibles ou combinant deux bénéfices.",
  "Légendaire : effet de zone ou d’équipe, plus puissant mais limité à son entrée en jeu.",
] as const;
