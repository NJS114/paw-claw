import type {FrameAtlas} from '../FrameSequence';

// Only register card-specific, reviewed image sequences. Never animate a still
// by translating/rotating it, or borrow another character's sequence.
export const CARD_ANIMATIONS:Record<string,FrameAtlas> = {
 'mag-007': {src:'/assets/animations/archimage-character-v2.webp',backgroundSrc:'/assets/animations/archimage-background-v2.webp',columns:4,rows:2,durations:[2000,120,100,140,140,100,120,1000]},
};
