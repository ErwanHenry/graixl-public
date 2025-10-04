# 🔧 Documentation Technique - Graixl

## 📋 Vue d'Ensemble Technique

Graixl est une plateforme de prospection B2B moderne construite sur une architecture hexagonale avec des composants modulaires et des intégrations avancées. Cette documentation couvre l'architecture, les APIs, les déploiements et les aspects techniques avancés.

---

## 🏗️ Architecture Système

### Architecture Hexagonale

```
                    🌐 INTERFACES UTILISATEUR
                         │
                ┌────────▼──────────┐
                │   Frontend Web    │
                │  (HTML/CSS/JS)    │
                └────────┬──────────┘
                         │
           ┌─────────────▼─────────────┐
           │      API Gateway          │
           │   (Routage & Auth)        │
           └─────────────┬─────────────┘
                         │
        ┌────────────────▼────────────────┐
        │          CORE DOMAIN            │
        │                                 │
        │  ┌──────────────────────────┐   │
        │  │   Automation Engine      │   │
        │  │   - Workflows            │   │
        │  │   - Triggers             │   │
        │  │   - Actions              │   │
        │  └──────────────────────────┘   │
        │                                 │
        │  ┌──────────────────────────┐   │
        │  │   Prospection Engine     │   │
        │  │   - Search Logic         │   │
        │  │   - AI Scoring           │   │
        │  │   - Enrichment           │   │
        │  └──────────────────────────┘   │
        │                                 │
        │  ┌──────────────────────────┐   │
        │  │   Email System           │   │
        │  │   - Templates            │   │
        │  │   - Sequences            │   │
        │  │   - Analytics            │   │
        │  └──────────────────────────┘   │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │        ADAPTERS LAYER           │
        │                                 │
        │  LinkedIn │ Email │ CRM │ IA    │
        │  Adapter  │Adapter│Adap.│Adapter│
        └─────────────────────────────────┘
```

### Stack Technique

#### Frontend
```
Technologies :
- HTML5 sémantique
- CSS3 avec variables personnalisées
- JavaScript ES6+ (Vanilla, pas de framework)
- Chart.js pour les graphiques
- Design responsive natif
- PWA capabilities

Patterns :
- Module Pattern pour l'organisation
- Observer Pattern pour les événements
- Command Pattern pour les actions
- Factory Pattern pour la création d'objets
```

#### Backend (APIs)
```
Runtime : Node.js 18+
Framework : Vercel Serverless Functions
Format : CommonJS/ES Modules
APIs : RESTful avec JSON

Structure :
/api/
├── automation-engine.js     # Moteur d'automatisation
├── campaigns.js             # Gestion des campagnes
├── email-integration.js     # Système email
├── linkedin-integration.js  # Intégration LinkedIn
├── prospection-engine.js    # Moteur de prospection
└── workflow-manager.js      # Gestionnaire de workflows
```

#### Persistance
```
Stratégie :
- Local Storage pour données client
- Session Storage pour état temporaire
- IndexedDB pour données volumineuses
- API externes pour synchronisation

Structure des données :
{
  prospects: Map<id, Prospect>,
  campaigns: Map<id, Campaign>,
  automations: Map<id, Automation>,
  analytics: Map<date, Metrics>
}
```

---

## 🔌 APIs et Intégrations

### API Automation Engine

#### Endpoints Principaux
```javascript
// Créer une automatisation
POST /api/automation-engine?action=create
{
  "name": "Séquence Prospect SaaS",
  "triggers": [
    {
      "type": "prospect_found",
      "config": { "minScore": 80 }
    }
  ],
  "conditions": [
    {
      "type": "time_of_day",
      "config": { "startHour": 9, "endHour": 17 }
    }
  ],
  "actions": [
    {
      "type": "send_email",
      "config": { "template": "initial_outreach" },
      "delay": 3600000
    }
  ]
}

// Déclencher une automatisation
POST /api/automation-engine?action=trigger
{
  "triggerId": "prospect_found",
  "data": {
    "prospectId": 123,
    "score": 85,
    "source": "linkedin"
  }
}

// Lister les automatisations
GET /api/automation-engine?action=list&status=active

// Métriques d'automatisation
GET /api/automation-engine?action=metrics
```

#### Types de Déclencheurs
```javascript
const TRIGGER_TYPES = {
  // Événements prospects
  'prospect_found': {
    dataSchema: {
      prospectId: 'string',
      campaignId: 'string',
      prospectData: 'object'
    }
  },
  
  // Événements email
  'email_opened': {
    dataSchema: {
      prospectId: 'string',
      emailId: 'string',
      openTime: 'date'
    }
  },
  
  // Événements temporels
  'scheduled_time': {
    dataSchema: {
      scheduledTime: 'date',
      recurringType: 'string'
    }
  }
};
```

#### Types d'Actions
```javascript
const ACTION_TYPES = {
  'send_email': {
    config: {
      template: 'string',
      delay: 'number',
      personalization: 'object'
    }
  },
  
  'send_linkedin_message': {
    config: {
      template: 'string',
      connectionRequest: 'boolean'
    }
  },
  
  'update_prospect': {
    config: {
      fields: 'object',
      status: 'string'
    }
  },
  
  'create_task': {
    config: {
      title: 'string',
      assignedTo: 'string',
      dueDate: 'date'
    }
  }
};
```

### API Email Integration

#### Configuration des Fournisseurs
```javascript
// Configuration multi-provider
const emailProviders = {
  smtp: {
    priority: 1,
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  },
  
  sendgrid: {
    priority: 2,
    config: {
      apiKey: process.env.SENDGRID_API_KEY
    }
  }
};
```

#### Envoi d'Email
```javascript
// Envoi simple
POST /api/email-integration?action=send
{
  "to": "prospect@company.com",
  "subject": "Collaboration {{company_name}}",
  "template": "initial_outreach",
  "recipientData": {
    "first_name": "John",
    "company_name": "TechCorp",
    "industry": "SaaS"
  }
}

// Envoi en masse
POST /api/email-integration?action=bulk
{
  "recipients": [
    { "email": "john@corp.com", "first_name": "John" },
    { "email": "jane@startup.io", "first_name": "Jane" }
  ],
  "template": "bulk_outreach",
  "batchSize": 10,
  "delayBetweenEmails": 2000
}

// Créer une séquence
POST /api/email-integration?action=sequence
{
  "name": "Séquence SaaS Directors",
  "steps": [
    {
      "template": "initial_outreach",
      "delay": 0
    },
    {
      "template": "follow_up",
      "delay": 259200000
    }
  ],
  "recipients": [...]
}
```

#### Analytics Email
```javascript
// Métriques globales
GET /api/email-integration?action=analytics

Response:
{
  "totalSent": 1543,
  "totalOpened": 687,
  "totalClicked": 89,
  "openRate": 44.5,
  "clickRate": 5.8,
  "performance": {
    "best_performing_templates": [...],
    "engagement_by_day": {...}
  }
}

// Tracking d'événements
POST /api/email-integration?action=track_open
{
  "emailId": "email_123",
  "prospectId": "prospect_456",
  "timestamp": "2024-10-04T10:30:00Z"
}
```

### API Prospection Engine

#### Recherche de Prospects
```javascript
POST /api/prospection-engine?action=search
{
  "criteria": {
    "jobTitles": ["CEO", "CTO", "Founder"],
    "industries": ["SaaS", "FinTech"],
    "companySize": {
      "min": 10,
      "max": 500
    },
    "locations": ["France", "Europe"]
  },
  "campaignId": "campaign_123",
  "maxResults": 100
}

Response:
{
  "success": true,
  "workflowId": "workflow_456",
  "prospects": [
    {
      "id": "prospect_789",
      "name": "John Doe",
      "company": "TechStart",
      "title": "CEO",
      "email": "john@techstart.com",
      "score": 85,
      "source": "linkedin"
    }
  ],
  "metadata": {
    "totalFound": 45,
    "qualityScore": 92,
    "executionTime": 15000
  }
}
```

#### Enrichissement et Scoring
```javascript
// Enrichissement email
POST /api/prospection-engine?action=enrich
{
  "prospects": [
    {
      "name": "John Doe",
      "company": "TechStart",
      "domain": "techstart.com"
    }
  ]
}

// Scoring IA
POST /api/prospection-engine?action=score
{
  "prospects": [...],
  "criteria": {
    "industry": "SaaS",
    "targetProfile": "decision_maker"
  }
}
```

### API LinkedIn Integration

#### Configuration Sécurisée
```javascript
const linkedinConfig = {
  rateLimits: {
    messages: {
      daily: 20,
      hourly: 5,
      burst: 1 // Par minute
    },
    searches: {
      daily: 100,
      hourly: 20
    }
  },
  
  safety: {
    minDelay: 30000, // 30 secondes minimum
    maxDelay: 300000, // 5 minutes maximum
    humanization: true,
    weekendPause: true
  }
};
```

#### Envoi de Messages
```javascript
POST /api/linkedin-integration?action=send_message
{
  "profileUrl": "https://linkedin.com/in/johndoe",
  "message": "Bonjour John, j'ai remarqué votre travail chez TechStart...",
  "connectionRequest": false,
  "campaignId": "campaign_123"
}

// Réponse
{
  "success": true,
  "messageId": "msg_456",
  "rateLimitStatus": {
    "remainingToday": 19,
    "nextAvailableSlot": "2024-10-04T10:45:00Z"
  }
}
```

---

## 📊 Gestion des Données

### Modèles de Données

#### Prospect
```javascript
class Prospect {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.company = data.company;
    this.title = data.title;
    this.email = data.email;
    this.phone = data.phone;
    this.linkedinUrl = data.linkedinUrl;
    
    // Métadonnées
    this.source = data.source; // 'linkedin', 'upload', 'api'
    this.campaignId = data.campaignId;
    this.status = data.status; // 'new', 'contacted', 'interested', 'meeting', 'client'
    this.priority = data.priority; // 'low', 'medium', 'high'
    this.score = data.score; // 0-100
    
    // Tracking
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastContactDate = data.lastContactDate;
    this.nextFollowUpDate = data.nextFollowUpDate;
    
    // Interactions
    this.interactions = data.interactions || [];
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
  }
  
  addInteraction(interaction) {
    this.interactions.unshift({
      id: `int_${Date.now()}`,
      type: interaction.type, // 'email', 'linkedin', 'phone', 'meeting'
      direction: interaction.direction, // 'outbound', 'inbound'
      subject: interaction.subject,
      content: interaction.content,
      timestamp: new Date(),
      metadata: interaction.metadata || {}
    });
    this.updatedAt = new Date();
  }
  
  updateScore(newScore, reason) {
    this.score = Math.max(0, Math.min(100, newScore));
    this.addInteraction({
      type: 'system',
      subject: 'Score Update',
      content: `Score mis à jour: ${newScore} (${reason})`,
      metadata: { previousScore: this.score, reason }
    });
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      company: this.company,
      title: this.title,
      email: this.email,
      phone: this.phone,
      linkedinUrl: this.linkedinUrl,
      source: this.source,
      campaignId: this.campaignId,
      status: this.status,
      priority: this.priority,
      score: this.score,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastContactDate: this.lastContactDate,
      nextFollowUpDate: this.nextFollowUpDate,
      interactions: this.interactions,
      tags: this.tags,
      customFields: this.customFields
    };
  }
}
```

#### Campaign
```javascript
class Campaign {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type; // 'prospection', 'nurturing', 'reactivation'
    this.status = data.status; // 'draft', 'active', 'paused', 'completed'
    
    // Configuration
    this.criteria = data.criteria;
    this.targeting = data.targeting;
    this.templates = data.templates;
    this.schedule = data.schedule;
    
    // Métriques
    this.metrics = {
      prospectsFound: 0,
      prospectsContacted: 0,
      responses: 0,
      meetings: 0,
      conversions: 0
    };
    
    // Dates
    this.createdAt = data.createdAt || new Date();
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.lastRunDate = data.lastRunDate;
  }
  
  updateMetrics(updates) {
    Object.assign(this.metrics, updates);
    this.lastRunDate = new Date();
  }
  
  getConversionRate() {
    return this.metrics.prospectsContacted > 0 
      ? (this.metrics.conversions / this.metrics.prospectsContacted) * 100 
      : 0;
  }
  
  getResponseRate() {
    return this.metrics.prospectsContacted > 0 
      ? (this.metrics.responses / this.metrics.prospectsContacted) * 100 
      : 0;
  }
}
```

### Persistance et Synchronisation

#### Local Storage Strategy
```javascript
class DataManager {
  constructor() {
    this.cache = new Map();
    this.syncQueue = [];
    this.lastSync = localStorage.getItem('lastSync');
  }
  
  // Sauvegarde locale avec compression
  saveToLocal(key, data) {
    try {
      const compressed = LZString.compress(JSON.stringify(data));
      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde locale:', error);
      return false;
    }
  }
  
  // Lecture depuis le local storage
  loadFromLocal(key) {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      
      const decompressed = LZString.decompress(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Erreur lecture locale:', error);
      return null;
    }
  }
  
  // Synchronisation différée
  queueForSync(operation) {
    this.syncQueue.push({
      operation,
      timestamp: Date.now(),
      retry: 0
    });
    
    this.processSyncQueue();
  }
  
  async processSyncQueue() {
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      
      try {
        await this.executeSyncOperation(item.operation);
      } catch (error) {
        // Retry logic
        if (item.retry < 3) {
          item.retry++;
          this.syncQueue.push(item);
        }
      }
    }
  }
}
```

---

## 🔒 Sécurité et Authentification

### Headers de Sécurité
```javascript
// Configuration sécurité
const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};
```

### Validation des Entrées
```javascript
class InputValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static sanitizeHtml(input) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return input.replace(/[&<>"'/]/g, (s) => map[s]);
  }
  
  static validateProspectData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Nom requis (minimum 2 caractères)');
    }
    
    if (!data.company || data.company.trim().length < 2) {
      errors.push('Entreprise requise (minimum 2 caractères)');
    }
    
    if (data.email && !this.validateEmail(data.email)) {
      errors.push('Format d\'email invalide');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### Rate Limiting
```javascript
class RateLimiter {
  constructor() {
    this.limits = new Map();
  }
  
  isAllowed(key, maxRequests, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.limits.has(key)) {
      this.limits.set(key, []);
    }
    
    const requests = this.limits.get(key);
    
    // Nettoyer les anciennes requêtes
    const validRequests = requests.filter(time => time > windowStart);
    this.limits.set(key, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
  
  getRemainingRequests(key, maxRequests, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    const requests = this.limits.get(key) || [];
    const validRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, maxRequests - validRequests.length);
  }
}
```

---

## 📱 Optimisations Mobile

### Détection d'Appareil
```javascript
class DeviceDetector {
  constructor() {
    this.userAgent = navigator.userAgent;
    this.isMobile = this.detectMobile();
    this.isTablet = this.detectTablet();
    this.isTouch = 'ontouchstart' in window;
    this.orientation = this.getOrientation();
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);
  }
  
  detectTablet() {
    return /iPad|Android(?!.*Mobile)/i.test(this.userAgent);
  }
  
  getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }
  
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
```

### Gestes Tactiles
```javascript
class TouchGestureHandler {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }
  
  handleTouchMove(e) {
    if (!this.startX || !this.startY) return;
    
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
  }
  
  handleTouchEnd(e) {
    if (!this.startX || !this.startY) return;
    
    const diffX = this.startX - this.currentX;
    const diffY = this.startY - this.currentY;
    
    // Détection swipe horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.onSwipeLeft();
      } else {
        this.onSwipeRight();
      }
    }
    
    // Détection swipe vertical
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0) {
        this.onSwipeUp();
      } else {
        this.onSwipeDown();
      }
    }
    
    this.resetTouch();
  }
  
  resetTouch() {
    this.startX = this.startY = this.currentX = this.currentY = 0;
  }
  
  onSwipeLeft() { /* Override */ }
  onSwipeRight() { /* Override */ }
  onSwipeUp() { /* Override */ }
  onSwipeDown() { /* Override */ }
}
```

---

## 🧪 Tests et Qualité

### Suite de Tests
```javascript
// Lancement des tests
console.log('🧪 Lancement des tests Graixl...');

// Test automatisé avec runGraixlTests()
const testResults = await runGraixlTests();

console.log(`📊 Résultats: ${testResults.passed}/${testResults.total} tests passés`);
console.log(`⏱️ Durée: ${testResults.duration}ms`);
console.log(`📈 Taux de succès: ${testResults.successRate}%`);
```

### Tests d'Intégration Continue
```yaml
# .github/workflows/tests.yml
name: Graixl Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run performance tests
        run: npm run test:performance
        
      - name: Generate coverage report
        run: npm run test:coverage
```

### Monitoring de Performance
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.thresholds = {
      loadTime: 3000,
      renderTime: 100,
      memoryUsage: 50 * 1024 * 1024 // 50MB
    };
  }
  
  measurePageLoad() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    this.recordMetric('page_load', loadTime);
    
    if (loadTime > this.thresholds.loadTime) {
      this.alertSlowPerformance('page_load', loadTime);
    }
  }
  
  measureComponentRender(componentName, renderFunction) {
    const start = performance.now();
    const result = renderFunction();
    const end = performance.now();
    
    const renderTime = end - start;
    this.recordMetric(`${componentName}_render`, renderTime);
    
    return result;
  }
  
  recordMetric(name, value) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      url: window.location.pathname
    });
  }
  
  alertSlowPerformance(metric, value) {
    console.warn(`⚠️ Performance dégradée: ${metric} = ${value}ms`);
    
    // Envoyer à un service de monitoring
    this.sendToMonitoring({
      type: 'performance_alert',
      metric,
      value,
      threshold: this.thresholds[metric] || 'unknown',
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
  }
}
```

---

## 🚀 Déploiement et Production

### Configuration Vercel

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### Variables d'Environnement
```bash
# Production
NODE_ENV=production
VERCEL_DEPLOYMENT=true

# APIs externes
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Email providers
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

SENDGRID_API_KEY=your_sendgrid_key
MAILGUN_API_KEY=your_mailgun_key

# Sécurité
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

### Scripts de Déploiement
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Déploiement Graixl..."

# Tests pré-déploiement
echo "🧪 Exécution des tests..."
npm run test:all

if [ $? -ne 0 ]; then
  echo "❌ Tests échoués - Déploiement annulé"
  exit 1
fi

# Build et optimisation
echo "📦 Build de production..."
npm run build:prod

# Déploiement Vercel
echo "☁️ Déploiement vers Vercel..."
vercel --prod

# Vérification post-déploiement
echo "✅ Vérification du déploiement..."
curl -f https://graixl-ecosystem.vercel.app/api/health || exit 1

echo "🎉 Déploiement réussi !"
```

### Monitoring de Production
```javascript
// Monitoring d'erreurs
window.addEventListener('error', (event) => {
  const errorInfo = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };
  
  // Envoyer à Sentry ou service similaire
  sendErrorToMonitoring(errorInfo);
});

// Monitoring des API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const start = performance.now();
  
  return originalFetch.apply(this, args)
    .then(response => {
      const duration = performance.now() - start;
      
      // Logger les performances API
      logAPICall({
        url: args[0],
        method: args[1]?.method || 'GET',
        status: response.status,
        duration,
        timestamp: Date.now()
      });
      
      return response;
    })
    .catch(error => {
      // Logger les erreurs API
      logAPIError({
        url: args[0],
        method: args[1]?.method || 'GET',
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    });
};
```

---

## 🔧 Maintenance et Évolution

### Logs et Debugging
```javascript
class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }
  
  log(level, message, data = {}) {
    if (this.levels[level] >= this.levels[this.level]) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      console[level](logEntry);
      
      // Envoyer aux services de monitoring en production
      if (level === 'error' || level === 'warn') {
        this.sendToMonitoring(logEntry);
      }
    }
  }
  
  debug(message, data) { this.log('debug', message, data); }
  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
}

// Utilisation globale
window.logger = new Logger(
  process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
);
```

### Versioning et Migrations
```javascript
class VersionManager {
  constructor() {
    this.currentVersion = '2.0.0';
    this.migrations = new Map();
    
    this.registerMigrations();
  }
  
  registerMigrations() {
    // Migration 1.0 -> 2.0
    this.migrations.set('1.0.0', {
      version: '2.0.0',
      migrate: (data) => {
        // Migrer la structure des prospects
        if (data.prospects) {
          data.prospects = data.prospects.map(prospect => ({
            ...prospect,
            interactions: prospect.interactions || [],
            customFields: prospect.customFields || {}
          }));
        }
        
        return data;
      }
    });
  }
  
  async migrateIfNeeded() {
    const currentVersion = localStorage.getItem('graixl_version');
    
    if (!currentVersion || currentVersion !== this.currentVersion) {
      await this.runMigrations(currentVersion);
      localStorage.setItem('graixl_version', this.currentVersion);
    }
  }
  
  async runMigrations(fromVersion) {
    console.log(`🔄 Migration ${fromVersion} → ${this.currentVersion}`);
    
    // Logique de migration selon les versions
    const data = this.loadAllData();
    let migratedData = data;
    
    for (const [version, migration] of this.migrations.entries()) {
      if (this.needsMigration(fromVersion, version)) {
        migratedData = migration.migrate(migratedData);
      }
    }
    
    this.saveAllData(migratedData);
    console.log('✅ Migration terminée');
  }
}
```

---

## 📞 Support et Debugging

### Outils de Debug
```javascript
// Console de debug avancée
window.graixlDebug = {
  // Exporter toutes les données
  exportData() {
    const data = {
      prospects: Array.from(prospects || []),
      campaigns: Array.from(campaigns || []),
      settings: localStorage,
      version: '2.0.0',
      timestamp: new Date()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `graixl-debug-${Date.now()}.json`;
    a.click();
  },
  
  // Nettoyer les données
  clearData() {
    if (confirm('⚠️ Supprimer toutes les données locales ?')) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  },
  
  // Tester les APIs
  async testAPIs() {
    const apis = [
      '/api/prospection-engine?action=health',
      '/api/automation-engine?action=list',
      '/api/email-integration?action=templates'
    ];
    
    for (const api of apis) {
      try {
        const response = await fetch(api);
        console.log(`✅ ${api}: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${api}: ${error.message}`);
      }
    }
  },
  
  // Simuler des données de test
  generateTestData() {
    // Générer prospects de test
    const testProspects = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Test Prospect ${i + 1}`,
      company: `Test Company ${i + 1}`,
      title: 'Test Title',
      email: `test${i + 1}@example.com`,
      status: ['new', 'contacted', 'interested'][i % 3],
      score: Math.floor(Math.random() * 40) + 60
    }));
    
    localStorage.setItem('graixl_test_prospects', 
      JSON.stringify(testProspects));
    
    console.log('✅ Données de test générées');
  }
};
```

### Diagnostics Automatiques
```javascript
class HealthChecker {
  async runDiagnostics() {
    const results = {
      browser: this.checkBrowser(),
      storage: this.checkStorage(),
      apis: await this.checkAPIs(),
      performance: this.checkPerformance(),
      connectivity: await this.checkConnectivity()
    };
    
    const issues = this.analyzeResults(results);
    
    return {
      status: issues.length === 0 ? 'healthy' : 'issues',
      results,
      issues,
      recommendations: this.getRecommendations(issues)
    };
  }
  
  checkBrowser() {
    return {
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      localStorageSupported: typeof Storage !== 'undefined',
      fetchSupported: typeof fetch !== 'undefined',
      promiseSupported: typeof Promise !== 'undefined'
    };
  }
  
  checkStorage() {
    try {
      const testKey = 'graixl_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      return {
        localStorage: true,
        usage: this.getStorageUsage()
      };
    } catch (error) {
      return {
        localStorage: false,
        error: error.message
      };
    }
  }
  
  getStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return {
      used: total,
      limit: 5 * 1024 * 1024, // 5MB estimation
      percentage: (total / (5 * 1024 * 1024)) * 100
    };
  }
}
```

---

Cette documentation technique couvre l'ensemble de l'architecture, des APIs, et des aspects techniques de la plateforme Graixl. Elle est conçue pour faciliter la maintenance, le debugging, et l'évolution future du système.

Pour toute question technique spécifique ou assistance, contactez : `tech-support@graixl.com`

*Documentation mise à jour le 04/10/2024 - Version technique 2.0*