# Préparer les versions Android et iPhone

## Ce qui est livré

Projets Capacitor dans `android/` et `ios/`, configuration `capacitor.config.ts`, 5 plugins natifs (App, Preferences, Haptics, StatusBar, SplashScreen), icônes et splashs propres au jeu. Les fichiers natifs sont préparés ; aucun binaire signé n’est inclus dans ce lot.

Identifiant provisoire : `com.pawandclaw.game`. Il doit être confirmé dans les comptes développeur avant la première soumission. Ce choix ne réserve aucun nom dans une boutique. Les versions natives initiales des gabarits ne constituent pas un numéro de sortie approuvé.

## Reproduire le build

Node 24 recommandé, installation déterministe par lockfile :

```sh
npm ci
npm test
npm run mobile:sync
```

`mobile:sync` importe les illustrations existantes, compile TypeScript/Vite et synchronise les plugins et fichiers du jeu sur les deux plateformes. Il ne signe pas l’application et ne produit pas à lui seul un APK, AAB ou IPA. Ne pas modifier `dist/` ou les copies `public/` natives à la main.

Après changement de l’icône source, lancer `npm run mobile:art`, puis `npm run mobile:sync`. Le script ne génère pas de nouvel artwork : il encode la source approuvée aux dimensions des ressources natives.

## Android

Prévoir Android Studio, Java 21 et Android SDK avec API 36 selon `android/variables.gradle`. Le minimum du gabarit est API 24 ; l’installer et tester dessus avant d’annoncer sa compatibilité.

```sh
npm run mobile:android
cd android
./gradlew assembleDebug
./gradlew bundleRelease
```

Le build debug permet les essais internes. La sortie release nécessite la configuration de signature du propriétaire ; garder les clés hors Git. Le workflow CI `android-debug` prépare un APK de test lorsque l’environnement GitHub dispose des SDK requis. Vérifier son résultat : l’existence du job ne prouve pas que le build a réussi.

## iPhone

Prévoir un Mac avec une version Xcode compatible avec Capacitor 8, les composants iOS requis, puis choisir l’équipe de développement dans Xcode.

```sh
npm run mobile:ios
```

Pour une compilation de simulateur sans signature :

```sh
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -derivedDataPath output/ios CODE_SIGNING_ALLOWED=NO build
```

Le simulateur n’est pas un binaire installable sur un iPhone physique. Pour TestFlight, produire une archive de distribution signée depuis Xcode et l’envoyer à App Store Connect. Aucun certificat ni profil n’a été créé ici. Le conteneur de travail est Linux, sans Xcode.

Le manifeste `PrivacyInfo.xcprivacy` déclare l’usage de UserDefaults pour la progression locale (CA92.1). Revoir les déclarations sur l’archive finale et les dépendances réellement intégrées ; toute publicité, analytics, connexion ou achat futur les changera.

## Sauvegarde et fonctionnement hors ligne

Les fichiers du jeu sont embarqués. La couche `gameStorage` conserve une API synchrone pour le moteur et enregistre les instantanés natifs dans Preferences dans l’ordre. La sauvegarde native est chargée avant le montage de React. Un instantané natif illisible bloque le démarrage avec une action de réessai, au lieu d’être remplacé silencieusement par un compte neuf.

Pas de compte distant, JcJ, cloud save ou transfert Android↔iPhone. Le stockage navigateur d’un aperçu Sites ne migre pas automatiquement vers l’application. Tester les mises à jour natives ; une désinstallation peut effacer les données.

## Porte de sortie

`npm run release:check` lance tests, compilation et audit de présence des illustrations de cartes. Il doit actuellement échouer sur les 58 images manquantes. Un échec connu n’est pas un résultat de validation. Les 10 images optionnelles d’effets ne bloquent pas ce contrôle si leur rendu est assuré autrement.

Avant de soumettre :

1. Terminer les illustrations et faire valider les écrans selon `DIRECTION_ARTISTIQUE.md`.
2. Passer les tests automatisés et les builds natifs ; résoudre les échecs CI.
3. Jouer au moins 10 parties par plateforme, aux trois difficultés, et vérifier les récompenses uniques.
4. Interrompre l’app pendant l’ouverture d’un booster, la pose d’une carte, le tour IA, la résolution et la remise d’une récompense ; forcer sa fermeture puis redémarrer. Contrôler inventaire, monnaie, deck et checkpoint.
5. Tester perte de réseau, mode avion, manque d’espace, rotation, encoche, gros texte, vibrations désactivées et animations réduites.
6. Tester les transitions de jour/semaine/saison et la mise à jour depuis une installation précédente.
7. Mesurer chargement, mémoire, fluidité et batterie sur appareils milieu de gamme ; fixer les seuils de sortie après mesure.
8. Préparer screenshots réels, description, classement d’âge, support et politique de confidentialité publique. Ne pas annoncer JcJ, achats ou langues absents.
9. Configurer signature et comptes propriétaire, distribuer via tests internes Google Play/TestFlight, recueillir les retours puis soumettre la version corrigée.

Aucun compte Apple/Google, secret, certificat ou paiement n’est nécessaire pour lire et revoir ce travail. La signature et l’envoi aux boutiques exigent l’accès du propriétaire à ces services.
