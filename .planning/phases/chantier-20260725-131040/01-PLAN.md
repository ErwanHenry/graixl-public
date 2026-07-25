## Goal
Créer une suite de tests unitaires Jest pour l'entité de domaine Prospect afin de valider le comportement réel de ses méthodes publiques (validation, transitions d'état, calculs) sans mocks, en suivant la convention existante du projet.

## Tasks
- Lire src/core/domain/entities/Prospect.js pour identifier les méthodes publiques, leurs signatures, et la logique métier à tester
- Lire src/__tests__/GraixlEcosystem.test.js pour comprendre la convention de tests existante
- Créer src/__tests__/Prospect.test.js avec des tests de comportement réel couvrant:
  - Validation des données d'entrée (email invalide, champs manquants, valeurs incorrectes)
  - Transitions d'état valides et invalides entre les statuts du prospect
  - Calculs de scores et métriques si présents
  - Cas limites (valeurs null, undefined, tableaux vides, chaînes vides)
  - Gestion des erreurs et exceptions

## Acceptance criteria
- `npm test` exécute les nouveaux tests sans erreur
- Les tests couvrent toutes les méthodes publiques de Prospect identifiées
- Chaque test vérifie un comportement observable précis (retour de valeur, état modifié, erreur levée)
- `npm run test:coverage` montre un taux de couverture du code Prospect.js > 80%
- Aucun test n'utilise typeof ou inspect pour vérifier l'existence de fonctions
- Tous les tests sont exécutables en local sans dépendance externe ni configuration

## files_modified
- src/__tests__/Prospect.test.js (création)
