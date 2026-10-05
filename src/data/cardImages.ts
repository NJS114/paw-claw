// Généré automatiquement par scripts/import-cards.mjs — ne pas modifier à la main.
export interface CardImage { full: string; thumb: string; landscape: boolean }

export const CARD_IMAGES: Record<string, CardImage> = {
  'chef-01-verso': { full: '/assets/cards/v2/chef-01-verso.webp', thumb: '/assets/cards/v2/thumbs/chef-01-verso.webp', landscape: false },
  'chef-01': { full: '/assets/cards/v2/chef-01.webp', thumb: '/assets/cards/v2/thumbs/chef-01.webp', landscape: false },
  'mag-001': { full: '/assets/cards/v2/mag-001.webp', thumb: '/assets/cards/v2/thumbs/mag-001.webp', landscape: false },
  'mag-002': { full: '/assets/cards/v2/mag-002.webp', thumb: '/assets/cards/v2/thumbs/mag-002.webp', landscape: false },
  'mag-003': { full: '/assets/cards/v2/mag-003.webp', thumb: '/assets/cards/v2/thumbs/mag-003.webp', landscape: false },
  'mag-004': { full: '/assets/cards/v2/mag-004.webp', thumb: '/assets/cards/v2/thumbs/mag-004.webp', landscape: false },
  'mag-005': { full: '/assets/cards/v2/mag-005.webp', thumb: '/assets/cards/v2/thumbs/mag-005.webp', landscape: false },
  'mag-006': { full: '/assets/cards/v2/mag-006.webp', thumb: '/assets/cards/v2/thumbs/mag-006.webp', landscape: false },
  'mag-007': { full: '/assets/cards/v2/mag-007.webp', thumb: '/assets/cards/v2/thumbs/mag-007.webp', landscape: false },
  'mag-008': { full: '/assets/cards/v2/mag-008.webp', thumb: '/assets/cards/v2/thumbs/mag-008.webp', landscape: false },
  'mag-009': { full: '/assets/cards/v2/mag-009.webp', thumb: '/assets/cards/v2/thumbs/mag-009.webp', landscape: false },
  'mag-010': { full: '/assets/cards/v2/mag-010.webp', thumb: '/assets/cards/v2/thumbs/mag-010.webp', landscape: false },
  'mag-011': { full: '/assets/cards/v2/mag-011.webp', thumb: '/assets/cards/v2/thumbs/mag-011.webp', landscape: false },
  'mag-012': { full: '/assets/cards/v2/mag-012.webp', thumb: '/assets/cards/v2/thumbs/mag-012.webp', landscape: false },
  'mag-u01': { full: '/assets/cards/v2/mag-u01.webp', thumb: '/assets/cards/v2/thumbs/mag-u01.webp', landscape: false },
  'mag-u02': { full: '/assets/cards/v2/mag-u02.webp', thumb: '/assets/cards/v2/thumbs/mag-u02.webp', landscape: false },
  'mag-u03': { full: '/assets/cards/v2/mag-u03.webp', thumb: '/assets/cards/v2/thumbs/mag-u03.webp', landscape: true },
  'tn-012': { full: '/assets/cards/v2/tn-012.webp', thumb: '/assets/cards/v2/thumbs/tn-012.webp', landscape: false },
  'tn-014': { full: '/assets/cards/v2/tn-014.webp', thumb: '/assets/cards/v2/thumbs/tn-014.webp', landscape: false },
};

export const cardImageFor = (id: string): CardImage | undefined => CARD_IMAGES[id];
