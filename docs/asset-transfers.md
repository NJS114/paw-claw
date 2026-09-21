# Transfert des animations vers GitHub

Les originaux de création restent archivés séparément. Le dépôt contient les WebP optimisés pour les aperçus : poses Pirates de 192 pixels, effets de 384 pixels, atlas des autres familles à leur résolution initiale, transparence conservée. La compression est avec perte.

Chaque atlas est découpé en blocs binaires de **384 000 octets maximum**. Les index indiquent leur ordre. `npm run assets:pirates` et `npm run assets:groups` reconstruisent les ressources publiques ; `npm run build` exécute ces étapes automatiquement. Ne pas ajouter les PNG ni les WebP publics reconstruits au dépôt.

Pour un transfert via le connecteur GitHub :

1. Lire chaque bloc localement et transmettre son base64 directement à `create_blob`. Ne jamais afficher les images, archives ou leur base64 avec `cat` dans la conversation.
2. Vérifier la longueur du base64 avant envoi, puis comparer le SHA reçu à celui du blob Git local.
3. Enregistrer immédiatement le chemin et le SHA confirmé dans un fichier de reprise local. Reprendre uniquement les blocs manquants ou modifiés ; ne pas recommencer tout le pack.
4. Créer l’arbre à partir des SHA des blocs et du contenu des fichiers texte. Comparer son SHA à `git write-tree`.
5. Créer le commit, publier la branche et relire sa référence distante. Confirmer le push uniquement après cette vérification.

Avant publication : `npm run test:pirates`, `npm run test:groups`, `npm run build` et `git diff --cached --check`.

Cette limite concerne la procédure de transfert par le connecteur ; ce n’est pas une limite générale de Git.
