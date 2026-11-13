import { Component, type ReactNode } from 'react';

export class GameBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="game-recovery" role="alert"><h1>Le royaume fait une pause</h1><p>Le jeu a rencontré un problème. Recharge-le pour reprendre depuis la dernière sauvegarde.</p><button onClick={() => window.location.reload()}>Relancer le jeu</button></section>;
    return this.props.children;
  }
}
