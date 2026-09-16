import type { CardData } from './cards';

type CardVisualIdentity=Pick<CardData,'assetPath'|'species'|'breed'>;

/** Curated full-body art progressively replaces automated sheet crops. */
export const CARD_VISUAL_OVERRIDES:Record<string,CardVisualIdentity>={
 'mag-002':{assetPath:'/assets/card-art/v1/mag-002-etudiant-beagle.webp',species:'Chien',breed:'Beagle'},
 'mag-007':{assetPath:'/assets/card-art/v1/mag-007-archimage-persan.webp',species:'Chat',breed:'Persan'},
 'omb-005':{assetPath:'/assets/card-art/v1/omb-005-lame-dobermann.webp',species:'Chien',breed:'Dobermann'},
 'nob-008':{assetPath:'/assets/card-art/v1/nob-008-reine-cavalier.webp',species:'Chien',breed:'Cavalier King Charles'},
 'rob-009':{assetPath:'/assets/card-art/v1/rob-009-chevalier-shiba.webp',species:'Chien',breed:'Shiba Inu'},
 'nat-007':{assetPath:'/assets/card-art/v1/nat-007-sage-maine-coon.webp',species:'Chat',breed:'Maine Coon'},
};
