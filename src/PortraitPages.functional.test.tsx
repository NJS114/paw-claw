import {render,screen,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe,it,expect,vi} from 'vitest';
import {GameNavigation} from './GameNavigation';
import {PortraitShop} from './PortraitShop';
import {CardArtwork} from './CardArtwork';
import {cards} from './data/gameCards';
import {loadMonetization} from './data/monetization';
const progress={coins:1240,gems:120,xp:40,level:12,wins:8,losses:4,draws:1,boostersOpened:6,sealedBoosters:2};

describe('Portrait pages',()=>{
 it('offers five named destinations and marks the current page',async()=>{
  const go=vi.fn();render(<GameNavigation screen="collection" onNavigate={go}/>);
  expect(screen.getAllByRole('button')).toHaveLength(5);
  expect(screen.getByRole('button',{name:'Collection'})).toHaveAttribute('aria-current','page');
  for(const name of ['Accueil','Collection','Combat','Decks','Boutique'])await userEvent.click(screen.getByRole('button',{name}));
  expect(go.mock.calls.map(x=>x[0])).toEqual(['home','collection','battle','deck','shop']);
 });
 it('connects the real booster purchase and owned pack actions',async()=>{
  const buy=vi.fn(()=>true),open=vi.fn();render(<PortraitShop progress={progress} onBuy={buy} onOpen={open} monetization={loadMonetization()}/>);
  expect(screen.getByRole('button',{name:/Guérisseurs Émeraude/})).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button',{name:/Guérisseurs Émeraude/}));
  expect(screen.getByRole('heading',{name:'Guérisseurs Émeraude'})).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button',{name:/Acheter/}));expect(buy).toHaveBeenCalledOnce();
  expect(screen.getByRole('status')).toHaveTextContent(/Booster Guérisseurs Émeraude ajouté/);
  await userEvent.click(screen.getByRole('button',{name:/Ouvrir mes boosters/}));expect(open).toHaveBeenCalledOnce();
 });
 it('disables purchases with insufficient currency and keeps unpaid offers explicit',async()=>{
  const buy=vi.fn(()=>false);render(<PortraitShop progress={{...progress,coins:80}} onBuy={buy} onOpen={()=>{}} monetization={loadMonetization()}/>);
  expect(screen.getByRole('button',{name:/Acheter/})).toBeDisabled();expect(screen.getByText(/Il te manque 20/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button',{name:'Offres'}));
  expect(screen.getByText(/Aucun paiement/)).toBeInTheDocument();expect(buy).not.toHaveBeenCalled();
 });
 it('shows an honest placeholder rather than a wrong family sheet when card art fails',()=>{
  const card={...cards[0],assetPath:'/assets/cards/test.webp'};render(<CardArtwork card={card}/>);
  fireEvent.error(screen.getByRole('img',{name:card.name}));
  expect(screen.getByRole('img',{name:`Illustration à venir : ${card.name}`})).toBeInTheDocument();
 });
});
