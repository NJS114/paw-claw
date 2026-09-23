import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import {DeckStudio} from './DeckStudio';
import {cards} from './data/gameCards';
import {starterDeck} from './data/deck';
import {loadDeckLibrary} from './data/deckLibrary';

it('edits existing cards, persists the deck and validates without launching a battle',()=>{
 localStorage.clear();
 const owned=Object.fromEntries(cards.map(c=>[c.id,3]));
 const deck=starterDeck(cards,owned),play=vi.fn();
 render(<DeckStudio owned={owned} activeDeck={deck} onActiveDeckChange={vi.fn()} onPlay={play}/>);
 const card=cards.find(c=>c.id===deck.cardIds[0])!;
 fireEvent.click(screen.getAllByRole('button',{name:`Retirer ${card.name}`})[0]);
 expect(screen.getByRole('button',{name:'Valider le deck'})).toBeDisabled();
 expect(loadDeckLibrary().decks[0].cardIds).toHaveLength(19);
 fireEvent.click(screen.getByRole('tab',{name:/Collection/}));
 fireEvent.click(screen.getByRole('button',{name:`Ajouter ${card.name}`}));
 expect(loadDeckLibrary().decks[0].cardIds).toHaveLength(20);
 fireEvent.click(screen.getByRole('button',{name:'Valider le deck'}));
 expect(screen.getByRole('status')).toHaveTextContent('Deck validé');
 expect(play).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Combattre avec ce deck'}));
 expect(play).toHaveBeenCalledOnce();
});
