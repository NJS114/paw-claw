export type Rarity = 'Commune' | 'Rare' | 'Épique' | 'Légendaire';
export type CardType = 'Héros' | 'Événement' | 'Objet' | 'Zone' | 'Soutien' | 'Énergie' | 'Compagnon';

export type CardData = {
  id: string;
  name: string;
  family: string;
  rarity: Rarity;
  type: CardType;
  cost: number;
  atk?: number;
  hp?: number;
  flavor?: string;
  sourceSheet?: string;
  assetPath?: string;
};

const hero = (id:string,name:string,family:string,rarity:Rarity,cost:number,atk:number,hp:number,flavor?:string,sourceSheet?:string):CardData => ({id,name,family,rarity,type:'Héros',cost,atk,hp,flavor,sourceSheet,assetPath:`/assets/cards/${family.toLowerCase()}/${id}.webp`});
const utility = (id:string,name:string,family:string,rarity:Rarity,type:CardType,cost:number,flavor?:string,sourceSheet?:string):CardData => ({id,name,family,rarity,type,cost,flavor,sourceSheet,assetPath:`/assets/cards/${family.toLowerCase()}/${id}.webp`});

export const cards: CardData[] = [
  hero('mag-001','Apprenti Sorcier','Magiciens','Commune',1,1,2,'Chaque grand mage a été un débutant.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-002','Étudiant Curieux','Magiciens','Commune',2,2,2,'Les questions d’aujourd’hui sont les sorts de demain.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-003','Arcaniste Élémentaire','Magiciens','Rare',3,3,3,'Il comprend le langage des éléments.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-004','Bibliothécaire','Magiciens','Rare',3,3,4,'Le savoir n’a pas de limites.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-005','Mage des Glaces','Magiciens','Épique',4,4,5,'Elle fige le temps pour mieux protéger.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-006','Grand Invocateur','Magiciens','Épique',4,4,5,'Il fait danser les flammes avec loyauté.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-007','Archimage Céleste','Magiciens','Légendaire',5,5,6,'Il veille sur l’équilibre des mondes.','Galerie des Magiciens de Paw & Claw.png'),
  hero('mag-008','Maître des Arcanes','Magiciens','Légendaire',5,5,7,'Certaines vérités devraient rester cachées.','Galerie des Magiciens de Paw & Claw.png'),

  hero('omb-001','Apprenti de l’Ombre','Ombres','Commune',1,1,2,'Observer. Apprendre. Attendre.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-002','Espion Discret','Ombres','Commune',2,2,2,'Ce qui n’est pas vu n’est pas pris.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-003','Voleur Agile','Ombres','Commune',2,2,3,'Toujours plus vite que la lumière.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-004','Messager Nocturne','Ombres','Commune',2,2,3,'L’ombre est son terrain de jeu.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-005','Lame Silencieuse','Ombres','Rare',3,3,4,'Un geste. Une fin.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-006','Ninja des Toits','Ombres','Rare',3,3,4,'Toujours au-dessus du danger.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-007','Danseur de l’Ombre','Ombres','Épique',4,4,5,'Il disparaît avant même d’attaquer.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-008','Marionnettiste','Ombres','Épique',4,4,5,'Tout le monde danse un jour.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-009','Seigneur des Ravens','Ombres','Épique',5,5,6,'Ses yeux voient ce que d’autres ignorent.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-010','Reine des Ombres','Ombres','Légendaire',6,6,8,'Elle règne là où tout s’efface.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-011','Faucheur Masqué','Ombres','Légendaire',6,6,8,'La fin arrive toujours dans le silence.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-012','Esprit Vengeur','Ombres','Légendaire',6,6,9,'Même morts, ils la suivent.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-013','Maîtresse du Néant','Ombres','Légendaire',7,7,10,'Elle efface les noms et les souvenirs.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-014','Karhl l’Ombre','Ombres','Légendaire',7,7,10,'Trois formes. Un seul esprit.','Collection de cartes : Ombres nocturnes.png'),
  hero('omb-015','Le Voile Éternel','Ombres','Légendaire',7,7,10,'Tout commence et finit dans l’ombre.','Collection de cartes : Ombres nocturnes.png'),
  utility('omb-u01','Énergie d’Ombre','Ombres','Commune','Énergie',0,'Fournit 1 point d’énergie Ombre.','Cartes Paw & Claw dans l’ombre.png'),
  utility('omb-u02','Âmes Errantes','Ombres','Rare','Énergie',0,'Fournit 2 points d’énergie Ombre.','Cartes Paw & Claw dans l’ombre.png'),
  utility('omb-u03','Château des Ombres','Ombres','Rare','Zone',2,'Vos héros Ombre gagnent en discrétion.','Cartes Paw & Claw dans l’ombre.png'),
  utility('omb-u04','Toits de Minuit','Ombres','Rare','Zone',2,'Vos héros Ombre gagnent +1 en vitesse.','Cartes Paw & Claw dans l’ombre.png'),
  utility('omb-u05','Disparition','Ombres','Rare','Événement',2,'Retirez un héros du combat pour ce tour.','Cartes Paw & Claw dans l’ombre.png'),
  utility('omb-u06','Lames Jumelles','Ombres','Épique','Objet',3,'Le héros équipé gagne +2 en attaque.','Collection nocturne Paw & Claw Ombres.png'),
  utility('omb-u07','Amulette des Âmes','Ombres','Épique','Objet',3,'Récupérez 2 PV sur un héros Ombre.','Collection nocturne Paw & Claw Ombres.png'),
  utility('omb-u08','Pacte des Ombres','Ombres','Légendaire','Événement',5,'Sacrifiez un héros pour en invoquer un autre sans payer son coût.','Collection nocturne Paw & Claw Ombres.png'),

  hero('nob-001','Jeune Noble','Nobles','Commune',1,1,2,'De grands rêves pour demain.','Nobles de Paw & Claw(1).png'),
  hero('nob-002','Écuyer Royal','Nobles','Commune',1,1,2,'Apprend aujourd’hui pour mieux servir demain.','Nobles de Paw & Claw(1).png'),
  hero('nob-003','Apprentie Courtisane','Nobles','Commune',1,1,2,'Les mots rapprochent plus que les armes.','Nobles de Paw & Claw(1).png'),
  hero('nob-004','Chambellan','Nobles','Commune',2,2,3,'L’ordre fait la grandeur.','Nobles de Paw & Claw(1).png'),
  hero('nob-005','Comtesse Élégante','Nobles','Épique',4,4,5,'La grâce est une forme de pouvoir.','Nobles : Royaume des Compagnons.png'),
  hero('nob-006','Chevalier Royal','Nobles','Épique',4,4,5,'Toujours en première ligne.','Nobles : Royaume des Compagnons.png'),
  hero('nob-007','Roi Karhl','Nobles','Légendaire',5,5,6,'Trois cœurs. Un seul royaume.','Nobles : Royaume des Compagnons.png'),
  hero('nob-008','Reine Bienveillante','Nobles','Légendaire',5,5,7,'La véritable grandeur protège les autres.','Nobles : Royaume des Compagnons.png'),
  hero('nob-009','Régent Impérial','Nobles','Légendaire',5,5,8,'Un royaume, un cap, pour les générations futures.','Nobles de Paw & Claw.png'),
  hero('nob-010','Héritier des Lumières','Nobles','Légendaire',6,6,8,'Le passé nous inspire, l’avenir nous appartient.','Nobles de Paw & Claw.png'),
  hero('nob-011','Champion du Royaume','Nobles','Légendaire',6,6,8,'Pour son peuple. Toujours.','Nobles de Paw & Claw.png'),
  hero('nob-012','Impératrice Éternelle','Nobles','Légendaire',6,6,9,'Les royaumes changent, les valeurs demeurent.','Nobles de Paw & Claw.png'),
  hero('nob-013','Karhl le Sage','Nobles','Légendaire',7,7,10,'Trois âmes. Un seul héritage.','Nobles de Paw & Claw.png'),

  hero('rob-001','Apprenti Ingénieur','Robots','Commune',1,1,2,'Petits circuits, grands rêves.','Galerie de cartes Robots futuristes.png'),
  hero('rob-002','Mécanicien Novice','Robots','Commune',2,2,2,'Toujours prêt à réparer.','Galerie de cartes Robots futuristes.png'),
  hero('rob-003','Chien Éclaireur','Robots','Rare',3,3,4,'Il ouvre la voie pour les autres.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-004','Chat Arcaniste','Robots','Rare',3,3,4,'La technologie au service de la lumière.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-005','Chien Paladin','Robots','Rare',4,4,5,'Un cœur de métal, une loyauté éternelle.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-006','Chat Assassin','Robots','Rare',3,4,3,'Silencieux mais toujours à tes côtés.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-007','Chat Ingénieur','Robots','Rare',3,3,4,'Des idées au bout des pattes.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-008','Reine Mécanique','Robots','Épique',4,4,6,'Une vision plus douce pour tous.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-009','Chevalier Automate','Robots','Épique',4,4,6,'Il se dresse pour ceux qu’il aime.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-010','Oracle Robotique','Robots','Épique',5,5,7,'Elle calcule, anticipe et croit en demain.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-011','Ange Mécanique','Robots','Légendaire',6,6,8,'Elle éclaire les chemins même dans l’ombre.','Groupe Robots — Collection Paw & Claw.png'),
  hero('rob-012','Roi Automate','Robots','Légendaire',6,6,9,'Un royaume plus juste pour toutes les pattes.','Groupe Robots — Collection Paw & Claw.png'),

  hero('nat-001','Apprenti des Forêts','Nature','Commune',1,1,2,'La forêt lui apprend chaque jour.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-002','Éclaireur Verdoyant','Nature','Commune',1,1,2,'Toujours un sentier d’avance.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-003','Cueilleuse de Fleurs','Nature','Commune',1,1,2,'Elle connaît chaque parfum.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-004','Promeneur des Bois','Nature','Commune',1,1,3,'Aucun chemin ne lui fait peur.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-005','Archer Feuillu','Nature','Commune',2,2,3,'Sa flèche suit le vent.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-006','Druide en Herbe','Nature','Commune',2,2,3,'Chaque pousse est une promesse.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-007','Sage de la Nature','Nature','Rare',2,2,4,'Il entend ce que disent les racines.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-008','Garde des Clairières','Nature','Rare',2,3,3,'Rien ne trouble son territoire.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-009','Chanteuse des Vents','Nature','Rare',3,3,4,'Le vent répond à sa voix.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-010','Soigneur des Plantes','Nature','Rare',3,2,5,'Chaque feuille peut devenir un remède.','Cartes Nature : Héros de la Forêt.png'),
  hero('nat-011','Druide des Saisons','Nature','Épique',3,3,5,'Il unit toutes les formes de vie.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-012','Floraison Éternelle','Nature','Épique',3,3,6,'La beauté renaît toujours.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-013','Ancien Ent','Nature','Épique',4,4,7,'Il se souvient de tout.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-014','Colosse de la Nature','Nature','Épique',4,4,8,'Lentement, il fait grandir la vie.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-015','Dragon de Gaïa','Nature','Légendaire',5,5,9,'Toute vie est reliée.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-016','Esprit du Monde','Nature','Légendaire',5,5,10,'Les racines d’aujourd’hui bâtissent demain.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-017','Phénix Végétal','Nature','Légendaire',5,5,9,'Chaque fin nourrit un nouveau départ.','Cartes fantastiques Nature : vie et harmonie.png'),
  hero('nat-018','Titan des Forêts','Nature','Légendaire',5,5,10,'La terre se lève avec lui.','Cartes fantastiques Nature : vie et harmonie.png'),

  hero('cre-001','Chaton Dragon','Créatures','Commune',1,1,2,'Une petite flamme sommeille en lui.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-002','Chiot Cerf','Créatures','Commune',1,1,2,'Curieux de tout, il explore sans peur.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-003','Chat Sorcier','Créatures','Commune',1,1,2,'Il imite les grands avec sérieux.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-004','Chiot Angélique','Créatures','Commune',2,2,2,'Toujours là pour ses amis.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-005','Chat Chauve-souris','Créatures','Rare',2,2,3,'Discret mais toujours présent.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-006','Chat Renard','Créatures','Rare',2,2,3,'Rapide comme un souffle.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-007','Chat Sirène','Créatures','Rare',3,3,4,'Il suit le courant de ses rêves.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-008','Chiot Chevalier','Créatures','Rare',3,3,4,'Fidèle et courageux.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-009','Chiot Démon','Créatures','Épique',4,4,5,'Une grande force dort en lui.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-010','Chat Griffon','Créatures','Épique',4,4,5,'Il voit plus loin que les autres.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-011','Chat Kitsune','Créatures','Épique',4,4,5,'Mille visages, un seul cœur.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-012','Chiot Golem','Créatures','Épique',4,4,6,'Il protège sans jamais se lasser.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-013','Chat Phénix','Créatures','Légendaire',5,5,7,'Il renaît toujours plus fort.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-014','Chat Céleste','Créatures','Légendaire',5,5,8,'Sa présence apaise tous les cœurs.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-015','Chat Dragon Astral','Créatures','Légendaire',5,5,8,'Son regard traverse les mondes.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-016','Chiot Ancestral','Créatures','Légendaire',6,6,9,'Il porte la mémoire des forêts.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-017','Chat Léviathan','Créatures','Légendaire',6,6,9,'Les océans lui obéissent.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-018','Chat Gardien du Temps','Créatures','Légendaire',7,7,10,'Il veille sur tous les royaumes.','Collection de cartes Créatures Paw & Claw.png'),
  hero('cre-019','Chiot Titan','Créatures','Légendaire',7,7,10,'Une légende parmi les créatures.','Collection de cartes Créatures Paw & Claw.png'),
  utility('cre-u01','Œuf Mystérieux','Créatures','Commune','Objet',1,'Piochez une créature au hasard.','Collection de cartes Créatures Paw & Claw.png'),
  utility('cre-u02','Friandise','Créatures','Commune','Objet',1,'Soigne 2 PV d’une de vos créatures.','Collection de cartes Créatures Paw & Claw.png'),
  utility('cre-u03','Appel des Créatures','Créatures','Rare','Événement',2,'Piochez 2 créatures.','Collection de cartes Créatures Paw & Claw.png'),
  utility('cre-u04','Clairière Féérique','Créatures','Rare','Zone',2,'Vos créatures gagnent +1 PV.','Collection de cartes Créatures Paw & Claw.png'),

  hero('elm-001','Sirène Polaire','Éléments','Épique',3,3,5,'Même la glace a une âme.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-002','Titan de Pierre','Éléments','Épique',3,3,6,'Solide aujourd’hui, toujours demain.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-003','Aile Céleste','Éléments','Épique',3,3,5,'Au-delà des nuages, la liberté.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-004','Phénix des Flammes','Éléments','Épique',4,4,7,'Renaît toujours plus fort.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-005','Dragon des Flots','Éléments','Épique',4,4,7,'Les océans lui obéissent.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-006','Ancien des Forêts','Éléments','Épique',4,4,8,'Ses racines touchent le temps.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-007','Seigneur des Tempêtes','Éléments','Épique',4,4,7,'Le ciel est son domaine.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-008','Solaire Éternel','Éléments','Légendaire',5,5,9,'Sa lumière réchauffe tous les royaumes.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-009','Souverain des Océans','Éléments','Légendaire',5,5,9,'Calme ou colère, il règne.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-010','Esprit du Monde','Éléments','Légendaire',5,5,10,'Tout est lié.','Cartes fantastiques des quatre éléments.png'),
  hero('elm-011','Dragon du Zéphyr','Éléments','Légendaire',5,5,10,'Traverse le ciel et le temps.','Cartes fantastiques des quatre éléments.png'),

  hero('hea-001','Spécialiste des Urgences','Guérisseurs','Épique',4,4,6,'Rapidité, calme, efficacité.','Cartes de soins fantastiques Paw & Claw.png'),
  hero('hea-002','Ange Gardien','Guérisseurs','Légendaire',5,5,8,'Il écoute, il soigne, il protège.','Cartes de soins fantastiques Paw & Claw.png')
];

export const families = ['Tous','Armée','Magiciens','Nobles','Ombres','Robots','Nature','Éléments','Guérisseurs','Pirates','Créatures'] as const;
export const rarities = ['Toutes','Commune','Rare','Épique','Légendaire'] as const;
