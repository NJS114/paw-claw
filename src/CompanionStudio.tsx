import { useMemo, useState, type CSSProperties } from "react";
import { GameAsset } from "./GameAsset";
import {
  COMPANION_COLORS,
  COMPANION_FAMILIES,
  COMPANION_OUTFITS,
  COMPANION_RACES,
  FAMILY_POWERS,
  companionStats,
  nextEvolution,
  rarityForLevel,
  unlockedPowers,
  type PlayerCompanion,
} from "./data/companion";

type StudioTab = "appearance" | "skills" | "profile";

export function CompanionStudio({
  companion,
  level,
  onSave,
}: {
  companion: PlayerCompanion;
  level: number;
  onSave: (companion: PlayerCompanion) => void;
}) {
  const [draft, setDraft] = useState(companion);
  const [tab, setTab] = useState<StudioTab>("appearance");
  const [saved, setSaved] = useState(false);
  const [affection, setAffection] = useState(0);
  const rarity = rarityForLevel(level);
  const stats = companionStats(level, draft.family);
  const evolution = nextEvolution(level);
  const powers = useMemo(
    () => unlockedPowers(draft.family, level),
    [draft.family, level],
  );
  const color = COMPANION_COLORS.find((entry) => entry.id === draft.color)!;
  const cardStyle = { "--companion-color": color.value } as CSSProperties;

  function update(next: Partial<PlayerCompanion>) {
    setDraft((current) => ({ ...current, ...next }));
    setSaved(false);
  }

  function changeSpecies(species: PlayerCompanion["species"]) {
    update({ species, race: COMPANION_RACES[species][0] });
  }

  function save() {
    const clean = {
      ...draft,
      name: draft.name.trim().slice(0, 18) || "Braisou",
      createdAt: draft.createdAt || Date.now(),
    };
    setDraft(clean);
    onSave(clean);
    setSaved(true);
  }

  return (
    <section className="companion-studio" style={cardStyle} aria-label="Mon compagnon">
      <div className="companion-scene" aria-label={`Carte de ${draft.name}`}>
        <div className={`companion-card rarity-${rarity.toLowerCase().replace("é", "e")}`}>
          <div className="companion-card-head">
            <span className="companion-level">{level}</span>
            <div>
              <strong>{draft.name || "Mon compagnon"}</strong>
              <small>{draft.family} · {FAMILY_POWERS[draft.family].role}</small>
            </div>
            <span className="companion-rarity">{rarity}</span>
          </div>
          <div className="companion-portrait">
            <span className="companion-aura" />
            <GameAsset
              assetId={draft.species === "Chat" ? "lobby.hero-cat" : "lobby.hero-dog"}
              loading="eager"
            />
            <span className={`outfit-mark outfit-${COMPANION_OUTFITS.indexOf(draft.outfit)}`} aria-hidden="true">
              {draft.outfit === "Cape royale" ? "CR" : draft.outfit === "Tenue de pirate" ? "PI" : draft.outfit === "Atelier robot" ? "RO" : "PC"}
            </span>
          </div>
          <div className="companion-card-foot">
            <span><small>ATQ</small><b>{stats.attack}</b></span>
            <span><small>PV</small><b>{stats.health}</b></span>
            <span><small>COÛT</small><b>{stats.cost}</b></span>
          </div>
        </div>
        <button
          className="companion-hug"
          onClick={() => setAffection((value) => value + 1)}
          aria-label={`Faire un câlin à ${draft.name}`}
        >
          <GameAsset assetId="icon.health" decorative />
          <span>{affection ? `Câlin ×${affection}` : "Câlin"}</span>
        </button>
        <div className="companion-evolution-meter">
          <span><b>{rarity}</b> · Niveau {level}</span>
          {evolution ? (
            <>
              <progress value={level} max={evolution.level} aria-label="Progression vers la prochaine rareté" />
              <small>Prochaine évolution : {evolution.rarity} au niveau {evolution.level}</small>
            </>
          ) : (
            <small>Évolution légendaire accomplie</small>
          )}
        </div>
      </div>

      <div className="companion-sheet">
        <nav className="companion-tabs" aria-label="Personnalisation du compagnon">
          <button aria-current={tab === "appearance" ? "page" : undefined} onClick={() => setTab("appearance")}>Apparence</button>
          <button aria-current={tab === "skills" ? "page" : undefined} onClick={() => setTab("skills")}>Compétences</button>
          <button aria-current={tab === "profile" ? "page" : undefined} onClick={() => setTab("profile")}>Profil</button>
        </nav>

        {tab === "appearance" && (
          <div className="companion-panel companion-creator">
            <div className="creator-title">
              <div><small>CARTE PERSONNELLE</small><h2>Crée ton héros</h2></div>
              <span>Unique</span>
            </div>
            <label className="creator-name">Nom<input value={draft.name} maxLength={18} onChange={(event) => update({ name: event.target.value })} /></label>
            <div className="creator-species" aria-label="Espèce">
              <button aria-pressed={draft.species === "Chat"} onClick={() => changeSpecies("Chat")}>Chat</button>
              <button aria-pressed={draft.species === "Chiot"} onClick={() => changeSpecies("Chiot")}>Chiot</button>
            </div>
            <div className="creator-grid">
              <label>Race<select value={draft.race} onChange={(event) => update({ race: event.target.value })}>{COMPANION_RACES[draft.species].map((race) => <option key={race}>{race}</option>)}</select></label>
              <label>Groupe<select value={draft.family} onChange={(event) => update({ family: event.target.value as PlayerCompanion["family"] })}>{COMPANION_FAMILIES.map((family) => <option key={family}>{family}</option>)}</select></label>
              <label className="creator-outfit">Tenue<select value={draft.outfit} onChange={(event) => update({ outfit: event.target.value as PlayerCompanion["outfit"] })}>{COMPANION_OUTFITS.map((outfit) => <option key={outfit}>{outfit}</option>)}</select></label>
            </div>
            <fieldset className="creator-colors"><legend>Couleur de carte</legend><div>{COMPANION_COLORS.map((entry) => <button key={entry.id} aria-label={entry.label} aria-pressed={draft.color === entry.id} style={{ background: entry.value }} onClick={() => update({ color: entry.id })} />)}</div></fieldset>
            <div className="family-preview"><span>{draft.family}</span><strong>{FAMILY_POWERS[draft.family].role}</strong><p>{FAMILY_POWERS[draft.family].passive}</p></div>
            <button className="companion-save" onClick={save}>{saved ? "Carte enregistrée ✓" : "Créer ma carte"}</button>
          </div>
        )}

        {tab === "skills" && (
          <div className="companion-panel">
            <div className="creator-title"><div><small>GROUPE {draft.family.toUpperCase()}</small><h2>Compétences</h2></div><span>{FAMILY_POWERS[draft.family].role}</span></div>
            <div className="power-list">{powers.map((power) => <article key={power.level} className={power.unlocked ? "unlocked" : "locked"}><span>{power.unlocked ? "OUVERT" : `NIV. ${power.level}`}</span><div><small>NIV. {power.level} · {power.rarity}</small><strong>{power.name}</strong><p>{power.description}</p></div></article>)}</div>
          </div>
        )}

        {tab === "profile" && (
          <div className="companion-panel">
            <div className="creator-title"><div><small>JOURNAL DU REFUGE</small><h2>{draft.name}</h2></div><span>{draft.species}</span></div>
            <dl className="companion-bio"><div><dt>Race</dt><dd>{draft.race}</dd></div><div><dt>Groupe</dt><dd>{draft.family}</dd></div><div><dt>Tenue</dt><dd>{draft.outfit}</dd></div><div><dt>Rareté</dt><dd>{rarity}</dd></div></dl>
            <div className="companion-story"><strong>Notre rencontre</strong><p>Tu as rencontré {draft.name} aux portes du Royaume. Depuis, votre lien fait évoluer sa carte et révèle de nouvelles compétences.</p></div>
            <div className="companion-stats"><span><b>{stats.attack}</b> ATQ</span><span><b>{stats.health}</b> PV</span><span><b>{affection}</b> Câlins</span></div>
          </div>
        )}
      </div>
    </section>
  );
}
