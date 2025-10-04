# 📖 Guide Utilisateur Complet - Graixl

## 🎯 Bienvenue dans Graixl
**La plateforme révolutionnaire de prospection B2B alimentée par l'IA**

Graixl transforme votre prospection en un processus automatisé, intelligent et hautement performant. Ce guide vous accompagnera étape par étape pour maîtriser toutes les fonctionnalités de la plateforme.

---

## 🚀 Démarrage Rapide

### Accès à la Plateforme
1. **URL de production** : `https://graixl-ecosystem.vercel.app`
2. **Interface locale** : Ouvrez `index.html` dans votre navigateur
3. **Navigation mobile** : L'interface s'adapte automatiquement à votre appareil

### Premier Lancement
```bash
# Pour un déploiement local
npm install
npm start

# L'interface sera disponible sur http://localhost:3000
```

---

## 📊 Dashboard Principal

### Vue d'Ensemble
Le dashboard vous donne une vision globale de vos activités de prospection :

#### Statistiques Clés
- **Campagnes Actives** : Nombre de campagnes en cours
- **Prospects Totaux** : Total des prospects générés
- **Taux de Réponse** : Pourcentage de réponses obtenues
- **RDV Programmés** : Nombre de rendez-vous planifiés

#### Actions Rapides
- ➕ **Nouvelle Campagne** : Lance le wizard de création
- 📊 **Analytics** : Accède au dashboard d'analyse
- 👥 **Prospects** : Ouvre le pipeline CRM

### Navigation
```
Dashboard Principal → Création Campagne → Suivi Pipeline → Analytics
     ↓                      ↓                ↓            ↓
Statistiques         Critères de       Gestion        Métriques
globales            prospection       prospects      détaillées
```

---

## 🎯 Créer une Campagne de Prospection

### Étape 1 : Définir les Critères
1. **Accès** : Cliquez sur "➕ Nouvelle Campagne"
2. **Informations générales** :
   - Nom de la campagne
   - Description
   - Objectif (leads, RDV, ventes)

3. **Critères de ciblage** :
   ```
   Secteurs d'activité : SaaS, E-commerce, FinTech...
   Tailles d'entreprise : Startup, PME, Grandes entreprises
   Localisations : France, Europe, International
   Postes ciblés : CEO, CTO, Directeur Marketing...
   ```

### Étape 2 : Configurer les Messages
4. **Templates disponibles** :
   - **Prospection initiale** : Premier contact professionnel
   - **Follow-up** : Relance après 3-7 jours
   - **Proposition de démo** : Invitation à une démonstration
   - **Remerciement** : Après un échange

5. **Personnalisation** :
   ```
   Variables disponibles :
   {{first_name}} - Prénom du prospect
   {{company_name}} - Nom de l'entreprise
   {{job_title}} - Poste du prospect
   {{industry}} - Secteur d'activité
   {{sender_name}} - Votre nom
   {{sender_company}} - Votre entreprise
   ```

### Étape 3 : Planifier l'Exécution
6. **Options de lancement** :
   - **Immédiat** : Démarrage instantané
   - **Programmé** : Date et heure spécifiques
   - **Récurrent** : Répétition automatique

7. **Limites et sécurité** :
   - Maximum 50 prospects/jour (recommandé)
   - Délai entre messages : 2-5 secondes
   - Pause weekend automatique

---

## 👥 Gestion du Pipeline CRM

### Interface Kanban
Le pipeline utilise 5 colonnes pour organiser vos prospects :

#### 🆕 Nouveaux
- Prospects récemment trouvés
- Pas encore contactés
- Score de qualification IA

#### 📧 Contactés  
- Premier message envoyé
- En attente de réponse
- Historique des interactions

#### 💬 Intéressés
- Ont répondu positivement
- Montrent de l'engagement
- Prêts pour la qualification

#### 📅 RDV Programmés
- Rendez-vous planifiés
- Calls prévus
- Démos programmées

#### ✅ Clients
- Prospects convertis
- Contrats signés
- Revenus générés

### Actions sur les Prospects

#### Déplacer un Prospect
```
Méthode 1 : Drag & Drop
1. Cliquez et maintenez sur la carte prospect
2. Glissez vers la colonne de destination
3. Relâchez pour confirmer

Méthode 2 : Actions rapides (mobile)
1. Tapez sur la carte prospect
2. Sélectionnez l'action dans le menu
3. Confirmez le changement de statut
```

#### Détails d'un Prospect
Cliquez sur une carte pour voir :
- **Informations complètes** : Contact, entreprise, poste
- **Score IA** : Évaluation de la qualité (0-100)
- **Historique** : Toutes les interactions
- **Notes** : Commentaires et observations
- **Actions** : Email, LinkedIn, téléphone

#### Ajouter des Notes
```
1. Ouvrez les détails du prospect
2. Section "Ajouter une note"
3. Saisissez vos observations
4. Cliquez "📝 Ajouter Note"
```

### Filtres et Recherche
- **Recherche** : Nom, entreprise, poste
- **Campagne** : Filtrer par campagne d'origine
- **Priorité** : Haute, moyenne, basse
- **Score** : Seuil de qualification minimum

---

## 📊 Dashboard Analytics

### Métriques Principales

#### KPIs de Performance
1. **Prospects Générés** : Total et évolution
2. **Taux de Réponse** : Pourcentage et tendance
3. **RDV Programmés** : Nombre et évolution
4. **ROI Prospection** : Retour sur investissement
5. **Emails Envoyés** : Volume et cadence
6. **Taux d'Ouverture** : Engagement email

#### Graphiques Interactifs
- **Performance Campagnes** : Évolution temporelle
- **Répartition Canaux** : LinkedIn vs Email
- **Conversion par Secteur** : Analyse sectorielle

### Analyses Avancées

#### Top Performers
- **Meilleures Campagnes** : Taux de conversion
- **Templates Efficaces** : Performance email
- **Secteurs Rentables** : ROI par industrie

#### Insights IA
L'intelligence artificielle analyse vos données et propose :
- **Optimisations temporelles** : Meilleurs créneaux d'envoi
- **Améliorations de contenu** : Suggestions de messages
- **Opportunités manquées** : Prospects à relancer

### Filtres Temporels
```
Périodes disponibles :
- 7 derniers jours
- 30 derniers jours (par défaut)
- 90 derniers jours
- 1 an
- Personnalisé (dates spécifiques)
```

### Export de Données
1. **Bouton Export** : En haut à droite
2. **Formats disponibles** : PDF, Excel, CSV
3. **Contenu** : Métriques, graphiques, détails

---

## 🤖 Système d'Automatisation

### Qu'est-ce que l'Automatisation ?
Les automatisations sont des séquences d'actions déclenchées automatiquement par des événements spécifiques.

### Types de Déclencheurs

#### Événements Prospects
- **Nouveau prospect trouvé** : Déclenche l'envoi automatique
- **Réponse reçue** : Lance la qualification
- **Email ouvert** : Initie le suivi
- **Lien cliqué** : Programme un follow-up

#### Événements Temporels
- **Délai écoulé** : Après X jours sans réponse
- **Heure fixe** : Tous les jours à 9h
- **Jour spécifique** : Tous les mardis
- **Récurrence** : Hebdomadaire, mensuel

### Actions Automatiques

#### Communications
- **Envoi email** : Message personnalisé
- **Message LinkedIn** : Contact professionnel
- **SMS** : Notification urgente
- **Webhook** : Intégration externe

#### Gestion CRM
- **Mise à jour statut** : Changement automatique
- **Ajout de note** : Commentaire systématique
- **Assignation** : Attribution à un commercial
- **Création de tâche** : Rappel d'action

### Créer une Automatisation

#### Étape 1 : Configuration
```
1. Accédez au menu "Automatisations"
2. Cliquez "➕ Nouvelle Automatisation"
3. Donnez un nom descriptif
4. Sélectionnez le type de déclencheur
```

#### Étape 2 : Conditions (optionnel)
```
Conditions possibles :
- Heure de la journée (9h-18h)
- Jour de la semaine (Lundi-Vendredi)
- Score du prospect (> 80)
- Secteur d'activité (SaaS, FinTech...)
- Taille d'entreprise (> 50 employés)
```

#### Étape 3 : Actions
```
Ajoutez une ou plusieurs actions :
1. Sélectionnez le type d'action
2. Configurez les paramètres
3. Définissez les délais
4. Ajoutez des conditions spécifiques
```

#### Exemple d'Automatisation
```
Nom : "Séquence Prospect SaaS"

Déclencheur :
- Nouveau prospect trouvé
- Secteur = SaaS
- Score > 75

Actions :
1. Attendre 1 heure
2. Envoyer email "intro-saas"
3. Attendre 3 jours
4. Si pas de réponse : message LinkedIn
5. Attendre 7 jours
6. Si pas de réponse : email follow-up
7. Marquer comme "prospects froid"
```

---

## 📧 Gestion des Emails

### Templates Email

#### Templates Prédéfinis
1. **Prospection Initiale**
   ```
   Sujet : Collaboration {{company_name}} - {{sender_name}}
   
   Bonjour {{first_name}},
   
   Je suis {{sender_name}} de {{sender_company}}. J'ai remarqué 
   votre travail chez {{company_name}} et je pense que nous 
   pourrions avoir des synergies intéressantes.
   
   {{personalized_intro}}
   
   Seriez-vous disponible pour un échange rapide de 15 minutes 
   cette semaine ?
   
   Cordialement,
   {{sender_name}}
   ```

2. **Follow-up**
   ```
   Sujet : Re: Collaboration {{company_name}}
   
   Bonjour {{first_name}},
   
   J'espère que vous allez bien. Je fais suite à mon message 
   de la semaine dernière concernant une potentielle 
   collaboration entre {{company_name}} et {{sender_company}}.
   
   {{follow_up_reason}}
   
   Avez-vous eu l'occasion d'y réfléchir ?
   
   Cordialement,
   {{sender_name}}
   ```

#### Créer un Template Personnalisé
```
1. Menu "Templates" → "➕ Nouveau Template"
2. Informations de base :
   - Nom du template
   - Type (prospection, follow-up, remerciement)
   - Sujet de l'email
3. Corps du message :
   - Utilisez les variables {{variable}}
   - Gardez un ton professionnel
   - Maximum 150 mots recommandé
4. Test et validation :
   - Prévisualisez avec des données test
   - Vérifiez la personnalisation
   - Testez sur différents appareils
```

### Séquences Email

#### Qu'est-ce qu'une Séquence ?
Une séquence est une suite d'emails envoyés automatiquement avec des délais définis.

#### Créer une Séquence
```
Structure recommandée :

Email 1 (J+0) : Introduction
- Présentation courte
- Proposition de valeur
- Question d'engagement

Email 2 (J+3) : Apport de valeur
- Contenu utile (article, étude)
- Pas de vente directe
- Maintien de l'intérêt

Email 3 (J+7) : Follow-up
- Rappel de l'offre
- Urgence ou rareté
- Call-to-action clair

Email 4 (J+14) : Dernière tentative
- Reconnaissance du non-intérêt
- Porte ouverte pour plus tard
- Demande de feedback
```

### Analytics Email

#### Métriques Importantes
- **Taux de délivrabilité** : % d'emails arrivés
- **Taux d'ouverture** : % d'emails ouverts
- **Taux de clic** : % de liens cliqués
- **Taux de réponse** : % de réponses reçues
- **Taux de désabonnement** : % d'opt-out

#### Améliorer la Performance
```
Bonnes pratiques :

Objet de l'email :
✅ Court (50 caractères max)
✅ Personnalisé avec le prénom
✅ Éviter les mots-spam (URGENT, GRATUIT)
✅ Créer de la curiosité

Contenu :
✅ Personnalisé au maximum
✅ Valeur ajoutée claire
✅ Call-to-action unique
✅ Signature professionnelle

Timing :
✅ Mardi-Jeudi optimal
✅ 10h-11h et 14h-15h
✅ Éviter lundi matin et vendredi soir
✅ Respecter les fuseaux horaires
```

---

## 📱 Utilisation Mobile

### Interface Adaptative
Graixl s'adapte automatiquement à votre appareil :
- **Téléphone** : Interface simplifiée, navigation tactile
- **Tablette** : Mise en page optimisée, gestes intuitifs
- **Desktop** : Interface complète, toutes fonctionnalités

### Navigation Mobile

#### Barre de Navigation Inférieure
- 🎯 **Dashboard** : Vue d'ensemble
- 👥 **Pipeline** : Gestion prospects
- ➕ **Campagne** : Création rapide
- 📊 **Analytics** : Métriques essentielles

#### Gestes Tactiles
```
Swipe gauche/droite : Navigation entre colonnes Kanban
Swipe vers le bas : Actualiser les données (pull-to-refresh)
Tap long : Démarrer le drag & drop
Double tap : Ouvrir les détails rapidement
```

### Fonctionnalités Mobile Spécifiques

#### Actions Rapides
- **Appel direct** : Tap sur le numéro de téléphone
- **Email rapide** : Templates pré-remplis
- **Notes vocales** : Dictée automatique
- **Géolocalisation** : Prospects à proximité

#### Notifications Push
```
Types de notifications :
- Nouvelle réponse reçue
- RDV programmé dans 1h
- Campagne terminée
- Objectif mensuel atteint
- Erreur système critique
```

#### Mode Hors-ligne
- **Consultation** : Données mises en cache
- **Actions** : Synchronisation différée
- **Notifications** : Alertes locales

---

## 🔧 Configuration et Paramètres

### Paramètres Généraux

#### Profil Utilisateur
```
1. Menu "Paramètres" → "Profil"
2. Informations personnelles :
   - Nom et prénom
   - Email de contact
   - Téléphone
   - Entreprise
   - Poste/fonction
3. Signature email :
   - Format automatique
   - Logo entreprise
   - Liens sociaux
```

#### Préférences Système
```
Interface :
- Langue (Français, Anglais)
- Fuseau horaire
- Format des dates
- Thème (Clair, Sombre, Auto)

Notifications :
- Email : Résumé quotidien/hebdomadaire
- Push : Temps réel activé/désactivé
- Sons : Alertes sonores
- Fréquence : Immédiate, groupée, silencieux
```

### Intégrations

#### LinkedIn
```
Configuration :
1. Menu "Intégrations" → "LinkedIn"
2. Connexion sécurisée :
   - Authentification OAuth
   - Permissions limitées
   - Révocation possible
3. Paramètres de sécurité :
   - Limite quotidienne : 20 messages
   - Délai entre messages : 30-120 secondes
   - Pause automatique weekend
```

#### Systèmes CRM Externes
```
CRM supportés :
- Salesforce
- HubSpot
- Pipedrive
- Zoho CRM
- CRM personnalisé (API REST)

Configuration :
1. Clés API sécurisées
2. Mapping des champs
3. Synchronisation bidirectionnelle
4. Logs de synchronisation
```

#### Outils Email
```
Fournisseurs supportés :
- Gmail (recommandé)
- Outlook
- SMTP personnalisé
- SendGrid
- Mailgun

Configuration :
1. Authentification OAuth/SMTP
2. Signatures automatiques
3. Tracking d'ouverture
4. Listes de suppression
```

---

## 🚨 Résolution de Problèmes

### Problèmes Courants

#### "Mes messages LinkedIn ne partent pas"
```
Vérifications :
1. Connexion LinkedIn active
2. Limite quotidienne non atteinte
3. Compte LinkedIn non restreint
4. Messages personnalisés (pas de copier-coller)

Solutions :
- Réduire la cadence d'envoi
- Varier les templates de messages
- Vérifier les restrictions LinkedIn
- Contacter le support Graixl
```

#### "Mes emails arrivent en spam"
```
Causes possibles :
1. Domaine expéditeur non configuré
2. Contenu détecté comme spam
3. Volume d'envoi trop élevé
4. Destinataires marquent comme spam

Solutions :
- Configurer SPF, DKIM, DMARC
- Éviter les mots-clés spam
- Réduire le volume quotidien
- Améliorer la qualification
```

#### "Les prospects ne s'affichent pas"
```
Vérifications :
1. Filtres actifs dans l'interface
2. Campagne en cours d'exécution
3. Critères de recherche valides
4. Connexion internet stable

Solutions :
- Réinitialiser les filtres
- Actualiser la page (F5)
- Vérifier les critères de campagne
- Vider le cache navigateur
```

#### "L'interface est lente"
```
Optimisations :
1. Fermer les onglets inutiles
2. Vider le cache navigateur
3. Utiliser Chrome/Safari récent
4. Vérifier la connexion internet

Sur mobile :
- Fermer les autres applications
- Redémarrer l'application
- Mettre à jour le navigateur
- Libérer l'espace de stockage
```

### Logs et Diagnostics

#### Accès aux Logs
```
1. Menu "Paramètres" → "Diagnostics"
2. Types de logs :
   - Activité utilisateur
   - Erreurs système
   - Performance
   - Sécurité
3. Export possible pour support
```

#### Tests de Connectivité
```
Tests automatiques :
- Connexion APIs externes
- Vitesse de connexion
- Latence serveurs
- État des services

Résultats :
✅ Vert : Tout fonctionne
⚠️ Orange : Dégradé mais utilisable
❌ Rouge : Service indisponible
```

---

## 🛡️ Sécurité et Confidentialité

### Protection des Données

#### Chiffrement
- **En transit** : TLS 1.3 pour toutes les communications
- **Au repos** : AES-256 pour le stockage
- **Mots de passe** : Hachage bcrypt + salt
- **Sessions** : Tokens JWT sécurisés

#### Conformité RGPD
```
Droits des utilisateurs :
- Accès aux données personnelles
- Rectification des informations
- Suppression (droit à l'oubli)
- Portabilité des données
- Opposition au traitement

Respect des obligations :
- Consentement explicite
- Finalité limitée du traitement
- Minimisation des données
- Conservation limitée dans le temps
```

### Bonnes Pratiques

#### Gestion des Accès
```
Recommandations :
1. Mot de passe complexe (12+ caractères)
2. Authentification à deux facteurs (2FA)
3. Sessions limitées dans le temps
4. Déconnexion automatique

En entreprise :
- Comptes utilisateurs individuels
- Rôles et permissions granulaires
- Audit trail complet
- Révocation d'accès immédiate
```

#### Protection LinkedIn
```
Limites recommandées :
- Max 20 messages/jour
- Délai 2-5 minutes entre messages
- Pause weekend obligatoire
- Personnalisation obligatoire

Surveillance :
- Détection automatique de restrictions
- Alertes en cas de problème
- Ajustement automatique des limites
- Sauvegarde du compte
```

---

## 📈 Optimisation de la Performance

### Stratégies de Prospection

#### Ciblage Optimal
```
Critères de qualité :
1. Secteurs à forte croissance
2. Entreprises en levée de fonds
3. Recrutements récents (croissance)
4. Technologies utilisées (fit produit)
5. Signaux d'achat (job postings, événements)

Scoring automatique :
- Taille d'entreprise : 25%
- Croissance récente : 25%
- Fit technologique : 25%
- Accessibilité décideur : 25%
```

#### Messages Performants
```
Structure gagnante :

Ligne d'objet (50 caractères max) :
"{{first_name}}, {{sujet_personnalisé}}"

Corps (100-150 mots) :
1. Accroche personnalisée (recherche préalable)
2. Proposition de valeur claire (1 phrase)
3. Preuve sociale ou statistic que (crédibilité)
4. Call-to-action précis (15 min de discussion)
5. Signature professionnelle

Variables de personnalisation :
- Nom/prénom du prospect
- Entreprise et secteur
- Actualités récentes
- Défis sectoriels
- Références communes
```

### Timing et Fréquence

#### Meilleurs Créneaux
```
Emails :
- Mardi 10h-11h : Taux d'ouverture +34%
- Mercredi 14h-15h : Taux de réponse +28%
- Jeudi 9h-10h : Taux de clic +31%

LinkedIn :
- Mardi-Jeudi 8h-9h : Plus d'activité
- Mercredi 17h-18h : Consultation mobile
- Éviter lundi matin et vendredi

Éviter absolument :
- Lundi avant 10h (surcharge email)
- Vendredi après 15h (weekend mode)
- Périodes de vacances
- Heures de repas (12h-14h)
```

#### Séquences Optimales
```
Calendrier de relance :

Jour 0 : Premier contact
Jour 3 : Follow-up soft (contenu de valeur)
Jour 7 : Rappel avec urgence légère
Jour 14 : Dernière tentative + porte ouverte
Jour 30 : Ajout à séquence long-terme

Règles d'or :
- Maximum 4 touchpoints par séquence
- Espacer d'au moins 3 jours
- Varier les canaux (email + LinkedIn)
- Toujours apporter de la valeur
```

### Analyse et Optimisation

#### KPIs à Surveiller
```
Métriques primaires :
- Taux de réponse : >15% (objectif 20%+)
- Taux d'ouverture : >40% (objectif 50%+)
- Taux de clic : >3% (objectif 5%+)
- Conversion RDV : >20% des réponses

Métriques secondaires :
- Temps de réponse moyen
- Qualité des leads (score)
- Coût par prospect qualifié
- ROI global de la prospection
```

#### Tests A/B
```
Éléments à tester :

Objets d'email :
- Personnalisé vs générique
- Question vs affirmation
- Court vs détaillé
- Avec/sans emoji

Corps de message :
- Longueur (50 vs 150 mots)
- Ton (formel vs décontracté)
- Structure (problème-solution vs bénéfice)
- Call-to-action (précis vs vague)

Timing :
- Jour de la semaine
- Heure d'envoi
- Délai entre relances
- Nombre de touchpoints
```

---

## 📞 Support et Assistance

### Ressources d'Aide

#### Documentation
- **Guide utilisateur** : Ce document complet
- **Tutoriels vidéo** : Formations pas-à-pas
- **FAQ** : Réponses aux questions fréquentes
- **Blog** : Conseils et bonnes pratiques

#### Support Technique
```
Canaux de support :

Email : support@graixl.com
- Réponse sous 24h ouvrées
- Joindre captures d'écran
- Préciser navigateur et version

Chat en ligne : graixl.com/chat
- Lundi-Vendredi 9h-18h
- Support temps réel
- Partage d'écran possible

Base de connaissances : help.graixl.com
- Articles détaillés
- Recherche par mots-clés
- Mises à jour régulières
```

#### Formation et Onboarding
```
Ressources disponibles :

Onboarding guidé :
- Configuration initiale (30 min)
- Première campagne (1h)
- Optimisation (30 min)

Webinaires mensuels :
- Nouvelles fonctionnalités
- Bonnes pratiques
- Retours d'expérience clients

Formation personnalisée :
- Session 1:1 avec expert
- Adaptée à votre secteur
- Plan d'action personnalisé
```

### Communauté

#### Forum Utilisateurs
```
Accès : community.graixl.com

Sections :
- Questions/Réponses
- Partage de templates
- Retours d'expérience
- Demandes de fonctionnalités
- Networking entre utilisateurs
```

#### Groupe LinkedIn
```
"Graixl - Prospection B2B Moderne"

Contenus :
- Conseils d'experts
- Études de cas clients
- Actualités de la prospection
- Discussions sectorielles
```

---

## 🔄 Mises à Jour et Évolutions

### Cycle de Développement

#### Releases Mensuelles
```
Contenu typique :
- Nouvelles fonctionnalités
- Améliorations UX/UI
- Corrections de bugs
- Optimisations performance
- Mises à jour sécurité
```

#### Feedback Utilisateurs
```
Canaux de feedback :
- Formulaire in-app
- Enquêtes trimestrielles
- Interviews utilisateurs
- Tests bêta

Traitement :
- Analyse et priorisation
- Roadmap produit
- Communication retours
- Implémentation rapide
```

### Feuille de Route

#### Fonctionnalités à Venir
```
Q1 2025 :
- Intégration Slack/Teams
- IA de génération de contenu
- Scoring prédictif avancé
- Analytics sectoriels

Q2 2025 :
- Séquences multi-canaux
- Recommandations IA temps réel
- API publique complète
- Marketplace de templates

Q3 2025 :
- Prospection vidéo
- Social selling avancé
- Intégrations CRM étendues
- Mobile app native
```

---

## 🎯 Conclusion

Graixl révolutionne votre approche de la prospection B2B en combinant automatisation intelligente et personnalisation à grande échelle. Ce guide vous a présenté l'ensemble des fonctionnalités pour transformer votre prospection en machine à générer des opportunités qualifiées.

### Prochaines Étapes Recommandées

1. **Configuration initiale** (Jour 1)
   - Paramétrer votre profil
   - Configurer les intégrations
   - Créer vos premiers templates

2. **Première campagne** (Jour 2-3)
   - Définir vos critères de ciblage
   - Lancer une campagne test (50 prospects)
   - Analyser les premiers résultats

3. **Optimisation** (Semaine 2)
   - Ajuster les messages selon les retours
   - Optimiser le timing
   - Étendre les critères performants

4. **Automatisation** (Semaine 3-4)
   - Configurer les séquences automatiques
   - Mettre en place le scoring IA
   - Optimiser le pipeline CRM

### Ressources Utiles

- 📖 **Documentation technique** : `/api-documentation`
- 🎥 **Tutoriels vidéo** : `graixl.com/tutorials`
- 💬 **Support direct** : `support@graixl.com`
- 🌟 **Communauté** : `community.graixl.com`

**L'équipe Graixl vous accompagne dans votre réussite !**

---

*Guide mis à jour le 04/10/2024 - Version 2.0*