import { useState } from "react";
import { GameAsset } from "./GameAsset";
import { NoAdsOffer } from "./NoAdsOffer";
import type { Progression } from "./data/progression";
import type { MonetizationState } from "./data/monetization";
import { BOOSTER_PACKS } from "./data/boosterPacks";
import { ECONOMY } from "./data/economy";

export function PortraitShop({
  progress,
  onBuy,
  onOpen,
  monetization,
}: {
  progress: Progression;
  onBuy: () => boolean;
  onOpen: () => void;
  monetization: MonetizationState;
}) {
  const [tab, setTab] = useState<"boosters" | "offers">("boosters");
  const [message, setMessage] = useState("");
  const [selectedPack, setSelectedPack] = useState(0);
  const pack = BOOSTER_PACKS[selectedPack];
  return (
    <section className="portrait-shop" aria-label="Boutique du royaume">
      <div className="shop-tabs" role="group" aria-label="Rayons">
        <button
          aria-pressed={tab === "boosters"}
          onClick={() => setTab("boosters")}
        >
          Boosters
        </button>
        <button
          aria-pressed={tab === "offers"}
          onClick={() => setTab("offers")}
        >
          Offres
        </button>
      </div>
      {tab === "boosters" ? (
        <>
          <div className="portrait-shop-stage">
            <span className="shop-edition">{pack.edition}</span>
            <GameAsset
              assetId={pack.id}
              className="portrait-shop-pack"
              loading="eager"
            />
          </div>
          <div
            className="shop-pack-picker"
            role="group"
            aria-label="Choisir une collection de booster"
          >
            {BOOSTER_PACKS.map((choice, index) => (
              <button
                key={choice.id}
                aria-pressed={selectedPack === index}
                onClick={() => setSelectedPack(index)}
              >
                <GameAsset assetId={choice.id} decorative />
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
          <div className="portrait-shop-description">
            <h2>{pack.label}</h2>
            <p>12 cartes · 8 communes · 3 rares · 1 épique ou légendaire</p>
            <small>
              {pack.subtitle} · Les cartes rejoignent directement ta collection
              après l’ouverture.
            </small>
            <details className="shop-odds">
              <summary>Voir les chances</summary>
              <p>
                Les 11 premiers emplacements sont fixes : 8 communes et 3 rares.
                Le dernier emplacement contient une épique à 85 % ou une
                légendaire à 15 %.
              </p>
            </details>
          </div>
          <button
            className="portrait-gold-button shop-buy"
            disabled={progress.coins < ECONOMY.standardBoosterCoins}
            onClick={() =>
              setMessage(
                onBuy()
                  ? `Booster ${pack.label} ajouté à ton inventaire.`
                  : "Pas assez de pièces.",
              )
            }
          >
            <GameAsset assetId="icon.coins" decorative />
            <span>Acheter · {ECONOMY.standardBoosterCoins} pièces</span>
          </button>
          {progress.coins < ECONOMY.standardBoosterCoins && (
            <p className="shop-budget-note">
              Il te manque {ECONOMY.standardBoosterCoins - progress.coins}{" "}
              pièces.
            </p>
          )}
          <button className="shop-owned-packs" onClick={onOpen}>
            Ouvrir mes boosters <strong>{progress.sealedBoosters}</strong>
            <span aria-hidden="true">›</span>
          </button>
        </>
      ) : (
        <div className="portrait-shop-offers">
          <NoAdsOffer state={monetization} />
          <p>
            Les achats mobiles ne sont pas encore connectés. Aucun paiement
            n’est effectué ici.
          </p>
        </div>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
