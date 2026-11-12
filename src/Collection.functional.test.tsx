import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Collection } from './Collection';
import { cards } from './data/gameCards';

describe('Collection browsing', () => {
  it('recovers from an empty combined search without changing ownership', async () => {
    const user = userEvent.setup();
    const owned = { [cards[0].id]: 2 };
    render(<Collection owned={owned} />);
    await user.click(screen.getByRole('button', { name: 'Possédées' }));
    expect(screen.getAllByRole('button', { name: /^Voir / })).toHaveLength(1);
    await user.type(screen.getByRole('textbox', { name: 'Rechercher une carte' }), 'introuvable');
    expect(screen.getByText('Aucune carte trouvée')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Afficher toutes les cartes' }));
    expect(screen.getAllByRole('button', { name: /^Voir / })).toHaveLength(cards.length);
    expect(screen.getByRole('button', { name: 'Possédées' })).toHaveAttribute('aria-pressed', 'false');
    expect(owned).toEqual({ [cards[0].id]: 2 });
  });

  it('searches without accents and sorts by cost and rarity', async () => {
    const user = userEvent.setup();
    render(<Collection owned={{}} />);
    const search = screen.getByRole('textbox', { name: 'Rechercher une carte' });
    await user.type(search, '  arcaniste elementaire  ');
    expect(screen.getByRole('button', { name: 'Voir Arcaniste Élémentaire' })).toBeInTheDocument();
    await user.clear(search);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Trier par' }), 'cost');
    const byCost = [...cards].sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name, 'fr'));
    expect(screen.getAllByRole('button', { name: /^Voir / }).map(button => button.getAttribute('aria-label'))).toEqual(byCost.map(card => `Voir ${card.name}`));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Trier par' }), 'rarity');
    const firstLegendary = cards.filter(card => card.rarity === 'Légendaire').sort((a,b) => a.name.localeCompare(b.name, 'fr'))[0];
    expect(screen.getAllByRole('button', { name: /^Voir / })[0]).toHaveAccessibleName(`Voir ${firstLegendary.name}`);
  });

  it('contains keyboard focus and restores it after Escape or backdrop dismissal', async () => {
    const user = userEvent.setup();
    render(<Collection owned={{}} />);
    const trigger = screen.getAllByRole('button', { name: /^Voir / })[0];
    await user.click(trigger);
    const close = screen.getByRole('button', { name: 'Fermer' });
    expect(close).toHaveFocus();
    await user.tab(); expect(close).toHaveFocus();
    await user.tab({ shift: true }); expect(close).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).not.toBe('hidden');
    await user.click(trigger);
    await user.click(screen.getByRole('dialog').parentElement!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
