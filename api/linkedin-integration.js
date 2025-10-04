/**
 * 🔗 Intégration LinkedIn Graixl - Recherche et Messagerie
 * Interface complète avec LinkedIn pour prospection
 */

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// === GESTIONNAIRE LINKEDIN ===

class LinkedInIntegration {
  constructor() {
    this.isAuthenticated = false;
    this.searchLimits = {
      daily: 100,
      hourly: 20,
      current: { daily: 0, hourly: 0 }
    };
    this.messageLimits = {
      daily: 100,
      hourly: 15,
      current: { daily: 0, hourly: 0 }
    };
    this.session = null;
    this.rateLimiter = new LinkedInRateLimiter();
  }

  /**
   * 🔐 Authentification LinkedIn
   */
  async authenticate(credentials) {
    console.log('🔐 Authentification LinkedIn...');
    
    try {
      // Simulation d'authentification
      await this.delay(1000);
      
      if (!credentials.email || !credentials.password) {
        throw new Error('Email et mot de passe requis');
      }

      // Simulation de vérification des credentials
      const isValid = this.validateCredentials(credentials);
      if (!isValid) {
        throw new Error('Identifiants invalides');
      }

      this.isAuthenticated = true;
      this.session = {
        sessionId: `session_${Date.now()}`,
        email: credentials.email,
        loginTime: new Date(),
        lastActivity: new Date(),
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255)
      };

      console.log('✅ Authentification LinkedIn réussie');
      
      return {
        success: true,
        sessionId: this.session.sessionId,
        message: 'Authentification réussie',
        userInfo: {
          email: credentials.email,
          loginTime: this.session.loginTime
        }
      };

    } catch (error) {
      console.error('❌ Erreur authentification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 🔍 Recherche de prospects sur LinkedIn
   */
  async searchProspects(criteria, options = {}) {
    console.log('🔍 Recherche LinkedIn avec critères:', criteria);

    if (!this.isAuthenticated) {
      throw new Error('LinkedIn authentication required');
    }

    // Vérifier les limites de taux
    if (!this.rateLimiter.canMakeSearchRequest()) {
      throw new Error('Search rate limit exceeded');
    }

    try {
      // Construire la requête de recherche
      const searchQuery = this.buildSearchQuery(criteria);
      console.log('🎯 Requête construite:', searchQuery);

      // Simulation de recherche LinkedIn
      await this.delay(2000 + Math.random() * 1000); // 2-3 secondes

      const results = await this.executeLinkedInSearch(searchQuery, options);
      
      this.rateLimiter.recordSearchRequest();
      this.updateSessionActivity();

      console.log(`📋 ${results.prospects.length} prospects trouvés`);

      return {
        success: true,
        prospects: results.prospects,
        total: results.total,
        searchQuery,
        metadata: {
          searchTime: new Date(),
          sessionId: this.session.sessionId,
          remainingQuota: this.rateLimiter.getRemainingQuota('search'),
          searchId: `search_${Date.now()}`
        }
      };

    } catch (error) {
      console.error('❌ Erreur recherche LinkedIn:', error);
      return {
        success: false,
        error: error.message,
        prospects: [],
        total: 0
      };
    }
  }

  /**
   * 📧 Envoyer message LinkedIn
   */
  async sendMessage(prospectId, message, options = {}) {
    console.log(`📧 Envoi message LinkedIn à ${prospectId}`);

    if (!this.isAuthenticated) {
      throw new Error('LinkedIn authentication required');
    }

    if (!this.rateLimiter.canMakeMessageRequest()) {
      throw new Error('Message rate limit exceeded');
    }

    try {
      // Vérifier la connexion avec le prospect
      const connectionStatus = await this.checkConnection(prospectId);
      if (!connectionStatus.canMessage) {
        throw new Error(`Cannot message prospect: ${connectionStatus.reason}`);
      }

      // Personnaliser le message
      const personalizedMessage = await this.personalizeMessage(message, prospectId);

      // Simulation d'envoi
      await this.delay(1500 + Math.random() * 500);

      const messageResult = await this.executeMessageSend(prospectId, personalizedMessage, options);
      
      this.rateLimiter.recordMessageRequest();
      this.updateSessionActivity();

      console.log('✅ Message LinkedIn envoyé avec succès');

      return {
        success: true,
        messageId: messageResult.messageId,
        prospectId,
        message: personalizedMessage,
        sentAt: new Date(),
        metadata: {
          sessionId: this.session.sessionId,
          remainingQuota: this.rateLimiter.getRemainingQuota('message'),
          deliveryStatus: 'sent'
        }
      };

    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      return {
        success: false,
        error: error.message,
        prospectId
      };
    }
  }

  /**
   * 🤝 Envoyer demande de connexion
   */
  async sendConnectionRequest(prospectId, note = '', options = {}) {
    console.log(`🤝 Demande de connexion à ${prospectId}`);

    if (!this.isAuthenticated) {
      throw new Error('LinkedIn authentication required');
    }

    if (!this.rateLimiter.canMakeConnectionRequest()) {
      throw new Error('Connection request rate limit exceeded');
    }

    try {
      // Vérifier si déjà connecté
      const connectionStatus = await this.checkConnection(prospectId);
      if (connectionStatus.isConnected) {
        throw new Error('Already connected to this prospect');
      }

      // Personnaliser la note
      const personalizedNote = await this.personalizeConnectionNote(note, prospectId);

      // Simulation d'envoi de demande
      await this.delay(1000 + Math.random() * 500);

      const requestResult = await this.executeConnectionRequest(prospectId, personalizedNote, options);
      
      this.rateLimiter.recordConnectionRequest();
      this.updateSessionActivity();

      console.log('✅ Demande de connexion envoyée');

      return {
        success: true,
        requestId: requestResult.requestId,
        prospectId,
        note: personalizedNote,
        sentAt: new Date(),
        metadata: {
          sessionId: this.session.sessionId,
          remainingQuota: this.rateLimiter.getRemainingQuota('connection'),
          status: 'pending'
        }
      };

    } catch (error) {
      console.error('❌ Erreur demande connexion:', error);
      return {
        success: false,
        error: error.message,
        prospectId
      };
    }
  }

  /**
   * 👥 Obtenir profil prospect
   */
  async getProspectProfile(prospectId) {
    console.log(`👥 Récupération profil ${prospectId}`);

    if (!this.isAuthenticated) {
      throw new Error('LinkedIn authentication required');
    }

    try {
      await this.delay(800 + Math.random() * 400);

      const profile = await this.fetchLinkedInProfile(prospectId);
      this.updateSessionActivity();

      return {
        success: true,
        profile,
        retrievedAt: new Date(),
        metadata: {
          sessionId: this.session.sessionId,
          profileId: prospectId
        }
      };

    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      return {
        success: false,
        error: error.message,
        prospectId
      };
    }
  }

  // === MÉTHODES PRIVÉES ===

  validateCredentials(credentials) {
    // Simulation de validation
    const validEmails = [
      'demo@graixl.com',
      'test@graixl.com',
      'admin@graixl.com'
    ];
    return validEmails.includes(credentials.email) && credentials.password === 'demo123';
  }

  buildSearchQuery(criteria) {
    const query = {
      keywords: [],
      filters: {},
      location: [],
      company: []
    };

    // Traiter les titres de poste
    if (criteria.jobTitles) {
      query.keywords.push(...criteria.jobTitles.split(',').map(t => t.trim()));
    }

    // Traiter les secteurs
    if (criteria.industries) {
      query.filters.industry = criteria.industries.split(',').map(i => i.trim());
    }

    // Traiter les localisations
    if (criteria.locations) {
      query.location.push(...criteria.locations.split(',').map(l => l.trim()));
    }

    // Traiter la taille d'entreprise
    if (criteria.companySize) {
      query.filters.companySize = criteria.companySize;
    }

    return query;
  }

  async executeLinkedInSearch(searchQuery, options) {
    console.log('⚡ Exécution recherche LinkedIn...');

    // Simulation de résultats de recherche
    const prospects = this.generateLinkedInProspects(searchQuery, options);
    
    return {
      prospects,
      total: prospects.length,
      hasMore: prospects.length >= 25, // Indication s'il y a plus de résultats
      nextPageToken: prospects.length >= 25 ? `page_${Date.now()}` : null
    };
  }

  generateLinkedInProspects(searchQuery, options) {
    const prospects = [];
    const maxResults = Math.min(options.limit || 25, 50); // Limite à 50 par requête
    const actualResults = Math.floor(Math.random() * maxResults * 0.3) + Math.floor(maxResults * 0.7); // 70-100% du max

    // Base de données de profils réalistes
    const profileDatabase = this.getProfileDatabase();
    
    for (let i = 0; i < actualResults; i++) {
      const template = this.getRandomProfileTemplate(profileDatabase, searchQuery);
      const prospect = this.generateDetailedProspect(template, i);
      prospects.push(prospect);
    }

    return prospects;
  }

  getProfileDatabase() {
    return {
      tech: {
        names: ['Alexandre Martin', 'Sophie Dubois', 'Thomas Laurent', 'Marie Bernard', 'Pierre Moreau'],
        companies: ['TechFlow', 'DataCorp', 'CloudFirst', 'AILab', 'DevPro'],
        titles: ['CTO', 'Head of Engineering', 'VP Technology', 'Lead Developer', 'Tech Director'],
        industries: ['Software Development', 'SaaS', 'AI/ML', 'Cloud Computing'],
        locations: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux']
      },
      marketing: {
        names: ['Camille Rousseau', 'Julien Petit', 'Emma Leroy', 'Lucas Garcia', 'Léa Martinez'],
        companies: ['MarketPro', 'GrowthLab', 'BrandFlow', 'DigitalBoost', 'CreativeEdge'],
        titles: ['CMO', 'Head of Marketing', 'Marketing Director', 'Growth Manager', 'Brand Manager'],
        industries: ['Marketing', 'Advertising', 'Digital Marketing', 'E-commerce'],
        locations: ['Paris', 'Nantes', 'Lille', 'Strasbourg', 'Nice']
      },
      sales: {
        names: ['Nicolas Roux', 'Charlotte Simon', 'Maxime Michel', 'Amélie Robert', 'Antoine Muller'],
        companies: ['SalesPro', 'RevGen', 'GrowthCorp', 'PipelineMax', 'ConvertLab'],
        titles: ['VP Sales', 'Sales Director', 'Head of Sales', 'Sales Manager', 'Business Development'],
        industries: ['Sales', 'Business Development', 'SaaS Sales', 'Enterprise Sales'],
        locations: ['Paris', 'Lyon', 'Toulouse', 'Bordeaux', 'Montpellier']
      }
    };
  }

  getRandomProfileTemplate(database, searchQuery) {
    // Déterminer la catégorie basée sur les mots-clés de recherche
    const keywords = searchQuery.keywords.join(' ').toLowerCase();
    let category = 'tech'; // Par défaut

    if (keywords.includes('marketing') || keywords.includes('cmo') || keywords.includes('growth')) {
      category = 'marketing';
    } else if (keywords.includes('sales') || keywords.includes('business') || keywords.includes('revenue')) {
      category = 'sales';
    } else if (keywords.includes('tech') || keywords.includes('cto') || keywords.includes('engineer')) {
      category = 'tech';
    }

    const template = database[category];
    return {
      name: this.getRandomItem(template.names),
      company: this.getRandomItem(template.companies),
      title: this.getRandomItem(template.titles),
      industry: this.getRandomItem(template.industries),
      location: this.getRandomItem(template.locations),
      category
    };
  }

  generateDetailedProspect(template, index) {
    const firstName = template.name.split(' ')[0];
    const lastName = template.name.split(' ')[1] || '';
    
    return {
      id: `linkedin_${Date.now()}_${index}`,
      linkedinId: `prospect_${this.generateLinkedInId()}`,
      name: template.name,
      firstName,
      lastName,
      title: template.title,
      company: template.company,
      industry: template.industry,
      location: template.location,
      linkedinUrl: `https://linkedin.com/in/${this.slugify(template.name)}-${this.generateShortId()}`,
      profileImage: `https://randomuser.me/api/portraits/men/${index % 99}.jpg`,
      isConnected: Math.random() < 0.1, // 10% déjà connectés
      connectionDegree: Math.random() < 0.3 ? 2 : 3, // 30% connections 2nd degré
      mutualConnections: Math.floor(Math.random() * 15),
      currentRole: {
        title: template.title,
        company: template.company,
        duration: this.generateRandomDuration(),
        description: this.generateRoleDescription(template)
      },
      experience: this.generateExperience(template),
      education: this.generateEducation(),
      skills: this.generateSkills(template.category),
      summary: this.generateSummary(template),
      contactInfo: {
        email: null, // Sera enrichi plus tard
        phone: null,
        website: Math.random() < 0.3 ? `https://${template.company.toLowerCase()}.com` : null
      },
      activity: {
        lastActive: this.generateLastActive(),
        postsLastMonth: Math.floor(Math.random() * 10),
        engagementRate: Math.round(Math.random() * 5 + 2) // 2-7%
      },
      searchMetadata: {
        matchScore: Math.round(Math.random() * 20 + 80), // 80-100%
        foundAt: new Date(),
        searchQuery: template.category,
        source: 'linkedin_search'
      }
    };
  }

  generateLinkedInId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  generateShortId() {
    return Math.random().toString(36).substring(2, 8);
  }

  generateRandomDuration() {
    const months = Math.floor(Math.random() * 36) + 6; // 6 mois à 3 ans
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
    } else if (years > 0) {
      return `${years} an${years > 1 ? 's' : ''}`;
    } else {
      return `${remainingMonths} mois`;
    }
  }

  generateRoleDescription(template) {
    const descriptions = {
      tech: [
        'Responsable de l\'architecture technique et de l\'équipe de développement',
        'Pilotage de la transformation digitale et de l\'innovation technologique',
        'Direction des équipes engineering et définition de la roadmap technique'
      ],
      marketing: [
        'Développement de la stratégie marketing et génération de leads',
        'Responsable de la croissance et de l\'acquisition client',
        'Pilotage des campagnes marketing multi-canal et ROI'
      ],
      sales: [
        'Développement commercial et management des équipes de vente',
        'Responsable de la stratégie commerciale et des revenus',
        'Pilotage de la croissance et expansion sur nouveaux marchés'
      ]
    };
    
    const categoryDescriptions = descriptions[template.category] || descriptions.tech;
    return this.getRandomItem(categoryDescriptions);
  }

  generateExperience(template) {
    const experience = [];
    const numRoles = Math.floor(Math.random() * 3) + 2; // 2-4 expériences
    
    for (let i = 0; i < numRoles; i++) {
      experience.push({
        title: i === 0 ? template.title : this.generatePreviousTitle(template),
        company: i === 0 ? template.company : this.generatePreviousCompany(template),
        duration: this.generateRandomDuration(),
        description: this.generateRoleDescription(template)
      });
    }
    
    return experience;
  }

  generatePreviousTitle(template) {
    const previousTitles = {
      tech: ['Senior Developer', 'Technical Lead', 'Engineering Manager', 'Software Architect'],
      marketing: ['Marketing Manager', 'Digital Marketing Specialist', 'Growth Analyst', 'Brand Manager'],
      sales: ['Sales Manager', 'Account Executive', 'Business Developer', 'Key Account Manager']
    };
    
    const titles = previousTitles[template.category] || previousTitles.tech;
    return this.getRandomItem(titles);
  }

  generatePreviousCompany(template) {
    const companies = ['StartupTech', 'InnovCorp', 'TechSolutions', 'DigitalFlow', 'BusinessPro'];
    return this.getRandomItem(companies);
  }

  generateEducation() {
    const schools = ['HEC Paris', 'ESSEC', 'INSEAD', 'Centrale Paris', 'Polytechnique', 'ESCP', 'EM Lyon'];
    const degrees = ['MBA', 'Master', 'Ingénieur', 'Master of Science'];
    
    return [
      {
        school: this.getRandomItem(schools),
        degree: this.getRandomItem(degrees),
        field: 'Business Management',
        year: 2015 + Math.floor(Math.random() * 8)
      }
    ];
  }

  generateSkills(category) {
    const skillSets = {
      tech: ['JavaScript', 'Python', 'Cloud Computing', 'DevOps', 'Machine Learning', 'Kubernetes'],
      marketing: ['Digital Marketing', 'Growth Hacking', 'SEO/SEM', 'Analytics', 'Content Marketing', 'Marketing Automation'],
      sales: ['Sales Management', 'CRM', 'Lead Generation', 'Negotiation', 'Account Management', 'Business Development']
    };
    
    const skills = skillSets[category] || skillSets.tech;
    const numSkills = Math.floor(Math.random() * 4) + 3; // 3-6 compétences
    
    return this.shuffleArray([...skills]).slice(0, numSkills);
  }

  generateSummary(template) {
    const summaries = {
      tech: `${template.title} passionné par l'innovation technologique et le développement d'équipes performantes. Expert en architecture logicielle et transformation digitale avec une approche centrée sur les résultats business.`,
      marketing: `${template.title} spécialisé dans la croissance et l'acquisition client. Fort d'une expérience en marketing digital et growth hacking, je développe des stratégies data-driven pour maximiser le ROI.`,
      sales: `${template.title} avec un track record de croissance commerciale exceptionnelle. Expert en développement business et management d'équipes commerciales high-performance dans des environnements B2B exigeants.`
    };
    
    return summaries[template.category] || summaries.tech;
  }

  generateLastActive() {
    const daysAgo = Math.floor(Math.random() * 7); // 0-7 jours
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  async checkConnection(prospectId) {
    // Simulation de vérification de connexion
    await this.delay(300);
    
    const isConnected = Math.random() < 0.15; // 15% déjà connectés
    const canMessage = isConnected || Math.random() < 0.8; // 80% peuvent recevoir des messages
    
    return {
      isConnected,
      canMessage,
      reason: !canMessage ? 'Prospect not accepting messages from non-connections' : null,
      connectionDegree: isConnected ? 1 : (Math.random() < 0.3 ? 2 : 3)
    };
  }

  async personalizeMessage(message, prospectId) {
    // Simulation de personnalisation de message
    await this.delay(200);
    
    // Remplacer les variables de base
    let personalizedMessage = message
      .replace(/\[PRENOM\]/g, 'Pierre') // Simulé
      .replace(/\[ENTREPRISE\]/g, 'TechCorp') // Simulé
      .replace(/\[SECTEUR\]/g, 'SaaS') // Simulé
      .replace(/\[VOTRE_NOM\]/g, 'Équipe Graixl');
    
    return personalizedMessage;
  }

  async personalizeConnectionNote(note, prospectId) {
    return this.personalizeMessage(note, prospectId);
  }

  async executeMessageSend(prospectId, message, options) {
    // Simulation d'envoi de message
    await this.delay(1000);
    
    return {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      deliveredAt: new Date()
    };
  }

  async executeConnectionRequest(prospectId, note, options) {
    // Simulation de demande de connexion
    await this.delay(800);
    
    return {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      sentAt: new Date()
    };
  }

  async fetchLinkedInProfile(prospectId) {
    // Simulation de récupération de profil
    await this.delay(1200);
    
    // Retourner un profil détaillé simulé
    return this.generateDetailedProspect({ 
      name: 'Pierre Martin', 
      company: 'TechCorp', 
      title: 'CTO',
      category: 'tech',
      industry: 'Software',
      location: 'Paris'
    }, 0);
  }

  updateSessionActivity() {
    if (this.session) {
      this.session.lastActivity = new Date();
    }
  }

  // Méthodes utilitaires
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  slugify(text) {
    return text.toLowerCase()
               .replace(/\s+/g, '-')
               .replace(/[àáâãäå]/g, 'a')
               .replace(/[èéêë]/g, 'e')
               .replace(/[ìíîï]/g, 'i')
               .replace(/[òóôõö]/g, 'o')
               .replace(/[ùúûü]/g, 'u')
               .replace(/[^a-z0-9-]/g, '');
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 📊 Obtenir statistiques d'utilisation
   */
  getUsageStats() {
    return {
      session: this.session,
      isAuthenticated: this.isAuthenticated,
      limits: {
        search: {
          daily: this.searchLimits.daily,
          hourly: this.searchLimits.hourly,
          current: this.searchLimits.current,
          remaining: {
            daily: this.searchLimits.daily - this.searchLimits.current.daily,
            hourly: this.searchLimits.hourly - this.searchLimits.current.hourly
          }
        },
        message: {
          daily: this.messageLimits.daily,
          hourly: this.messageLimits.hourly,
          current: this.messageLimits.current,
          remaining: {
            daily: this.messageLimits.daily - this.messageLimits.current.daily,
            hourly: this.messageLimits.hourly - this.messageLimits.current.hourly
          }
        }
      },
      rateLimiter: this.rateLimiter.getStats()
    };
  }
}

// === GESTIONNAIRE DE TAUX DE LIMITE ===

class LinkedInRateLimiter {
  constructor() {
    this.requests = {
      search: [],
      message: [],
      connection: []
    };
    this.limits = {
      search: { hourly: 20, daily: 100 },
      message: { hourly: 15, daily: 100 },
      connection: { hourly: 10, daily: 50 }
    };
  }

  canMakeSearchRequest() {
    return this.canMakeRequest('search');
  }

  canMakeMessageRequest() {
    return this.canMakeRequest('message');
  }

  canMakeConnectionRequest() {
    return this.canMakeRequest('connection');
  }

  canMakeRequest(type) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Nettoyer les anciennes requêtes
    this.requests[type] = this.requests[type].filter(req => req > oneDayAgo);

    const hourlyRequests = this.requests[type].filter(req => req > oneHourAgo).length;
    const dailyRequests = this.requests[type].length;

    return hourlyRequests < this.limits[type].hourly && dailyRequests < this.limits[type].daily;
  }

  recordSearchRequest() {
    this.recordRequest('search');
  }

  recordMessageRequest() {
    this.recordRequest('message');
  }

  recordConnectionRequest() {
    this.recordRequest('connection');
  }

  recordRequest(type) {
    this.requests[type].push(new Date());
  }

  getRemainingQuota(type) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const hourlyRequests = this.requests[type].filter(req => req > oneHourAgo).length;
    const dailyRequests = this.requests[type].filter(req => req > oneDayAgo).length;

    return {
      hourly: this.limits[type].hourly - hourlyRequests,
      daily: this.limits[type].daily - dailyRequests
    };
  }

  getStats() {
    const stats = {};
    
    Object.keys(this.requests).forEach(type => {
      const remaining = this.getRemainingQuota(type);
      stats[type] = {
        limits: this.limits[type],
        remaining,
        used: {
          hourly: this.limits[type].hourly - remaining.hourly,
          daily: this.limits[type].daily - remaining.daily
        }
      };
    });

    return stats;
  }
}

// Instance globale
const linkedInIntegration = new LinkedInIntegration();

// === HANDLERS API ===

export default async function handler(req, res) {
  // Headers CORS
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query, body } = req;
    const action = query.action || 'status';

    console.log(`🔗 LinkedIn Integration: ${method} ${action}`);

    switch (action) {
      case 'authenticate':
        return await handleAuthenticate(req, res);
      
      case 'search':
        return await handleSearch(req, res);
      
      case 'message':
        return await handleSendMessage(req, res);
      
      case 'connect':
        return await handleConnectionRequest(req, res);
      
      case 'profile':
        return await handleGetProfile(req, res);
      
      case 'status':
        return await handleGetStatus(req, res);
      
      case 'stats':
        return await handleGetStats(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: ['authenticate', 'search', 'message', 'connect', 'profile', 'status', 'stats']
        });
    }

  } catch (error) {
    console.error('❌ LinkedIn Integration Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
}

async function handleAuthenticate(req, res) {
  try {
    const credentials = req.body;
    const result = await linkedInIntegration.authenticate(credentials);
    
    return res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleSearch(req, res) {
  try {
    const { criteria, options = {} } = req.body;
    const result = await linkedInIntegration.searchProspects(criteria, options);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function handleSendMessage(req, res) {
  try {
    const { prospectId, message, options = {} } = req.body;
    const result = await linkedInIntegration.sendMessage(prospectId, message, options);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function handleGetStats(req, res) {
  try {
    const stats = linkedInIntegration.getUsageStats();
    
    return res.status(200).json({
      success: true,
      stats,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}