import { cards as baseCards, families, rarities, type CardData, type Rarity } from './cards';

const healer = (id:string,name:string,rarity:Rarity,cost:number,atk:number,hp:number,flavor:string):CardData => ({
  id,
  name,
  family:'Guérisseurs',
  rarity,
  type:'Héros',
  cost,
  atk,
  hp,
  flavor,
  sourceSheet:'chatgpt-image-7-sept.-2026-15_03_15.webp',
  assetPath:`/assets/cards/guérisseurs/${id}.webp`
});

export const healerCards: CardData[] = [
  healer('hea-001','Apprentie Soigneuse','Commune',1,1,2,'Petits soins, grands cœurs.'),
  healer('hea-002','Aide-Sanctuaire','Commune',2,2,2,'Toujours là pour toi.'),
  healer('hea-003','Prêtresse Lumière','Rare',3,3,4,'La foi guérit au-delà des blessures.'),
  healer('hea-004','Frère Protecteur','Rare',3,3,4,'Un bouclier pour chaque vie.'),
  healer('hea-005','Oracle Bienveillante','Épique',4,4,5,'Elle voit la souffrance, et y répond.'),
  healer('hea-006','Grand Guérisseur','Épique',4,4,6,'Plus qu’un soin, un espoir.'),
  healer('hea-007','Ange Gardien','Légendaire',5,5,8,'Tant qu’il reste de la lumière.'),
  healer('hea-008','Saint Protecteur','Légendaire',5,5,9,'Soigner. Guider. Jamais abandonner.')
];

// Remplace l'ancien mini-échantillon Guérisseurs par la série complète réellement générée.
export const cards: CardData[] = [
  ...baseCards.filter((card) => card.family !== 'Guérisseurs'),
  ...healerCards
];

export { families, rarities };
export type { CardData, Rarity };
