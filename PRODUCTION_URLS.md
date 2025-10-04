# 🌐 URLs de Production Graixl

## 🎯 **URL Principale de Production**
```
https://graixl-public.vercel.app
```

---

## 📱 **Accès Direct aux Interfaces**

### 🏠 **Page d'Accueil**
- **URL**: `https://graixl-public.vercel.app/`
- **Redirection**: `https://graixl-public.vercel.app/index.html`
- **Description**: Landing page avec navigation vers toutes les fonctionnalités

### 📊 **Dashboard Principal**
- **URL**: `https://graixl-public.vercel.app/dashboard`
- **Direct**: `https://graixl-public.vercel.app/dashboard-prospection.html`
- **Description**: Interface de gestion des campagnes et métriques temps réel

### 🚀 **Création de Campagne**
- **URL**: `https://graixl-public.vercel.app/campaign-wizard`
- **Direct**: `https://graixl-public.vercel.app/campaign-wizard.html`
- **Description**: Wizard 4 étapes pour créer des campagnes de prospection

### 👥 **Pipeline CRM**
- **URL**: `https://graixl-public.vercel.app/prospects`
- **Direct**: `https://graixl-public.vercel.app/prospects-pipeline.html`
- **Description**: Interface Kanban de gestion des prospects

### 📈 **Analytics**
- **URL**: `https://graixl-public.vercel.app/analytics`
- **Direct**: `https://graixl-public.vercel.app/analytics-dashboard.html`
- **Description**: Dashboard d'analytics avec insights IA

---

## 🔌 **APIs de Production**

### 📋 **API Campagnes**
```
https://graixl-public.vercel.app/api/campaigns
```
**Actions disponibles:**
- `?action=list` - Lister toutes les campagnes
- `?action=get&id=ID` - Obtenir une campagne spécifique
- `?action=create` - Créer une nouvelle campagne
- `?action=start&id=ID` - Démarrer une campagne
- `?action=metrics` - Obtenir les métriques globales

### 🤖 **API Moteur de Prospection**
```
https://graixl-public.vercel.app/api/prospection-engine
```
**Actions disponibles:**
- `?action=search` - Rechercher des prospects
- `?action=status&workflowId=ID` - Statut d'un workflow
- `?action=metrics` - Métriques de performance
- `?action=optimize` - Optimisation IA
- `?action=health` - Santé du système

### 🔄 **API Workflows**
```
https://graixl-public.vercel.app/api/workflow-manager
```
**Actions disponibles:**
- `?action=create` - Créer un workflow
- `?action=list` - Lister tous les workflows
- `?action=start&id=ID` - Démarrer un workflow
- `?action=metrics` - Métriques des workflows

### 🔗 **API LinkedIn**
```
https://graixl-public.vercel.app/api/linkedin-integration
```
**Actions disponibles:**
- `?action=authenticate` - Authentification LinkedIn
- `?action=search` - Recherche de prospects
- `?action=message` - Envoi de messages
- `?action=stats` - Statistiques d'utilisation

### 📧 **API Email**
```
https://graixl-public.vercel.app/api/email-integration
```
**Actions disponibles:**
- `?action=send` - Envoyer un email
- `?action=templates` - Gérer les templates
- `?action=analytics` - Analytics email
- `?action=health` - Santé des providers

### ⚡ **API Automation**
```
https://graixl-public.vercel.app/api/automation-engine
```
**Actions disponibles:**
- `?action=create` - Créer une automation
- `?action=trigger` - Déclencher une séquence
- `?action=monitor` - Monitoring des automations

---

## 📱 **Compatibilité Mobile**

### ✅ **Plateformes Supportées**
- **iOS**: Safari 14+, Chrome, Firefox
- **Android**: Chrome 90+, Firefox, Samsung Internet
- **Tablettes**: iPad, Android tablets
- **Desktop**: Chrome, Firefox, Safari, Edge

### 🎯 **Fonctionnalités Mobile**
- Navigation tactile optimisée
- Gestes swipe et drag & drop
- Interface responsive
- Performance optimisée
- Mode hors-ligne (cache)

---

## 🚀 **Performance et Disponibilité**

### ⚡ **Métriques de Performance**
- **Temps de chargement**: < 2 secondes
- **Disponibilité**: 99.9% (Vercel SLA)
- **Région**: Global CDN
- **HTTPS**: Certificat automatique

### 🔐 **Sécurité**
- HTTPS forcé
- Headers CORS configurés
- Rate limiting sur APIs
- Validation des données
- Sanitisation des inputs

---

## 🛠️ **Support et Maintenance**

### 📞 **Contacts**
- **Documentation**: Consultez les fichiers `.md` du projet
- **Issues**: Créer une issue sur le repository
- **Updates**: Déploiement automatique via Git

### 🔄 **Mises à Jour**
- **Déploiement**: Automatique via Vercel
- **Rollback**: Possible en 1 clic
- **Monitoring**: Intégré Vercel Analytics
- **Logs**: Accessibles via CLI Vercel

---

## ✅ **Status du Déploiement**

**✅ Toutes les interfaces sont opérationnelles**
**✅ Toutes les APIs sont déployées**
**✅ Navigation entre interfaces fonctionne**
**✅ Responsive design validé**
**✅ Performance optimisée**

---

*Dernière mise à jour: $(date)*
*Système Graixl - Production Ready sur Vercel*