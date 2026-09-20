import type { CardData } from "./gameCards";
import {
  armorBonus,
  attackBonus,
  endTurnHeroDelta,
  familyCount,
  turnEnergy,
  type BoardCard,
  type Side,
} from "./synergies";
import {
  applyOpponentLore,
  applySameSideLore,
  type LoreBond,
} from "./loreSynergies";
import { roleOf } from "./characterDesign";
import { deployAbilityFor } from "./abilitySystem";

export type ArenaConstruct = {
  id: string;
  name: string;
  kind: "pet-tank" | "bastion" | "sanctuary";
  hp: number;
  maxHp: number;
  power: number;
};

export type BattleSideState = Side & {
  hand: CardData[];
  deck: CardData[];
  shield: number;
  momentum: number;
  survivalUsed: boolean;
  pirateDrawUsed: boolean;
  healerSaveUsed: boolean;
  firstPlayDone: boolean;
  fatigue?: number;
  constructs?: ArenaConstruct[];
  comboMarks?: string[];
};
export type BattleState = {
  player: BattleSideState;
  enemy: BattleSideState;
  turn: number;
  log: string[];
};
export type CombatEvent = {
  id: string;
  lane: number;
  type:
    | "clash"
    | "direct-hit"
    | "unit-damage"
    | "unit-destroyed"
    | "unit-saved"
    | "shield-block"
    | "heal"
    | "momentum"
    | "buff-atk"
    | "buff-hp"
    | "armor"
    | "shield-gain"
    | "energy"
    | "draw"
    | "lore"
    | "fatigue"
    | "construct-summon"
    | "construct-fire"
    | "construct-damage"
    | "pirate-raid"
    | "family-combo"
    | "rarity-power"
    | "area-damage"
    | "debuff-atk";
  source: "player" | "enemy";
  target: "player" | "enemy";
  value?: number;
  cardId?: string;
  constructId?: string;
  family?: string;
  rarity?: CardData["rarity"];
  text: string;
};
const alive = (board: (BoardCard | null)[]) =>
  board.filter(Boolean) as BoardCard[];
const count = (board: (BoardCard | null)[], family: string) =>
  familyCount(board, family);
const clampHp = (hp: number) => Math.max(0, Math.min(20, hp));
const eventId = (type: string, lane: number) =>
  `${type}-${lane}-${Math.random().toString(36).slice(2, 8)}`;
const cloneBoard = (board: (BoardCard | null)[]) =>
  board.map((c) => (c ? { ...c } : null));

export function effectiveAttack(
  card: BoardCard,
  side: BattleSideState,
  enemy: BattleSideState,
) {
  return (
    (card.atk ?? 0) +
    attackBonus(side, enemy, card) +
    (side.momentum >= 3 ? 1 : 0)
  );
}
export function drawCard(
  side: BattleSideState,
  target: "player" | "enemy",
  reason = "Pioche",
): { side: BattleSideState; event: CombatEvent; drew: boolean } {
  if (side.hand.length >= 5)
    return {
      side,
      event: {
        id: eventId("draw-full", -1),
        lane: -1,
        type: "draw",
        source: target,
        target,
        value: 0,
        text: `${reason} impossible : main pleine.`,
      },
      drew: false,
    };
  const card = side.deck[0];
  if (card)
    return {
      side: { ...side, hand: [...side.hand, card], deck: side.deck.slice(1) },
      event: {
        id: eventId("draw", -1),
        lane: -1,
        type: "draw",
        source: target,
        target,
        value: 1,
        cardId: card.id,
        text: `${reason} : 1 carte piochée.`,
      },
      drew: true,
    };
  const fatigue = (side.fatigue ?? 0) + 1;
  return {
    side: { ...side, fatigue, heroHp: clampHp(side.heroHp - fatigue) },
    event: {
      id: eventId("fatigue", -1),
      lane: -1,
      type: "fatigue",
      source: target,
      target,
      value: fatigue,
      text: `Pioche vide : ${fatigue} dégât${fatigue > 1 ? "s" : ""} de fatigue.`,
    },
    drew: false,
  };
}
export function beginTurn(
  side: BattleSideState,
  enemy: BattleSideState,
): BattleSideState {
  let next = {
    ...side,
    energy: turnEnergy(side),
    firstPlayDone: false,
    pirateDrawUsed: false,
    healerSaveUsed: false,
    fatigue: side.fatigue ?? 0,
  };
  if (next.heroHp <= 5 && !next.survivalUsed) {
    next = {
      ...next,
      heroHp: clampHp(next.heroHp + 3),
      survivalUsed: true,
      momentum: Math.min(5, next.momentum + 2),
    };
    if (next.hand.length < 5 && next.deck[0])
      next = {
        ...next,
        hand: [...next.hand, next.deck[0]],
        deck: next.deck.slice(1),
      };
  }
  if (alive(enemy.board).length - alive(next.board).length >= 2)
    next = { ...next, momentum: Math.min(5, next.momentum + 1) };
  return next;
}
function buffBoardOnThreshold(
  before: (BoardCard | null)[],
  after: (BoardCard | null)[],
) {
  let board = cloneBoard(after);
  if (count(before, "Nobles") < 3 && count(board, "Nobles") >= 3)
    board = board.map((c) =>
      c
        ? {
            ...c,
            hp: (c.hp ?? 1) + 1,
            currentHp: (c.currentHp ?? c.hp ?? 1) + 1,
          }
        : null,
    );
  if (count(before, "Robots") < 5 && count(board, "Robots") >= 5)
    board = board.map((c) =>
      c && c.family === "Robots"
        ? {
            ...c,
            atk: (c.atk ?? 0) + 1,
            hp: (c.hp ?? 1) + 1,
            currentHp: (c.currentHp ?? c.hp ?? 1) + 1,
          }
        : c,
    );
  if (count(before, "Créatures") < 3 && count(board, "Créatures") >= 3)
    board = board.map((c) =>
      c && c.family === "Créatures"
        ? {
            ...c,
            hp: (c.hp ?? 1) + 1,
            currentHp: (c.currentHp ?? c.hp ?? 1) + 1,
          }
        : c,
    );
  return board;
}
export function playUnit(
  side: BattleSideState,
  enemy: BattleSideState,
  card: CardData,
  slot: number,
): BattleSideState {
  if (card.type !== "Héros" || slot < 0 || slot > 6 || side.board[slot])
    return side;
  let cost = card.cost;
  if (count(side.board, "Magiciens") >= 5 && !side.firstPlayDone)
    cost = Math.max(0, cost - 1);
  if (side.energy < cost) return side;
  const before = [...side.board],
    board = [...side.board];
  const comeback = side.heroHp <= 10 && !side.firstPlayDone,
    robot3 = card.family === "Robots" && count(side.board, "Robots") >= 2;
  const boost = (comeback ? 1 : 0) + (robot3 ? 1 : 0);
  board[slot] = {
    ...card,
    atk: (card.atk ?? 0) + boost,
    hp: (card.hp ?? 1) + boost,
    currentHp: (card.hp ?? 1) + boost,
  };
  const lore = applySameSideLore(buffBoardOnThreshold(before, board));
  const hand = [...side.hand];
  const idx = hand.findIndex((c) => c === card || c.id === card.id);
  if (idx >= 0) hand.splice(idx, 1);
  return {
    ...side,
    board: lore.board,
    energy: side.energy - cost,
    hand,
    firstPlayDone: true,
  };
}

function withBattleDefaults(side: BattleSideState): BattleSideState {
  return {
    ...side,
    constructs: [...(side.constructs ?? [])],
    comboMarks: [...(side.comboMarks ?? [])],
  };
}

function orderedIndexes(
  board: (BoardCard | null)[],
  predicate: (card: BoardCard) => boolean,
  weakestFirst = true,
) {
  return board
    .map((card, index) => ({ card, index }))
    .filter((entry): entry is { card: BoardCard; index: number } =>
      Boolean(entry.card && predicate(entry.card)),
    )
    .sort((a, b) => {
      const left = a.card.currentHp ?? a.card.hp ?? 1;
      const right = b.card.currentHp ?? b.card.hp ?? 1;
      return weakestFirst ? left - right : right - left;
    })
    .map((entry) => entry.index);
}

function damageBoard(
  board: (BoardCard | null)[],
  indexes: number[],
  amount: number,
) {
  const next = cloneBoard(board);
  let damage = 0;
  for (const index of indexes) {
    const card = next[index];
    if (!card) continue;
    const current = card.currentHp ?? card.hp ?? 1;
    const dealt = Math.min(amount, current);
    damage += dealt;
    const remaining = current - dealt;
    next[index] = remaining <= 0 ? null : { ...card, currentHp: remaining };
  }
  return { board: next, damage };
}

function buffBoard(
  board: (BoardCard | null)[],
  indexes: number[],
  attack: number,
  health: number,
) {
  const next = cloneBoard(board);
  for (const index of indexes) {
    const card = next[index];
    if (!card) continue;
    next[index] = {
      ...card,
      atk: Math.max(0, (card.atk ?? 0) + attack),
      hp: Math.max(1, (card.hp ?? 1) + health),
      currentHp: Math.max(
        1,
        (card.currentHp ?? card.hp ?? 1) + Math.max(0, health),
      ),
    };
  }
  return next;
}

function healBoard(
  board: (BoardCard | null)[],
  indexes: number[],
  amount: number,
) {
  const next = cloneBoard(board);
  let healed = 0;
  for (const index of indexes) {
    const card = next[index];
    if (!card) continue;
    const before = card.currentHp ?? card.hp ?? 1;
    const after = Math.min(card.hp ?? 1, before + amount);
    healed += after - before;
    next[index] = { ...card, currentHp: after };
  }
  return { board: next, healed };
}

/**
 * Pouvoir d'entrée lié à la rareté. La famille détermine la nature de
 * l'effet, le rôle sa priorité et la rareté son ampleur.
 */
export function resolveRarityDeployAbility(
  side: BattleSideState,
  enemy: BattleSideState,
  card: CardData,
  slot: number,
  source: "player" | "enemy",
) {
  let nextSide = withBattleDefaults(side),
    nextEnemy = withBattleDefaults(enemy);
  const role = roleOf(card),
    spec = deployAbilityFor(card, role),
    target = source === "player" ? "enemy" : "player";
  const events: CombatEvent[] = [];
  if (!spec.active || !nextSide.board[slot])
    return { side: nextSide, enemy: nextEnemy, events };

  const ownFamily = orderedIndexes(
      nextSide.board,
      (unit) => unit.family === card.family,
    ),
    ownAll = orderedIndexes(nextSide.board, () => true),
    enemyWeak = orderedIndexes(nextEnemy.board, () => true),
    enemyStrong = orderedIndexes(nextEnemy.board, () => true, false),
    limit = (indexes: number[]) => indexes.slice(0, spec.targetCount),
    ownTargets = limit([
      ...ownFamily,
      ...ownAll.filter((i) => !ownFamily.includes(i)),
    ]);
  let text = `${spec.rarityLabel} — ${card.name} déclenche ${spec.name}.`;
  let value = spec.magnitude;

  switch (spec.effect) {
    case "formation": {
      if (role === "Défense") {
        nextSide = {
          ...nextSide,
          board: buffBoard(nextSide.board, ownTargets, 0, spec.magnitude),
          shield: nextSide.shield + spec.rank,
        };
        text += ` ${ownTargets.length} allié${ownTargets.length > 1 ? "s gagnent" : " gagne"} ${spec.magnitude} PV et le héros gagne ${spec.rank} Bouclier.`;
      } else {
        nextSide = {
          ...nextSide,
          board: buffBoard(
            nextSide.board,
            ownTargets,
            spec.magnitude,
            role === "Soutien" ? 1 : 0,
          ),
        };
        text += ` ${ownTargets.length} allié${ownTargets.length > 1 ? "s gagnent" : " gagne"} ${spec.magnitude} ATQ${role === "Soutien" ? " et 1 PV" : ""}.`;
      }
      break;
    }
    case "arcane": {
      const targets = limit(enemyWeak),
        hit = damageBoard(nextEnemy.board, targets, spec.magnitude);
      nextEnemy = { ...nextEnemy, board: hit.board };
      nextSide = {
        ...nextSide,
        energy: nextSide.energy + (role === "Soutien" ? 1 : 0),
        shield: nextSide.shield + (role === "Défense" ? spec.rank : 0),
      };
      value = hit.damage;
      text += ` ${targets.length} cible${targets.length > 1 ? "s subissent" : " subit"} ${spec.magnitude} dégât${spec.magnitude > 1 ? "s" : ""}.`;
      if (role === "Soutien") text += " 1 énergie est rendue.";
      if (role === "Défense") text += ` Le héros gagne ${spec.rank} Bouclier.`;
      break;
    }
    case "command": {
      nextSide = {
        ...nextSide,
        board: buffBoard(
          nextSide.board,
          ownTargets,
          role === "Attaque" ? 1 : 0,
          1,
        ),
        shield: nextSide.shield + spec.rank,
      };
      value = spec.rank;
      text += ` ${ownTargets.length} allié${ownTargets.length > 1 ? "s gagnent" : " gagne"} 1 PV max et le héros gagne ${spec.rank} Bouclier.`;
      break;
    }
    case "ambush": {
      const targets = limit(enemyStrong);
      nextEnemy = {
        ...nextEnemy,
        board: buffBoard(nextEnemy.board, targets, -spec.magnitude, 0),
      };
      if (role === "Attaque" && enemyWeak[0] !== undefined) {
        const hit = damageBoard(
          nextEnemy.board,
          [enemyWeak[0]],
          spec.magnitude,
        );
        nextEnemy = { ...nextEnemy, board: hit.board };
      }
      value = spec.magnitude;
      text += ` ${targets.length} adversaire${targets.length > 1 ? "s perdent" : " perd"} ${spec.magnitude} ATQ${role === "Attaque" ? " et la cible la plus faible est blessée" : ""}.`;
      break;
    }
    case "repair": {
      const repaired = healBoard(nextSide.board, ownTargets, spec.rank);
      nextSide = {
        ...nextSide,
        board: repaired.board,
        shield: nextSide.shield + (role === "Défense" ? spec.rank : 0),
      };
      if (role === "Attaque" && enemyWeak[0] !== undefined) {
        const hit = damageBoard(
          nextEnemy.board,
          [enemyWeak[0]],
          spec.magnitude,
        );
        nextEnemy = { ...nextEnemy, board: hit.board };
      }
      value = repaired.healed;
      text += ` Les Robots récupèrent ${repaired.healed} PV au total${role === "Défense" ? ` et le héros gagne ${spec.rank} Bouclier` : ""}${role === "Attaque" ? " ; un tir touche la cible la plus faible" : ""}.`;
      break;
    }
    case "growth": {
      const grown =
        spec.rank === 3
          ? buffBoard(nextSide.board, ownTargets, 0, 1)
          : nextSide.board;
      const healed = healBoard(grown, ownTargets, spec.rank);
      nextSide = { ...nextSide, board: healed.board };
      value = healed.healed;
      text += ` ${ownTargets.length} allié${ownTargets.length > 1 ? "s récupèrent" : " récupère"} jusqu’à ${spec.rank} PV${spec.rank === 3 ? " et gagne 1 PV max" : ""}.`;
      break;
    }
    case "reaction": {
      const targets = limit(enemyWeak),
        hit = damageBoard(nextEnemy.board, targets, spec.magnitude);
      nextEnemy = { ...nextEnemy, board: hit.board };
      value = hit.damage;
      text += ` La réaction inflige ${spec.magnitude} dégât${spec.magnitude > 1 ? "s" : ""} à ${targets.length} cible${targets.length > 1 ? "s" : ""}.`;
      break;
    }
    case "miracle": {
      const healed = healBoard(nextSide.board, ownTargets, spec.magnitude);
      const heroHeal = spec.rank + 1;
      nextSide = {
        ...nextSide,
        board: healed.board,
        heroHp: clampHp(nextSide.heroHp + heroHeal),
        shield: nextSide.shield + (role === "Défense" ? spec.rank : 0),
      };
      value = healed.healed + heroHeal;
      text += ` Le héros récupère ${heroHeal} PV et les alliés ${healed.healed} PV au total${role === "Défense" ? `, avec ${spec.rank} Bouclier` : ""}.`;
      break;
    }
    case "sabotage": {
      const constructs = [...(nextEnemy.constructs ?? [])];
      if (constructs.length) {
        const index = constructs.reduce(
          (best, current, i) => (current.hp > constructs[best].hp ? i : best),
          0,
        );
        const hit = constructs[index],
          damage = Math.min(spec.rank, hit.hp),
          remaining = hit.hp - damage;
        if (remaining <= 0) constructs.splice(index, 1);
        else constructs[index] = { ...hit, hp: remaining };
        nextEnemy = { ...nextEnemy, constructs };
        value = damage;
        text += ` ${hit.name} subit ${damage} dégâts de sabotage.`;
      } else {
        const targets = limit(enemyWeak),
          hit = damageBoard(nextEnemy.board, targets, spec.magnitude);
        nextEnemy = { ...nextEnemy, board: hit.board };
        value = hit.damage;
        text += ` ${targets.length} adversaire${targets.length > 1 ? "s sont touchés" : " est touché"}.`;
      }
      if (role === "Soutien") {
        nextSide = { ...nextSide, energy: nextSide.energy + 1 };
        text += " Le butin rend 1 énergie.";
      }
      break;
    }
    case "instinct": {
      const wounded = orderedIndexes(
        nextSide.board,
        (unit) => (unit.currentHp ?? unit.hp ?? 1) < (unit.hp ?? 1),
      );
      const targets = limit(wounded.length ? wounded : ownTargets);
      nextSide = {
        ...nextSide,
        board: buffBoard(
          nextSide.board,
          targets,
          spec.magnitude,
          role === "Défense" || spec.rank === 3 ? 1 : 0,
        ),
      };
      text += ` ${targets.length} allié${targets.length > 1 ? "s gagnent" : " gagne"} ${spec.magnitude} ATQ${role === "Défense" || spec.rank === 3 ? " et 1 PV" : ""}.`;
      break;
    }
  }

  if (role === "Attaque" && nextSide.board[slot]) {
    nextSide = {
      ...nextSide,
      board: buffBoard(nextSide.board, [slot], 1, 0),
    };
    text += " Son profil Attaque lui accorde aussi +1 ATQ.";
  } else if (role === "Défense") {
    nextSide = { ...nextSide, shield: nextSide.shield + 1 };
    text += " Son profil Défense ajoute 1 Bouclier.";
  } else if (role === "Soutien") {
    const weakest = orderedIndexes(nextSide.board, () => true).slice(0, 1),
      healed = healBoard(nextSide.board, weakest, 1);
    nextSide = { ...nextSide, board: healed.board };
    text += ` Son profil Soutien soigne ${healed.healed} PV supplémentaire.`;
  } else if (role === "Contrôle") {
    const strongest = orderedIndexes(nextEnemy.board, () => true, false).slice(
      0,
      1,
    );
    nextEnemy = {
      ...nextEnemy,
      board: buffBoard(nextEnemy.board, strongest, -1, 0),
    };
    text += ` Son profil Contrôle retire 1 ATQ à ${strongest.length ? "la cible la plus solide" : "aucune cible"}.`;
  }

  events.push({
    id: eventId(`rarity-${card.id}`, slot),
    lane: slot,
    type:
      spec.effect === "reaction" || spec.effect === "arcane"
        ? "area-damage"
        : spec.effect === "ambush"
          ? "debuff-atk"
          : "rarity-power",
    source,
    target: ["arcane", "ambush", "reaction", "sabotage"].includes(spec.effect)
      ? target
      : source,
    value,
    cardId: card.id,
    family: card.family,
    rarity: card.rarity,
    text,
  });
  return { side: nextSide, enemy: nextEnemy, events };
}

/**
 * Combinaisons de composition : elles s'ajoutent aux paliers de famille 3/5.
 * Un marqueur persistant empêche une cinématique ou une récompense de se répéter.
 */
export function resolveComboDeployments(
  side: BattleSideState,
  enemy: BattleSideState,
  source: "player" | "enemy",
) {
  let nextSide = withBattleDefaults(side),
    nextEnemy = withBattleDefaults(enemy);
  const target = source === "player" ? "enemy" : "player";
  const events: CombatEvent[] = [];
  const robots = alive(nextSide.board).filter(
    (card) => card.family === "Robots",
  );
  const robotDefense = robots.filter(
    (card) => roleOf(card) === "Défense",
  ).length;
  const robotAttack = robots.filter(
    (card) => roleOf(card) === "Attaque",
  ).length;
  if (
    robots.length >= 4 &&
    robotDefense >= 3 &&
    robotAttack >= 1 &&
    !nextSide.comboMarks!.includes("robot-pet-tank")
  ) {
    const construct: ArenaConstruct = {
      id: `pet-tank-${source}`,
      name: source === "player" ? "Pet Tank allié" : "Pet Tank rival",
      kind: "pet-tank",
      hp: 6,
      maxHp: 6,
      power: 2,
    };
    nextSide = {
      ...nextSide,
      constructs: [...nextSide.constructs!, construct],
      comboMarks: [...nextSide.comboMarks!, "robot-pet-tank"],
    };
    events.push({
      id: eventId("construct-summon", -1),
      lane: -1,
      type: "construct-summon",
      source,
      target: source,
      constructId: construct.id,
      value: construct.power,
      text: `Réseau complet : ${construct.name} apparaît avec 6 PV et un tir de puissance 2.`,
    });
  }
  const pirates = alive(nextSide.board).filter(
    (card) => card.family === "Pirates",
  ).length;
  if (pirates >= 4 && !nextSide.comboMarks!.includes("pirate-raid")) {
    nextSide = {
      ...nextSide,
      comboMarks: [...nextSide.comboMarks!, "pirate-raid"],
    };
    const targets = [...(nextEnemy.constructs ?? [])];
    if (targets.length) {
      const targetIndex = targets.reduce(
        (best, current, index) =>
          current.hp > targets[best].hp ? index : best,
        0,
      );
      const hit = targets[targetIndex],
        damage = Math.min(3, hit.hp),
        remaining = hit.hp - damage;
      if (remaining <= 0) targets.splice(targetIndex, 1);
      else targets[targetIndex] = { ...hit, hp: remaining };
      nextEnemy = { ...nextEnemy, constructs: targets };
      events.push({
        id: eventId("pirate-raid", -1),
        lane: -1,
        type: "pirate-raid",
        source,
        target,
        constructId: hit.id,
        value: damage,
        text: `Raid pirate : le navire traverse la zone adverse et inflige ${damage} dégâts à ${hit.name}${remaining <= 0 ? ", qui est détruit" : ""}.`,
      });
    } else {
      nextEnemy = { ...nextEnemy, heroHp: clampHp(nextEnemy.heroHp - 1) };
      events.push({
        id: eventId("pirate-raid", -1),
        lane: -1,
        type: "pirate-raid",
        source,
        target,
        value: 1,
        text: "Raid pirate : aucune construction à saboter, le navire inflige 1 dégât direct au héros adverse.",
      });
    }
  }
  const triggerFamilyCombo = (
    family: string,
    mark: string,
    title: string,
    text: string,
    eventTarget: "player" | "enemy" = source,
    value = 1,
  ) => {
    nextSide = {
      ...nextSide,
      comboMarks: [...nextSide.comboMarks!, mark],
    };
    events.push({
      id: eventId(`family-${mark}`, -1),
      lane: -1,
      type: "family-combo",
      source,
      target: eventTarget,
      value,
      family,
      text: `${title} — ${text}`,
    });
  };
  const comboReady = (family: string, mark: string) =>
    count(nextSide.board, family) >= 4 && !nextSide.comboMarks!.includes(mark);

  if (comboReady("Armée", "army-battle-order")) {
    const targets = orderedIndexes(nextSide.board, () => true);
    nextSide = {
      ...nextSide,
      board: buffBoard(nextSide.board, targets, 1, 1),
      shield: nextSide.shield + 2,
    };
    triggerFamilyCombo(
      "Armée",
      "army-battle-order",
      "Ordre de bataille",
      "tous les alliés gagnent +1 ATQ/+1 PV et le héros reçoit 2 Boucliers.",
      source,
      targets.length,
    );
  }
  if (comboReady("Magiciens", "mage-arcane-storm")) {
    const targets = orderedIndexes(nextEnemy.board, () => true),
      hit = damageBoard(nextEnemy.board, targets, 1);
    nextEnemy = { ...nextEnemy, board: hit.board };
    nextSide = { ...nextSide, energy: nextSide.energy + 1 };
    triggerFamilyCombo(
      "Magiciens",
      "mage-arcane-storm",
      "Tempête arcanique",
      `toute la ligne adverse subit 1 dégât (${hit.damage} au total) et 1 énergie est rendue.`,
      target,
      hit.damage,
    );
  }
  if (comboReady("Nobles", "noble-united-crown")) {
    const targets = orderedIndexes(nextSide.board, () => true);
    nextSide = {
      ...nextSide,
      board: buffBoard(nextSide.board, targets, 0, 1),
      shield: nextSide.shield + 3,
    };
    triggerFamilyCombo(
      "Nobles",
      "noble-united-crown",
      "Couronne unifiée",
      "tous les alliés gagnent +1 PV max et le héros reçoit 3 Boucliers.",
      source,
      targets.length,
    );
  }
  if (comboReady("Ombres", "shadow-total-night")) {
    const targets = orderedIndexes(nextEnemy.board, () => true, false).slice(
      0,
      2,
    );
    nextEnemy = {
      ...nextEnemy,
      board: buffBoard(nextEnemy.board, targets, -2, 0),
    };
    triggerFamilyCombo(
      "Ombres",
      "shadow-total-night",
      "Nuit totale",
      `${targets.length} unité${targets.length > 1 ? "s adverses perdent" : " adverse perd"} 2 ATQ.`,
      target,
      2,
    );
  }
  if (comboReady("Nature", "nature-great-bloom")) {
    const targets = orderedIndexes(nextSide.board, () => true),
      grown = buffBoard(nextSide.board, targets, 0, 1),
      healed = healBoard(grown, targets, 2);
    nextSide = { ...nextSide, board: healed.board };
    triggerFamilyCombo(
      "Nature",
      "nature-great-bloom",
      "Grande floraison",
      `tous les alliés gagnent +1 PV max et récupèrent jusqu’à 2 PV (${healed.healed} soignés).`,
      source,
      healed.healed,
    );
  }
  if (comboReady("Éléments", "elements-cataclysm")) {
    const targets = orderedIndexes(nextEnemy.board, () => true, false).slice(
        0,
        3,
      ),
      hit = damageBoard(nextEnemy.board, targets, 2);
    nextEnemy = { ...nextEnemy, board: hit.board };
    triggerFamilyCombo(
      "Éléments",
      "elements-cataclysm",
      "Cataclysme maîtrisé",
      `${targets.length} cible${targets.length > 1 ? "s subissent" : " subit"} 2 dégâts de zone (${hit.damage} au total).`,
      target,
      hit.damage,
    );
  }
  if (comboReady("Guérisseurs", "healers-great-miracle")) {
    const targets = orderedIndexes(nextSide.board, () => true),
      healed = healBoard(nextSide.board, targets, 2),
      before = nextSide.heroHp;
    nextSide = {
      ...nextSide,
      board: healed.board,
      heroHp: clampHp(nextSide.heroHp + 4),
    };
    const total = healed.healed + (nextSide.heroHp - before);
    triggerFamilyCombo(
      "Guérisseurs",
      "healers-great-miracle",
      "Grand miracle",
      `le héros récupère 4 PV et les alliés jusqu’à 2 PV (${total} soins effectifs).`,
      source,
      total,
    );
  }
  if (comboReady("Créatures", "creatures-primal-awakening")) {
    const creatures = orderedIndexes(
      nextSide.board,
      (unit) => unit.family === "Créatures",
    );
    nextSide = {
      ...nextSide,
      board: buffBoard(nextSide.board, creatures, 2, 1),
    };
    triggerFamilyCombo(
      "Créatures",
      "creatures-primal-awakening",
      "Éveil primal",
      "toutes les Créatures gagnent +2 ATQ et +1 PV.",
      source,
      creatures.length,
    );
  }
  return { side: nextSide, enemy: nextEnemy, events };
}
export function resolveLoreSides(
  player: BattleSideState,
  enemy: BattleSideState,
) {
  const sameP = applySameSideLore(player.board),
    sameE = applySameSideLore(enemy.board),
    op = applyOpponentLore(sameP.board, sameE.board);
  const bonds = [...sameP.triggered, ...sameE.triggered, ...op.triggered];
  const events: CombatEvent[] = bonds.map((bond: LoreBond) => ({
    id: eventId(`lore-${bond.id}`, -1),
    lane: -1,
    type: "lore",
    source: "player",
    target: "enemy",
    text: `Histoire — ${bond.title} : ${bond.story}`,
  }));
  return {
    player: { ...player, board: op.left },
    enemy: { ...enemy, board: op.right },
    events,
    bonds,
  };
}
function absorb(heroHp: number, shield: number, damage: number) {
  const blocked = Math.min(shield, damage);
  return {
    heroHp: clampHp(heroHp - (damage - blocked)),
    shield: shield - blocked,
    blocked,
    dealt: damage - blocked,
  };
}
export function resolveCombat(
  attacker: BattleSideState,
  defender: BattleSideState,
) {
  const lore = resolveLoreSides(attacker, defender),
    aBoard = cloneBoard(lore.player.board),
    dBoard = cloneBoard(lore.enemy.board);
  const frozenA = cloneBoard(aBoard),
    frozenD = cloneBoard(dBoard),
    aSnapshot = { ...attacker, board: frozenA },
    dSnapshot = { ...defender, board: frozenD };
  const aHealer = count(frozenA, "Guérisseurs") >= 5,
    dHealer = count(frozenD, "Guérisseurs") >= 5,
    aPirates3 = count(frozenA, "Pirates") >= 3,
    aPirates5 = count(frozenA, "Pirates") >= 5,
    dPirates3 = count(frozenD, "Pirates") >= 3,
    dPirates5 = count(frozenD, "Pirates") >= 5;
  let aHp = attacker.heroHp,
    dHp = defender.heroHp,
    aShield = attacker.shield,
    dShield = defender.shield,
    attackerKills = 0,
    defenderKills = 0,
    aSave = attacker.healerSaveUsed,
    dSave = defender.healerSaveUsed;
  const events = [...lore.events];
  for (let i = 0; i < 7; i++) {
    const a = aBoard[i],
      d = dBoard[i],
      fa = frozenA[i],
      fd = frozenD[i];
    if (a && d && fa && fd) {
      const rawA = effectiveAttack(fa, aSnapshot, dSnapshot),
        rawD = effectiveAttack(fd, dSnapshot, aSnapshot),
        dArmor = armorBonus(dSnapshot, fd),
        aArmor = armorBonus(aSnapshot, fa),
        aAtk = Math.max(0, rawA - dArmor),
        dAtk = Math.max(0, rawD - aArmor);
      events.push({
        id: eventId("clash", i),
        lane: i,
        type: "clash",
        source: "player",
        target: "enemy",
        text: `Ligne ${i + 1} : ${a.name} affronte ${d.name}.`,
      });
      if (dArmor > 0 && rawA > aAtk)
        events.push({
          id: eventId("armor-e", i),
          lane: i,
          type: "armor",
          source: "enemy",
          target: "enemy",
          value: rawA - aAtk,
          cardId: d.id,
          text: `Formation réduit de ${rawA - aAtk} les dégâts reçus par ${d.name}.`,
        });
      if (aArmor > 0 && rawD > dAtk)
        events.push({
          id: eventId("armor-p", i),
          lane: i,
          type: "armor",
          source: "player",
          target: "player",
          value: rawD - dAtk,
          cardId: a.id,
          text: `Formation réduit de ${rawD - dAtk} les dégâts reçus par ${a.name}.`,
        });
      a.currentHp = (a.currentHp ?? 1) - dAtk;
      d.currentHp = (d.currentHp ?? 1) - aAtk;
      events.push(
        {
          id: eventId("damage-e", i),
          lane: i,
          type: "unit-damage",
          source: "player",
          target: "enemy",
          value: aAtk,
          cardId: d.id,
          text: `${d.name} subit ${aAtk} dégâts.`,
        },
        {
          id: eventId("damage-p", i),
          lane: i,
          type: "unit-damage",
          source: "enemy",
          target: "player",
          value: dAtk,
          cardId: a.id,
          text: `${a.name} subit ${dAtk} dégâts.`,
        },
      );
      if ((d.currentHp ?? 0) <= 0) {
        if (dHealer && !dSave) {
          d.currentHp = 1;
          dSave = true;
          events.push({
            id: eventId("save-e", i),
            lane: i,
            type: "unit-saved",
            source: "enemy",
            target: "enemy",
            cardId: d.id,
            text: `Sanctuaire sauve ${d.name} à 1 PV.`,
          });
        } else {
          dBoard[i] = null;
          attackerKills++;
          events.push({
            id: eventId("destroy-e", i),
            lane: i,
            type: "unit-destroyed",
            source: "player",
            target: "enemy",
            cardId: d.id,
            text: `${d.name} est éliminé.`,
          });
        }
      }
      if ((a.currentHp ?? 0) <= 0) {
        if (aHealer && !aSave) {
          a.currentHp = 1;
          aSave = true;
          events.push({
            id: eventId("save-p", i),
            lane: i,
            type: "unit-saved",
            source: "player",
            target: "player",
            cardId: a.id,
            text: `Sanctuaire sauve ${a.name} à 1 PV.`,
          });
        } else {
          aBoard[i] = null;
          defenderKills++;
          events.push({
            id: eventId("destroy-p", i),
            lane: i,
            type: "unit-destroyed",
            source: "enemy",
            target: "player",
            cardId: a.id,
            text: `${a.name} est éliminé.`,
          });
        }
      }
    } else if (a && fa) {
      const power = effectiveAttack(fa, aSnapshot, dSnapshot),
        r = absorb(dHp, dShield, power);
      dHp = r.heroHp;
      dShield = r.shield;
      if (r.blocked)
        events.push({
          id: eventId("shield-e", i),
          lane: i,
          type: "shield-block",
          source: "player",
          target: "enemy",
          value: r.blocked,
          text: `Le bouclier adverse absorbe ${r.blocked} dégâts.`,
        });
      if (r.dealt)
        events.push({
          id: eventId("direct-e", i),
          lane: i,
          type: "direct-hit",
          source: "player",
          target: "enemy",
          value: r.dealt,
          cardId: a.id,
          text: `${a.name} inflige ${r.dealt} dégâts directs.`,
        });
    } else if (d && fd) {
      const power = effectiveAttack(fd, dSnapshot, aSnapshot),
        r = absorb(aHp, aShield, power);
      aHp = r.heroHp;
      aShield = r.shield;
      if (r.blocked)
        events.push({
          id: eventId("shield-p", i),
          lane: i,
          type: "shield-block",
          source: "enemy",
          target: "player",
          value: r.blocked,
          text: `Ton bouclier absorbe ${r.blocked} dégâts.`,
        });
      if (r.dealt)
        events.push({
          id: eventId("direct-p", i),
          lane: i,
          type: "direct-hit",
          source: "enemy",
          target: "player",
          value: r.dealt,
          cardId: d.id,
          text: `${d.name} inflige ${r.dealt} dégâts directs.`,
        });
    }
  }
  const prevAM = attacker.momentum,
    prevDM = defender.momentum;
  let nextA = {
      ...attacker,
      board: aBoard,
      heroHp: aHp,
      shield: aShield,
      healerSaveUsed: aSave,
      momentum: Math.min(
        5,
        Math.max(
          0,
          attacker.momentum + (attackerKills ? 1 : 0) - (defenderKills ? 1 : 0),
        ),
      ),
    },
    nextD = {
      ...defender,
      board: dBoard,
      heroHp: dHp,
      shield: dShield,
      healerSaveUsed: dSave,
      momentum: Math.min(
        5,
        Math.max(
          0,
          defender.momentum + (defenderKills ? 1 : 0) - (attackerKills ? 1 : 0),
        ),
      ),
    };
  if (nextA.momentum !== prevAM)
    events.push({
      id: eventId("momentum-p", -1),
      lane: -1,
      type: "momentum",
      source: "player",
      target: "player",
      value: nextA.momentum - prevAM,
      text: `Momentum joueur : ${nextA.momentum}/5.`,
    });
  if (nextD.momentum !== prevDM)
    events.push({
      id: eventId("momentum-e", -1),
      lane: -1,
      type: "momentum",
      source: "enemy",
      target: "enemy",
      value: nextD.momentum - prevDM,
      text: `Momentum rival : ${nextD.momentum}/5.`,
    });
  if (attackerKills && aPirates3) {
    nextA.energy += 1;
    events.push({
      id: eventId("pirate-energy-p", -1),
      lane: -1,
      type: "energy",
      source: "player",
      target: "player",
      value: 1,
      text: "Butin rend 1 énergie.",
    });
    if (aPirates5 && !nextA.pirateDrawUsed) {
      const r = drawCard(nextA, "player", "Butin");
      nextA = { ...r.side, pirateDrawUsed: true };
      events.push(r.event);
    }
  }
  if (defenderKills && dPirates3) {
    nextD.energy += 1;
    events.push({
      id: eventId("pirate-energy-e", -1),
      lane: -1,
      type: "energy",
      source: "enemy",
      target: "enemy",
      value: 1,
      text: "Butin adverse rend 1 énergie.",
    });
    if (dPirates5 && !nextD.pirateDrawUsed) {
      const r = drawCard(nextD, "enemy", "Butin adverse");
      nextD = { ...r.side, pirateDrawUsed: true };
      events.push(r.event);
    }
  }
  return {
    attacker: nextA,
    defender: nextD,
    attackerKills,
    defenderKills,
    events,
  };
}
function healNatureUnits(
  side: BattleSideState,
  target: "player" | "enemy",
  events: CombatEvent[],
) {
  if (count(side.board, "Nature") < 3) return side;
  const board = side.board.map((c, lane) => {
    if (!c) return null;
    const before = c.currentHp ?? c.hp ?? 1,
      max = c.hp ?? 1,
      after = Math.min(max, before + 1);
    if (after > before)
      events.push({
        id: eventId(`nature-${target}`, lane),
        lane,
        type: "heal",
        source: target,
        target,
        value: after - before,
        cardId: c.id,
        text: `${c.name} récupère ${after - before} PV grâce à Nature.`,
      });
    return { ...c, currentHp: after };
  });
  return { ...side, board };
}
export function resolveEndTurn(side: BattleSideState, enemy: BattleSideState) {
  const own = endTurnHeroDelta(side),
    opp = endTurnHeroDelta(enemy),
    events: CombatEvent[] = [];
  const sideHpBefore = side.heroHp,
    enemyHpBefore = enemy.heroHp;
  let nextSide = { ...side, heroHp: clampHp(side.heroHp + own.heal) },
    nextEnemy = { ...enemy, heroHp: clampHp(enemy.heroHp + opp.heal) };
  if (nextSide.heroHp > sideHpBefore)
    events.push({
      id: eventId("heal-p", -1),
      lane: -1,
      type: "heal",
      source: "player",
      target: "player",
      value: nextSide.heroHp - sideHpBefore,
      text: `Tu récupères ${nextSide.heroHp - sideHpBefore} PV.`,
    });
  if (nextEnemy.heroHp > enemyHpBefore)
    events.push({
      id: eventId("heal-e", -1),
      lane: -1,
      type: "heal",
      source: "enemy",
      target: "enemy",
      value: nextEnemy.heroHp - enemyHpBefore,
      text: `Le rival récupère ${nextEnemy.heroHp - enemyHpBefore} PV.`,
    });
  const hitEnemy = absorb(nextEnemy.heroHp, nextEnemy.shield, own.enemyDamage);
  nextEnemy = {
    ...nextEnemy,
    heroHp: hitEnemy.heroHp,
    shield: hitEnemy.shield,
  };
  const hitSide = absorb(nextSide.heroHp, nextSide.shield, opp.enemyDamage);
  nextSide = { ...nextSide, heroHp: hitSide.heroHp, shield: hitSide.shield };
  if (hitEnemy.blocked)
    events.push({
      id: eventId("end-shield-e", -1),
      lane: -1,
      type: "shield-block",
      source: "player",
      target: "enemy",
      value: hitEnemy.blocked,
      text: `Le bouclier adverse absorbe ${hitEnemy.blocked} dégâts de synergie.`,
    });
  if (hitSide.blocked)
    events.push({
      id: eventId("end-shield-p", -1),
      lane: -1,
      type: "shield-block",
      source: "enemy",
      target: "player",
      value: hitSide.blocked,
      text: `Ton bouclier absorbe ${hitSide.blocked} dégâts de synergie.`,
    });
  if (hitEnemy.dealt)
    events.push({
      id: eventId("end-hit-e", -1),
      lane: -1,
      type: "direct-hit",
      source: "player",
      target: "enemy",
      value: hitEnemy.dealt,
      text: `Une synergie inflige ${hitEnemy.dealt} dégâts directs au rival.`,
    });
  if (hitSide.dealt)
    events.push({
      id: eventId("end-hit-p", -1),
      lane: -1,
      type: "direct-hit",
      source: "enemy",
      target: "player",
      value: hitSide.dealt,
      text: `Une synergie adverse t’inflige ${hitSide.dealt} dégâts directs.`,
    });
  nextSide = healNatureUnits(nextSide, "player", events);
  nextEnemy = healNatureUnits(nextEnemy, "enemy", events);
  if (count(nextSide.board, "Nobles") >= 5) {
    const before = nextSide.shield;
    nextSide = { ...nextSide, shield: Math.max(nextSide.shield, 3) };
    if (nextSide.shield > before)
      events.push({
        id: eventId("nobles-shield-p", -1),
        lane: -1,
        type: "shield-gain",
        source: "player",
        target: "player",
        value: nextSide.shield - before,
        text: `Cour royale confère ${nextSide.shield - before} point${nextSide.shield - before > 1 ? "s" : ""} de bouclier.`,
      });
  }
  if (count(nextEnemy.board, "Nobles") >= 5) {
    const before = nextEnemy.shield;
    nextEnemy = { ...nextEnemy, shield: Math.max(nextEnemy.shield, 3) };
    if (nextEnemy.shield > before)
      events.push({
        id: eventId("nobles-shield-e", -1),
        lane: -1,
        type: "shield-gain",
        source: "enemy",
        target: "enemy",
        value: nextEnemy.shield - before,
        text: `Cour royale adverse confère ${nextEnemy.shield - before} point${nextEnemy.shield - before > 1 ? "s" : ""} de bouclier.`,
      });
  }
  const playerConstructs = nextSide.constructs ?? [],
    enemyConstructs = nextEnemy.constructs ?? [];
  const playerPower = playerConstructs.reduce(
      (total, construct) => total + construct.power,
      0,
    ),
    enemyPower = enemyConstructs.reduce(
      (total, construct) => total + construct.power,
      0,
    );
  if (playerPower > 0) {
    const hit = absorb(nextEnemy.heroHp, nextEnemy.shield, playerPower);
    nextEnemy = { ...nextEnemy, heroHp: hit.heroHp, shield: hit.shield };
    events.push({
      id: eventId("construct-fire-p", -1),
      lane: -1,
      type: "construct-fire",
      source: "player",
      target: "enemy",
      value: hit.dealt,
      constructId: playerConstructs[0]?.id,
      text: `Le Pet Tank allié tire à puissance ${playerPower}${hit.blocked ? ` ; ${hit.blocked} bloqué${hit.blocked > 1 ? "s" : ""}` : ""}.`,
    });
  }
  if (enemyPower > 0) {
    const hit = absorb(nextSide.heroHp, nextSide.shield, enemyPower);
    nextSide = { ...nextSide, heroHp: hit.heroHp, shield: hit.shield };
    events.push({
      id: eventId("construct-fire-e", -1),
      lane: -1,
      type: "construct-fire",
      source: "enemy",
      target: "player",
      value: hit.dealt,
      constructId: enemyConstructs[0]?.id,
      text: `Le Pet Tank rival tire à puissance ${enemyPower}${hit.blocked ? ` ; ${hit.blocked} bloqué${hit.blocked > 1 ? "s" : ""}` : ""}.`,
    });
  }
  return { side: nextSide, enemy: nextEnemy, events };
}
export function momentumLabel(value: number) {
  if (value >= 5) return "RENVERSEMENT";
  if (value >= 3) return "PRESSION";
  if (value >= 1) return "RÉACTION";
  return "STABLE";
}
