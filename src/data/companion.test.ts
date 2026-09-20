import { describe, expect, it } from "vitest";
import { companionStats, rarityForLevel, unlockedPowers } from "./companion";

describe("player companion progression", () => {
  it("evolves from common to legendary on explicit level gates", () => {
    expect([1, 10, 20, 35].map(rarityForLevel)).toEqual([
      "Commune",
      "Rare",
      "Épique",
      "Légendaire",
    ]);
  });

  it("unlocks stronger family powers without losing the base talent", () => {
    expect(unlockedPowers("Robots", 1).map((power) => power.unlocked)).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(unlockedPowers("Robots", 35).every((power) => power.unlocked)).toBe(true);
    expect(unlockedPowers("Robots", 35)[3].description).toMatch(/Pet Tank/);
  });

  it("adapts card stats to the chosen family role", () => {
    expect(companionStats(12, "Armée").health).toBeGreaterThan(
      companionStats(12, "Éléments").health,
    );
    expect(companionStats(12, "Éléments").attack).toBeGreaterThan(
      companionStats(12, "Armée").attack,
    );
  });
});
