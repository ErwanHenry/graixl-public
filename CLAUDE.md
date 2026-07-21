# graixl-public — Contexte pour Claude Code
> Généré par Keel codemap le 2026-07-21. Pas de .planning/ — sources analysées: README.md, package.json, git log, structure.

## Vue d'ensemble
Écosystème IA révolutionnaire pour la prospection B2B intelligente, basé sur une architecture hexagonale coordonnant 6 moteurs IA spécialisés et 20 agents autonomes. Valeur: 100-600x plus rapide que l'approche séquentielle, avec prédictions ML à 89% de précision sur la conversion prospects.

## Stack
- **Runtime**: Node.js 18+ (JavaScript pur)
- **Architecture**: Hexagonale (ports & adapters)
- **Déploiement**: Vercel Serverless Functions
- **Tests**: Jest 30.2.0
- **API**: REST endpoints (api/ecosystem.js)
- **Dépendances**: events@3.3.0 uniquement (stack minimaliste)

## Lancement local
```bash
# Démarrage écosystème
npm start

# Tests unitaires
npm test
npm run test:coverage

# Tests d'intégration
npm run test:integration

# Mode dev
npm run dev
```

## État actuel
**Phase**: Prototype fonctionnel. Dernière activité: 2026-04-13 (DATA_ROOM.md). 3 commits majeurs:
- Initial commit: architecture hexagonale complète
- CI/CD GitHub Actions ajouté
- Data room créée

**Documentation complète**: 6 fichiers .md (README, HEXAGONAL_ARCHITECTURE, ECOSYSTEM_QUICK_START, GUIDE_UTILISATEUR_COMPLET, DOCUMENTATION_TECHNIQUE, PRODUCTION_URLS).

## Pour Keel
Projet en phase prototype avec architecture déjà mature et tests complets. Pas de .planning/ → les priorités ne sont pas formellement tracées. Action utile: définir la roadmap et les next-steps dans un dossier .planning/ si l'équipe souhaite structurer le développement futur.
