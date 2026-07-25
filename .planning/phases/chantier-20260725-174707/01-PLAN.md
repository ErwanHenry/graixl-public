## Goal
Nettoyer le dépôt graixl-public en supprimant les artefacts invalides commis par erreur dans la PR #2 (dossier binaire node_modules/@unrs/, fichier .npmrc vide) et corriger les tests unitaires qui échouent à cause d'assertions booléennes strictes inadaptées au type de retour de hasCompleteProfile.

## Tasks
- Supprimer le dossier node_modules/@unrs/resolver-binding-linux-x64-gnu/ et ses 3 fichiers (dont le binaire .node) qui n'auraient jamais dû être commités
- Supprimer le fichier .npmrc à la racine du projet qui ne contient que des commentaires de debug et aucune directive npm valide
- Ajouter la ligne node_modules/ au fichier .gitignore existant pour empêcher toute future recommit de dossiers node_modules
- Corriger les assertions du fichier src/__tests__/Prospect.test.js : pour chaque assertion portant sur la méthode hasCompleteProfile (qui retourne une valeur truthy/falsy et non un booléen strict), remplacer expect(...).toBe(true) par expect(...).toBeTruthy() et expect(...).toBe(false) par expect(...).toBeFalsy(), après vérification du code source de src/core/domain/entities/Prospect.js pour valider chaque cas d'usage

## Acceptance criteria
- Le dossier node_modules/@unrs/resolver-binding-linux-x64-gnu/ n'existe plus dans le dépôt de travail (vérifiable par : test -d node_modules/@unrs/resolver-binding-linux-x64-gnu/ echo $? retourne 1)
- Le fichier .npmrc n'existe plus à la racine (vérifiable par : test -f .npmrc && echo $? retourne 1)
- Le fichier .gitignore contient la ligne node_modules/ (vérifiable par : grep -q "^node_modules/$" .gitignore && echo $? retourne 0)
- Les tests unitaires Prospect.test.js passent tous avec npm test (vérifiable par : npm test 2>&1 | grep -q "PASS src/__tests__/Prospect.test.js")
- Aucun fichier de production n'a été modifié (vérifiable par : git status ne montre aucun changement dans src/core/domain/entities/Prospect.js ou autres fichiers source)

## files_modified
- node_modules/@unrs/resolver-binding-linux-x64-gnu/ (suppression du dossier)
- .npmrc (suppression du fichier)
- .gitignore (ajout de la ligne node_modules/)
- src/__tests__/Prospect.test.js (correction des assertions hasCompleteProfile)
