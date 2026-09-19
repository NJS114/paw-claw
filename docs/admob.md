# Google AdMob — Paw & Claw

L’intégration utilise Capacitor 8 et `@capacitor-community/admob` 8.1.0. Les projets Android et iOS sont présents. Le jeu web continue de fonctionner ; les boutons publicitaires ne sont proposés que dans l’application native. Il n’y a pas de simulation de publicité ni de récompense gratuite dans le navigateur.

## Emplacements

| Emplacement | Format | Comportement |
| --- | --- | --- |
| Résultat d’un combat | Vidéo récompensée facultative | +50 pièces, une fois par combat |
| Boutique → Offres | Vidéo récompensée facultative | +50 pièces, une fois par jour UTC |
| Résultat → Nouvelle partie | Interstitiel | Après 3 combats distincts, au moins 2 minutes après le lancement et 3 minutes après la dernière publicité |
| Profil et Boutique → Offres | Choix de confidentialité | Formulaire Google UMP, lorsqu’il est requis |

Aucune bannière. Pas d’interstitiel pendant les tours, au lancement du jeu ou à l’ouverture d’un booster. Le bouton Nouvelle partie attend la fermeture de l’annonce. Une annonce non chargée est ignorée ; son arrivée tardive ne déclenche pas d’affichage. Une vidéo récompensée remet aussi à zéro la fréquence des interstitiels. Le droit `noAds` existant les désactive, tout en conservant les vidéos facultatives. L’achat de ce droit reste à connecter aux boutiques mobiles ; cette intégration n’ajoute pas de paiement.

Seul l’événement natif `Rewarded` crédite les pièces. Fermer la publicité, résoudre la promesse d’affichage, rencontrer une erreur ou consulter le site web ne donne aucun bonus. Le reçu et le solde sont enregistrés dans la même sauvegarde de progression. Les doubles clics et événements répétés ne donnent pas plusieurs récompenses. Cette sauvegarde reste locale, comme le reste du jeu : elle ne constitue pas une vérification serveur contre la modification des données du joueur. Un futur système de comptes devra faire valider les récompenses côté serveur avec AdMob SSV.

## Tester sur téléphone

Prérequis : Node 22 ou supérieur, Android Studio avec JDK 21 et Android SDK 36 pour Android ; un Mac avec Xcode compatible Capacitor 8 pour iOS. Identifiant natif initial : `com.pawclaw.game`.

```sh
npm ci
cp .env.example .env.local
npm run mobile:android
npm run android
```

Sous Windows, copier `.env.example` dans `.env.local` avec l’explorateur ou PowerShell. Android Studio permet ensuite de lancer la configuration `app` sur un téléphone ou un émulateur.

Pour iOS, sur Mac :

```sh
npm run mobile:ios
npm run ios
```

Sélectionner l’équipe de signature et un appareil dans Xcode. Capacitor synchronise le plugin via Swift Package Manager.

Le mode `test` est celui par défaut, y compris pour un build de production. Il utilise les identifiants de démonstration Google propres à chaque plateforme, pour l’application et pour les blocs publicitaires. Les commandes `mobile:*` configurent l’identifiant natif, compilent le jeu et synchronisent ses fichiers. Ne pas modifier seulement les variables JavaScript puis lancer un ancien build natif.

## Activer les annonces de ton compte

1. Dans AdMob, créer l’application Android et/ou iOS, puis un bloc **Récompense** et un bloc **Interstitiel** pour chaque plateforme utilisée. Configurer la récompense du bloc à **50 pièces** pour correspondre au jeu.
2. Renseigner les trois identifiants de la plateforme dans `.env.local`. L’identifiant d’application contient `~` ; ceux des blocs contiennent `/`. Aucun mot de passe ni clé API privée n’est nécessaire.
3. Dans Confidentialité et messages, publier le message de consentement approprié et renseigner la politique de confidentialité du jeu. Pour une demande de suivi iOS, configurer le message IDFA dans UMP ; ne pas ajouter en parallèle un second appel manuel à ATT.
4. Passer `VITE_ADMOB_MODE=live`, puis relancer `npm run mobile:android` ou `npm run mobile:ios`. La commande refuse des identifiants manquants, mal formés ou de démonstration en mode live.

Exemple de noms de variables Android :

```dotenv
VITE_ADMOB_ENABLED=true
VITE_ADMOB_MODE=live
VITE_ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_ANDROID_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
VITE_ADMOB_ANDROID_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

Pour iOS, remplacer `ANDROID` par `IOS`. Pour couper les publicités, définir `VITE_ADMOB_ENABLED=false` puis reconstruire et synchroniser l’application. Les variables `VITE_*` sont publiques dans le client ; elles contiennent ici uniquement des identifiants publicitaires.

Si AdMob demande `app-ads.txt`, utiliser la ligne exacte fournie dans ton compte et la publier à la racine du domaine développeur déclaré dans la fiche du store. Aucun identifiant éditeur n’a été inventé dans ce dépôt. Les 50 identifiants SKAdNetwork de la documentation Google consultée sont inclus dans le projet iOS ; les actualiser selon les réseaux utilisés.

## Vérifications

```sh
npm run test:ads
npm run test:all
npm run mobile:android
npm run mobile:ios
```

Les tests couvrent le consentement, les erreurs de chargement, les réponses tardives, la fermeture anticipée, les vidéos longues, les récompenses uniques, les limites de fréquence, le droit sans publicité et les actions de l’interface. La compilation web et la synchronisation Capacitor sont vérifiables ici. La compilation/signature native et l’affichage AdMob sur appareil nécessitent Android Studio/Xcode et restent à valider sur téléphone.

Sur appareil, essayer la vidéo jusqu’au bonus, la fermer avant le bonus, recommencer hors connexion, modifier les choix de confidentialité et enchaîner des combats pour vérifier la fréquence. Les annonces doivent afficher le marquage de test pendant ces essais.

## Sources

- [Plugin Capacitor AdMob](https://github.com/capacitor-community/admob)
- [Google : annonces de test Android](https://developers.google.com/admob/android/test-ads)
- [Google : annonces de test iOS](https://developers.google.com/admob/ios/test-ads)
- [Google UMP et confidentialité](https://developers.google.com/admob/android/privacy)
- [Google : configuration iOS et SKAdNetwork](https://developers.google.com/admob/ios/quick-start)
