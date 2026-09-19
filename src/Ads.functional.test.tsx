import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdsProvider, AdPrivacyOptions, BattleAdActions, DailyAdBonus } from './ads/AdPlacements';
import { claimAdBonus, loadProgression } from './data/progression';
import { loadMonetization } from './data/monetization';

const mock = vi.hoisted(() => ({
  snapshot: { supported: true, busy: false, privacyRequired: true },
  showReward: vi.fn(), showBetweenMatches: vi.fn(), preloadInterstitial: vi.fn(),
  recordMatch: vi.fn(), privacyOptions: vi.fn(), start: vi.fn(),
}));
vi.mock('./ads/admob', () => ({ ads: { ...mock, getSnapshot: () => mock.snapshot, subscribe: () => () => {} } }));
beforeEach(() => {
  vi.clearAllMocks();
  mock.snapshot = { supported: true, busy: false, privacyRequired: true };
  mock.showBetweenMatches.mockResolvedValue('unavailable');
  mock.privacyOptions.mockResolvedValue(true);
});
function Fixture({ next = () => {} }: { next?: () => void }) {
  const [progress, setProgress] = useState(loadProgression);
  return <AdsProvider monetization={loadMonetization()} claims={progress.adRewardClaims} onReward={key => setProgress(p => claimAdBonus(p, key, 50))}>
    <output aria-label="Solde">{progress.coins}</output><DailyAdBonus/><BattleAdActions matchId="42" onContinue={next}/><AdPrivacyOptions/>
  </AdsProvider>;
}
describe('Ad placements', () => {
  it('credits exactly one advertised reward even if the callback repeats and disables the claimed offer', async () => {
    mock.showReward.mockImplementation(async (earned: () => void) => { earned(); earned(); return 'earned'; });
    render(<Fixture/>);
    fireEvent.click(screen.getAllByRole('button', { name: 'Voir la vidéo · +50 pièces' })[0]);
    await waitFor(() => expect(screen.getByLabelText('Solde')).toHaveTextContent('1290'));
    expect(screen.getByRole('button', { name: 'Bonus récupéré' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Voir la vidéo · +50 pièces' })).toHaveLength(1);
  });
  it('does not give coins when no ad is available and permits a retry', async () => {
    mock.showReward.mockResolvedValue('unavailable'); render(<Fixture/>);
    fireEvent.click(screen.getAllByRole('button', { name: 'Voir la vidéo · +50 pièces' })[0]);
    expect(await screen.findByText(/Aucune vidéo disponible/)).toBeInTheDocument();
    expect(screen.getByLabelText('Solde')).toHaveTextContent('1240');
    expect(screen.getAllByRole('button', { name: 'Voir la vidéo · +50 pièces' })[0]).toBeEnabled();
  });
  it('waits for ad dismissal before starting the next battle and rejects double clicks', async () => {
    let close!: () => void;
    mock.showBetweenMatches.mockImplementation(() => new Promise<void>(resolve => { close = resolve; }));
    const next = vi.fn(); render(<Fixture next={next}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Nouvelle partie' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nouvelle partie' }));
    expect(next).not.toHaveBeenCalled(); expect(mock.showBetweenMatches).toHaveBeenCalledOnce();
    await act(async () => close()); expect(next).toHaveBeenCalledOnce();
  });
  it('hides native advertising actions on the website but keeps the game playable', async () => {
    mock.snapshot = { supported: false, busy: false, privacyRequired: false };
    const next = vi.fn(); render(<Fixture next={next}/>);
    expect(screen.queryByRole('button', { name: /Voir la vidéo/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /confidentialité/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Nouvelle partie' }));
    await waitFor(() => expect(next).toHaveBeenCalledOnce());
  });
  it('opens the native privacy choices from the visible settings button', async () => {
    render(<Fixture/>);
    fireEvent.click(screen.getByRole('button', { name: 'Choix de confidentialité publicitaire' }));
    await waitFor(() => expect(mock.privacyOptions).toHaveBeenCalledOnce());
  });
});
