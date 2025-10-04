/**
 * 🎯 API Campagnes Graixl - Logique Métier Complète
 * Gestion du cycle de vie complet des campagnes de prospection
 */

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// === MODÈLES MÉTIER ===

class Campaign {
  constructor(data) {
    this.id = data.id || `campaign_${Date.now()}`;
    this.name = data.name;
    this.status = data.status || 'draft';
    this.criteria = new SearchCriteria(data.criteria || {});
    this.messaging = new MessagingConfig(data.messaging || {});
    this.scheduling = new SchedulingConfig(data.scheduling || {});
    this.prospects = new Map();
    this.metrics = new CampaignMetrics();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.startedAt = null;
    this.completedAt = null;
  }

  // Logique métier - Transitions d'état
  start() {
    if (this.status !== 'draft') {
      throw new Error('Campaign can only be started from draft status');
    }
    
    this.status = 'active';
    this.startedAt = new Date();
    this.updatedAt = new Date();
    return this;
  }

  pause() {
    if (this.status !== 'active') {
      throw new Error('Only active campaigns can be paused');
    }
    
    this.status = 'paused';
    this.updatedAt = new Date();
    return this;
  }

  resume() {
    if (this.status !== 'paused') {
      throw new Error('Only paused campaigns can be resumed');
    }
    
    this.status = 'active';
    this.updatedAt = new Date();
    return this;
  }

  complete() {
    if (!['active', 'paused'].includes(this.status)) {
      throw new Error('Only active or paused campaigns can be completed');
    }
    
    this.status = 'completed';
    this.completedAt = new Date();
    this.updatedAt = new Date();
    return this;
  }

  // Logique métier - Gestion des prospects
  addProspect(prospectData) {
    const prospect = new Prospect(prospectData);
    prospect.campaignId = this.id;
    this.prospects.set(prospect.id, prospect);
    this.metrics.updateTotalProspects(this.prospects.size);
    return prospect;
  }

  updateProspectStatus(prospectId, newStatus, interaction = null) {
    const prospect = this.prospects.get(prospectId);
    if (!prospect) {
      throw new Error('Prospect not found');
    }

    const oldStatus = prospect.status;
    prospect.updateStatus(newStatus);
    
    if (interaction) {
      prospect.addInteraction(interaction);
    }

    this.metrics.updateStatusChange(oldStatus, newStatus);
    this.updatedAt = new Date();
    
    return prospect;
  }

  // Validation métier
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 3) {
      errors.push('Campaign name must be at least 3 characters');
    }
    
    if (!this.criteria.validate()) {
      errors.push('Invalid search criteria');
    }
    
    if (!this.messaging.validate()) {
      errors.push('Invalid messaging configuration');
    }
    
    return errors;
  }

  // Métriques calculées
  getPerformanceMetrics() {
    return {
      totalProspects: this.prospects.size,
      contacted: Array.from(this.prospects.values()).filter(p => p.status !== 'new').length,
      interested: Array.from(this.prospects.values()).filter(p => p.status === 'interested').length,
      meetings: Array.from(this.prospects.values()).filter(p => p.status === 'meeting').length,
      clients: Array.from(this.prospects.values()).filter(p => p.status === 'client').length,
      responseRate: this.metrics.calculateResponseRate(),
      conversionRate: this.metrics.calculateConversionRate(),
      roi: this.metrics.calculateROI()
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      criteria: this.criteria.toJSON(),
      messaging: this.messaging.toJSON(),
      scheduling: this.scheduling.toJSON(),
      prospects: Array.from(this.prospects.values()).map(p => p.toJSON()),
      metrics: this.getPerformanceMetrics(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt
    };
  }
}

class SearchCriteria {
  constructor(data) {
    this.jobTitles = data.jobTitles || '';
    this.industries = data.industries || '';
    this.locations = data.locations || '';
    this.companySize = data.companySize || '';
    this.targetCount = data.targetCount || 100;
    this.keywords = data.keywords || '';
  }

  validate() {
    return this.jobTitles.trim().length > 0 && this.targetCount > 0;
  }

  toJSON() {
    return {
      jobTitles: this.jobTitles,
      industries: this.industries,
      locations: this.locations,
      companySize: this.companySize,
      targetCount: this.targetCount,
      keywords: this.keywords
    };
  }
}

class MessagingConfig {
  constructor(data) {
    this.useLinkedIn = data.useLinkedIn !== false;
    this.useEmail = data.useEmail !== false;
    this.usePhone = data.usePhone || false;
    this.linkedinMessage = data.linkedinMessage || '';
    this.followupEmail = data.followupEmail || '';
    this.followupDelay = data.followupDelay || 3;
    this.maxFollowups = data.maxFollowups || 2;
  }

  validate() {
    if (this.useLinkedIn && !this.linkedinMessage.trim()) {
      return false;
    }
    return this.useLinkedIn || this.useEmail || this.usePhone;
  }

  toJSON() {
    return {
      useLinkedIn: this.useLinkedIn,
      useEmail: this.useEmail,
      usePhone: this.usePhone,
      linkedinMessage: this.linkedinMessage,
      followupEmail: this.followupEmail,
      followupDelay: this.followupDelay,
      maxFollowups: this.maxFollowups
    };
  }
}

class SchedulingConfig {
  constructor(data) {
    this.startDate = data.startDate || new Date().toISOString().split('T')[0];
    this.endDate = data.endDate || null;
    this.sendingSpeed = data.sendingSpeed || 'moderate';
    this.workingHours = data.workingHours || 'business';
    this.weekendPause = data.weekendPause || true;
    this.aiOptimization = data.aiOptimization !== false;
    this.autoStop = data.autoStop !== false;
  }

  toJSON() {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
      sendingSpeed: this.sendingSpeed,
      workingHours: this.workingHours,
      weekendPause: this.weekendPause,
      aiOptimization: this.aiOptimization,
      autoStop: this.autoStop
    };
  }
}

class Prospect {
  constructor(data) {
    this.id = data.id || `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.company = data.company;
    this.title = data.title;
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.linkedinUrl = data.linkedinUrl || '';
    this.status = data.status || 'new';
    this.priority = data.priority || 'medium';
    this.score = data.score || this.calculateScore();
    this.campaignId = data.campaignId;
    this.interactions = data.interactions || [];
    this.tags = data.tags || [];
    this.addedAt = new Date();
    this.lastContactAt = data.lastContactAt || null;
  }

  calculateScore() {
    let score = 50; // Score de base
    
    // Bonus pour email trouvé
    if (this.email) score += 20;
    
    // Bonus pour LinkedIn
    if (this.linkedinUrl) score += 15;
    
    // Bonus pour titre senior
    const seniorTitles = ['director', 'head', 'manager', 'vp', 'ceo', 'cto', 'cmo'];
    if (seniorTitles.some(title => this.title.toLowerCase().includes(title))) {
      score += 15;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    if (['contacted', 'interested', 'meeting', 'client'].includes(newStatus)) {
      this.lastContactAt = new Date();
    }
  }

  addInteraction(interaction) {
    this.interactions.push({
      id: `interaction_${Date.now()}`,
      type: interaction.type,
      title: interaction.title,
      description: interaction.description,
      date: new Date(),
      ...interaction
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
      status: this.status,
      priority: this.priority,
      score: this.score,
      campaignId: this.campaignId,
      interactions: this.interactions,
      tags: this.tags,
      addedAt: this.addedAt,
      lastContactAt: this.lastContactAt
    };
  }
}

class CampaignMetrics {
  constructor() {
    this.totalProspects = 0;
    this.statusCounts = {
      new: 0,
      contacted: 0,
      interested: 0,
      meeting: 0,
      client: 0
    };
    this.interactions = [];
    this.startTime = new Date();
  }

  updateTotalProspects(count) {
    this.totalProspects = count;
  }

  updateStatusChange(oldStatus, newStatus) {
    if (oldStatus && this.statusCounts[oldStatus] > 0) {
      this.statusCounts[oldStatus]--;
    }
    this.statusCounts[newStatus]++;
  }

  calculateResponseRate() {
    const contacted = this.statusCounts.contacted + this.statusCounts.interested + 
                     this.statusCounts.meeting + this.statusCounts.client;
    const responded = this.statusCounts.interested + this.statusCounts.meeting + this.statusCounts.client;
    
    return contacted > 0 ? Math.round((responded / contacted) * 100) : 0;
  }

  calculateConversionRate() {
    const total = this.totalProspects;
    const clients = this.statusCounts.client;
    
    return total > 0 ? Math.round((clients / total) * 100) : 0;
  }

  calculateROI() {
    // ROI simplifié basé sur le nombre de clients
    const clients = this.statusCounts.client;
    const avgDealValue = 5000; // Valeur moyenne d'un client Graixl
    const campaignCost = 500; // Coût estimé de la campagne
    
    if (campaignCost === 0) return 0;
    
    const revenue = clients * avgDealValue;
    return Math.round(((revenue - campaignCost) / campaignCost) * 100);
  }
}

// === STOCKAGE EN MÉMOIRE ===
const campaignsStorage = new Map();
const prospectsStorage = new Map();

// Données de démo
function initializeDemoData() {
  const demoCampaign = new Campaign({
    id: 'demo_1',
    name: 'Directeurs Marketing SaaS France',
    status: 'active',
    criteria: {
      jobTitles: 'Directeur Marketing, CMO, Head of Marketing',
      industries: 'SaaS, Software Development, Fintech',
      locations: 'France',
      companySize: '51-200',
      targetCount: 100
    },
    messaging: {
      useLinkedIn: true,
      useEmail: true,
      linkedinMessage: 'Bonjour [PRENOM], je développe Graixl...',
      followupEmail: 'Objet: [ENTREPRISE] - Solution IA...'
    }
  });

  // Ajouter des prospects de démo
  const demoProspects = [
    {
      name: 'Marie Dubois',
      company: 'TechStart Solutions',
      title: 'Directrice Marketing Digital',
      email: 'marie.dubois@techstart.fr',
      status: 'new',
      priority: 'high',
      score: 92
    },
    {
      name: 'Pierre Martin',
      company: 'InnovCorp',
      title: 'CMO',
      email: 'p.martin@innovcorp.com',
      status: 'contacted',
      priority: 'high',
      score: 88
    },
    {
      name: 'Sophie Laurent',
      company: 'DataFlow Systems',
      title: 'Head of Marketing',
      email: 'sophie@dataflow.tech',
      status: 'interested',
      priority: 'high',
      score: 95
    }
  ];

  demoProspects.forEach(prospectData => {
    demoCampaign.addProspect(prospectData);
  });

  demoCampaign.start();
  campaignsStorage.set(demoCampaign.id, demoCampaign);
}

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
    const action = query.action || 'list';

    console.log(`🎯 Campaigns API: ${method} ${action}`);

    // Initialiser les données de démo si vide
    if (campaignsStorage.size === 0) {
      initializeDemoData();
    }

    switch (action) {
      case 'list':
        return await handleListCampaigns(req, res);
      
      case 'get':
        return await handleGetCampaign(req, res);
      
      case 'create':
        return await handleCreateCampaign(req, res);
      
      case 'update':
        return await handleUpdateCampaign(req, res);
      
      case 'start':
        return await handleStartCampaign(req, res);
      
      case 'pause':
        return await handlePauseCampaign(req, res);
      
      case 'resume':
        return await handleResumeCampaign(req, res);
      
      case 'complete':
        return await handleCompleteCampaign(req, res);
      
      case 'delete':
        return await handleDeleteCampaign(req, res);
      
      case 'prospects':
        return await handleGetCampaignProspects(req, res);
      
      case 'add-prospect':
        return await handleAddProspect(req, res);
      
      case 'update-prospect':
        return await handleUpdateProspect(req, res);
      
      case 'metrics':
        return await handleGetMetrics(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: [
            'list', 'get', 'create', 'update', 'start', 'pause', 'resume', 
            'complete', 'delete', 'prospects', 'add-prospect', 'update-prospect', 'metrics'
          ]
        });
    }

  } catch (error) {
    console.error('❌ Campaigns API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
}

async function handleListCampaigns(req, res) {
  try {
    const campaigns = Array.from(campaignsStorage.values()).map(c => c.toJSON());
    
    return res.status(200).json({
      success: true,
      campaigns,
      total: campaigns.length,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetCampaign(req, res) {
  try {
    const { id } = req.query;
    const campaign = campaignsStorage.get(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    return res.status(200).json({
      success: true,
      campaign: campaign.toJSON(),
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleCreateCampaign(req, res) {
  try {
    const campaignData = req.body;
    
    const campaign = new Campaign(campaignData);
    const errors = campaign.validate();
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Validation failed'
      });
    }

    campaignsStorage.set(campaign.id, campaign);

    return res.status(201).json({
      success: true,
      campaign: campaign.toJSON(),
      message: 'Campaign created successfully',
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleStartCampaign(req, res) {
  try {
    const { id } = req.query;
    const campaign = campaignsStorage.get(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    campaign.start();

    return res.status(200).json({
      success: true,
      campaign: campaign.toJSON(),
      message: 'Campaign started successfully',
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function handlePauseCampaign(req, res) {
  try {
    const { id } = req.query;
    const campaign = campaignsStorage.get(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    campaign.pause();

    return res.status(200).json({
      success: true,
      campaign: campaign.toJSON(),
      message: 'Campaign paused successfully',
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function handleAddProspect(req, res) {
  try {
    const { campaignId } = req.query;
    const prospectData = req.body;
    
    const campaign = campaignsStorage.get(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    const prospect = campaign.addProspect(prospectData);

    return res.status(201).json({
      success: true,
      prospect: prospect.toJSON(),
      message: 'Prospect added successfully',
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleUpdateProspect(req, res) {
  try {
    const { campaignId, prospectId } = req.query;
    const { status, interaction } = req.body;
    
    const campaign = campaignsStorage.get(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    const prospect = campaign.updateProspectStatus(prospectId, status, interaction);

    return res.status(200).json({
      success: true,
      prospect: prospect.toJSON(),
      message: 'Prospect updated successfully',
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetMetrics(req, res) {
  try {
    const { id } = req.query;
    
    if (id) {
      // Métriques pour une campagne spécifique
      const campaign = campaignsStorage.get(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      return res.status(200).json({
        success: true,
        metrics: campaign.getPerformanceMetrics(),
        timestamp: new Date()
      });
    } else {
      // Métriques globales
      const allCampaigns = Array.from(campaignsStorage.values());
      const globalMetrics = {
        totalCampaigns: allCampaigns.length,
        activeCampaigns: allCampaigns.filter(c => c.status === 'active').length,
        totalProspects: allCampaigns.reduce((total, c) => total + c.prospects.size, 0),
        totalClients: allCampaigns.reduce((total, c) => {
          return total + Array.from(c.prospects.values()).filter(p => p.status === 'client').length;
        }, 0),
        avgConversionRate: allCampaigns.length > 0 ? 
          Math.round(allCampaigns.reduce((total, c) => total + c.getPerformanceMetrics().conversionRate, 0) / allCampaigns.length) : 0
      };

      return res.status(200).json({
        success: true,
        metrics: globalMetrics,
        timestamp: new Date()
      });
    }
  } catch (error) {
    throw error;
  }
}