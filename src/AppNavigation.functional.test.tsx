import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('Android back navigation', () => {
  it('closes the inspected card first, then returns to the kingdom, then permits minimizing', async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Collection/ }));
    await user.click(screen.getAllByRole('button', { name: /^Voir / })[0]);
    const closeCard = new Event('paw-back', { cancelable: true });
    fireEvent(window, closeCard);
    expect(closeCard.defaultPrevented).toBe(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Galerie royale' })).toBeInTheDocument();
    const returnHome = new Event('paw-back', { cancelable: true });
    fireEvent(window, returnHome);
    expect(returnHome.defaultPrevented).toBe(true);
    expect(screen.getByRole('region', { name: 'Accueil Paw & Claw' })).toBeInTheDocument();
    const minimize = new Event('paw-back', { cancelable: true });
    fireEvent(window, minimize);
    expect(minimize.defaultPrevented).toBe(false);
  });
});
