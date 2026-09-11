export type Locale='fr'|'en';
const dictionaries={
 fr:{home:'Accueil',battle:'Combat',boosters:'Boosters',collection:'Collection',deck:'Decks',balance:'Équilibrage',stories:'Histoires',shop:'Boutique',profile:'Profil',assets:'Assets',tagline:'Différentes âmes. Même arène.',level:'Niveau',cards:'Cartes',coins:'Pièces',storiesTitle:'Histoires',storiesIntro:'Les liens entre les personnages façonnent le destin de la guerre entre Chats et Chiens.',allStories:'Toutes les histoires',effect:'Effet en jeu',seeCards:'Voir les cartes',cat:'Chat',dog:'Chien',language:'Langue'},
 en:{home:'Home',battle:'Battle',boosters:'Boosters',collection:'Collection',deck:'Decks',balance:'Balance',stories:'Stories',shop:'Shop',profile:'Profile',assets:'Assets',tagline:'Different souls. Same arena.',level:'Level',cards:'Cards',coins:'Coins',storiesTitle:'Stories',storiesIntro:'Character bonds shape the fate of the war between Cats and Dogs.',allStories:'All stories',effect:'In-game effect',seeCards:'View cards',cat:'Cat',dog:'Dog',language:'Language'}
} as const;
export type TranslationKey=keyof typeof dictionaries.fr;
export const t=(locale:Locale,key:TranslationKey)=>dictionaries[locale][key]??dictionaries.fr[key];
export function loadLocale():Locale{try{return localStorage.getItem('paw-claw.locale')==='en'?'en':'fr'}catch{return'fr'}}
export function saveLocale(locale:Locale){try{localStorage.setItem('paw-claw.locale',locale)}catch{}}
