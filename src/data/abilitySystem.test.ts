import { describe, expect, it } from "vitest";
import { deployAbilityFor, rarityRank } from "./abilitySystem";
import type { CardData } from "./cards";

const base: Pick<CardData, "family" | "rarity"> = {
  family: "Éléments",
  rarity: "Commune",
};

describe("rarity ability scaling", () => {
  it("increases scope and magnitude at each designed rarity band", () => {
    const common = deployAbilityFor(base, "Attaque");
    const rare = deployAbilityFor({ ...base, rarity: "Rare" }, "Attaque");
    const epic = deployAbilityFor({ ...base, rarity: "Épique" }, "Attaque");
    const legendary = deployAbilityFor(
      { ...base, rarity: "Légendaire" },
      "Attaque",
    );

    expect(common.active).toBe(false);
    expect(rare.targetCount).toBe(1);
    expect(epic.targetCount).toBe(2);
    expect(legendary.targetCount).toBe(7);
    expect(legendary.magnitude).toBeGreaterThan(epic.magnitude);
  });

  it("maps all four rarities to stable ranks", () => {
    expect([
      rarityRank("Commune"),
      rarityRank("Rare"),
      rarityRank("Épique"),
      rarityRank("Légendaire"),
    ]).toEqual([0, 1, 2, 3]);
  });
});
