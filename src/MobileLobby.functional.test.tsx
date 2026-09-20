import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileLobby } from "./MobileLobby";
import type { Progression } from "./data/progression";

const progress: Progression = {
  coins: 1240,
  gems: 120,
  essence: 200,
  xp: 40,
  level: 12,
  wins: 8,
  losses: 4,
  draws: 1,
  boostersOpened: 6,
  sealedBoosters: 2,
};

describe("MobileLobby", () => {
  it("uses real mission progress and sends rewards to the existing claim screen", async () => {
    const go = vi.fn();
    const missions = {
      version: 2 as const,
      dailyKey: "2026-09-15",
      weeklyKey: "2026-09-14",
      counts: { "daily-play-3": 2 },
      claimed: [] as string[],
    };
    const { rerender } = render(
      <MobileLobby
        progress={progress}
        ownedCount={16}
        missions={missions}
        onNavigate={go}
      />,
    );
    expect(
      screen.getByRole("progressbar", {
        name: "Progression de la quête du jour",
      }),
    ).toHaveAttribute("value", "2");
    expect(
      screen.queryByRole("button", { name: /Récupérer la récompense/ }),
    ).not.toBeInTheDocument();
    rerender(
      <MobileLobby
        progress={progress}
        ownedCount={16}
        missions={{ ...missions, counts: { "daily-play-3": 3 } }}
        onNavigate={go}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Récupérer la récompense/ }),
    );
    expect(go).toHaveBeenCalledWith("progression");
    rerender(
      <MobileLobby
        progress={progress}
        ownedCount={16}
        missions={{
          ...missions,
          counts: { "daily-play-3": 3 },
          claimed: ["daily-play-3"],
        }}
        onNavigate={go}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Récompense récupérée/ }),
    ).toBeInTheDocument();
  });
  it("loads the local-time portrait artwork with the heroes playing together", () => {
    const hours = vi.spyOn(Date.prototype, "getHours").mockReturnValue(12);
    const { container } = render(
      <MobileLobby
        progress={progress}
        ownedCount={148}
        onNavigate={() => {}}
      />,
    );
    expect(container.querySelector(".mobile-lobby")).toHaveAttribute(
      "data-lobby-period",
      "day",
    );
    expect(container.querySelector(".mobile-lobby-bg")).toHaveAttribute(
      "src",
      "/assets/backgrounds/bg-lobby-day-royal-activity-v7.webp",
    );
    expect(
      container.querySelector(".lobby-character-stage"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".button-copy")).not.toBeInTheDocument();
    expect(screen.queryByText("Festival lunaire")).not.toBeInTheDocument();
    hours.mockRestore();
  });
  it("retains the previous background if the new asset fails to load", () => {
    const hours = vi.spyOn(Date.prototype, "getHours").mockReturnValue(12);
    const { container } = render(
      <MobileLobby
        progress={progress}
        ownedCount={148}
        onNavigate={() => {}}
      />,
    );
    const background = container.querySelector(".mobile-lobby-bg")!;
    fireEvent.error(background);
    expect(background).toHaveAttribute(
      "src",
      "/assets/backgrounds/bg-lobby-day-v2.webp",
    );
    hours.mockRestore();
  });
  it("uses the quiet back-facing scene at night", () => {
    const hours = vi.spyOn(Date.prototype, "getHours").mockReturnValue(22);
    const { container } = render(
      <MobileLobby
        progress={progress}
        ownedCount={148}
        onNavigate={() => {}}
      />,
    );
    expect(container.querySelector(".mobile-lobby")).toHaveAttribute(
      "data-lobby-period",
      "night",
    );
    expect(container.querySelector(".mobile-lobby-bg")).toHaveAttribute(
      "src",
      "/assets/backgrounds/bg-lobby-night-back-v7.webp",
    );
    hours.mockRestore();
  });
  it("keeps deck and reward actions interactive", async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    render(
      <MobileLobby progress={progress} ownedCount={148} onNavigate={go} />,
    );
    await user.click(screen.getByRole("button", { name: /Decks/i }));
    await user.click(
      screen.getByRole("button", { name: "Voir les récompenses" }),
    );
    expect(go.mock.calls.map((call) => call[0])).toEqual([
      "deck",
      "progression",
    ]);
  });
  it("shows mobile-game player resources and collection count", () => {
    render(
      <MobileLobby
        progress={progress}
        ownedCount={148}
        onNavigate={() => {}}
      />,
    );
    expect(screen.getByText("Niveau 12")).toBeInTheDocument();
    expect(screen.getByText("1240")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText(/148 cartes/)).toBeInTheDocument();
    expect(screen.getByText(/2 disponibles/)).toBeInTheDocument();
  });

  it("routes primary play and collection actions", async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    render(
      <MobileLobby progress={progress} ownedCount={148} onNavigate={go} />,
    );
    await user.click(screen.getByRole("button", { name: /JOUER/i }));
    expect(go).toHaveBeenCalledWith("battle");
    await user.click(screen.getByRole("button", { name: /Collection/i }));
    expect(go).toHaveBeenCalledWith("collection");
  });

  it("exposes profile, progression, booster and shop shortcuts", async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    render(
      <MobileLobby progress={progress} ownedCount={148} onNavigate={go} />,
    );
    await user.click(screen.getByRole("button", { name: "Ouvrir le profil" }));
    await user.click(screen.getByRole("button", { name: /Missions/i }));
    await user.click(screen.getByRole("button", { name: /^Boosters/i }));
    await user.click(screen.getByRole("button", { name: /Boutique/i }));
    expect(go.mock.calls.map((call) => call[0])).toEqual(
      expect.arrayContaining(["profile", "progression", "boosters", "shop"]),
    );
  });
});
