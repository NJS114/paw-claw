import { describe, expect, it } from "vitest";
import { getCharacterProfile, profilesFor } from "./characterDesign";
import { cards } from "./gameCards";

describe("character design profiles", () => {
  it("provides a complete skill and evolution profile for every hero", () => {
    const profiles = profilesFor(cards);
    expect(profiles.length).toBeGreaterThan(0);
    for (const { profile } of profiles) {
      expect(profile.passive.description.length).toBeGreaterThan(20);
      expect(profile.signature.description.length).toBeGreaterThan(20);
      expect(profile.rarityAbility.description.length).toBeGreaterThan(20);
      expect(profile.comboHint.length).toBeGreaterThan(20);
      expect(profile.evolution.map((step) => step.level)).toEqual([
        1, 3, 5, 7, 10,
      ]);
    }
  });

  it("documents the requested robot recipe", () => {
    const robot = cards.find((card) => card.family === "Robots")!;
    expect(getCharacterProfile(robot).comboHint).toContain(
      "3 Défense + 1 Attaque",
    );
  });
});
