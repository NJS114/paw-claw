import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CompanionStudio } from "./CompanionStudio";
import { DEFAULT_COMPANION } from "./data/companion";

describe("CompanionStudio", () => {
  it("creates a personalized puppy card and exposes its family progression", async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(
      <CompanionStudio companion={DEFAULT_COMPANION} level={12} onSave={save} />,
    );

    expect(screen.getAllByText("Rare")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Chiot" }));
    await user.clear(screen.getByRole("textbox", { name: "Nom" }));
    await user.type(screen.getByRole("textbox", { name: "Nom" }), "Nova");
    await user.selectOptions(screen.getByRole("combobox", { name: "Groupe" }), "Pirates");
    await user.selectOptions(screen.getByRole("combobox", { name: "Race" }), "Shiba");
    await user.click(screen.getByRole("button", { name: "Créer ma carte" }));

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Nova", species: "Chiot", race: "Shiba", family: "Pirates" }),
    );
    await user.click(screen.getByRole("button", { name: "Compétences" }));
    expect(screen.getByText(/Navire envahisseur/)).toBeInTheDocument();
    expect(screen.getByText(/Prochaine évolution : Épique au niveau 20/)).toBeInTheDocument();
  });
});
