/**
 * 🤖 Automation Engine Graixl - Orchestrateur Principal
 * Système d'automatisation intelligent pour la prospection B2B
 */

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// === AUTOMATION ENGINE PRINCIPAL ===

class AutomationEngine {
  constructor() {
    this.automations = new Map();
    this.triggers = new Map();
    this.actions = new Map();
    this.scheduler = new AutomationScheduler();
    this.monitor = new AutomationMonitor();
    this.analytics = new AutomationAnalytics();
    
    this.initializeComponents();
    this.registerDefaultTriggers();
    this.registerDefaultActions();
  }

  /**
   * 🚀 Créer une nouvelle automatisation
   */
  async createAutomation(config) {
    console.log(`🚀 Création automatisation: ${config.name}`);
    
    try {
      const automationId = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const automation = new Automation({
        id: automationId,
        ...config,
        status: 'created',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Validation de la configuration
      await this.validateAutomation(automation);
      
      this.automations.set(automationId, automation);
      
      // Enregistrer les déclencheurs
      await this.registerAutomationTriggers(automation);
      
      console.log(`✅ Automatisation ${automationId} créée et activée`);
      
      return {
        success: true,
        automationId,
        automation: automation.toJSON(),
        message: 'Automatisation créée avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur création automatisation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ⚡ Déclencher une automatisation
   */
  async triggerAutomation(triggerId, data = {}) {
    console.log(`⚡ Déclenchement: ${triggerId}`, data);
    
    try {
      const automations = this.getAutomationsByTrigger(triggerId);
      const results = [];
      
      for (const automation of automations) {
        if (automation.status === 'active') {
          const result = await this.executeAutomation(automation, data);
          results.push(result);
        }
      }
      
      return {
        success: true,
        triggerId,
        automationsExecuted: results.length,
        results,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('❌ Erreur déclenchement:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 🔄 Exécuter une automatisation
   */
  async executeAutomation(automation, triggerData = {}) {
    console.log(`🔄 Exécution automatisation: ${automation.name}`);
    
    try {
      automation.status = 'running';
      automation.lastTriggered = new Date();
      automation.executionCount++;
      
      const executionId = `exec_${Date.now()}_${automation.id}`;
      const execution = new AutomationExecution({
        id: executionId,
        automationId: automation.id,
        triggerData,
        startedAt: new Date()
      });
      
      // Vérifier les conditions
      if (!await this.checkConditions(automation, triggerData)) {
        execution.complete('skipped', 'Conditions not met');
        return execution.toJSON();
      }
      
      // Exécuter les actions en séquence
      for (let i = 0; i < automation.actions.length; i++) {
        const action = automation.actions[i];
        console.log(`📋 Exécution action ${i + 1}/${automation.actions.length}: ${action.type}`);
        
        try {
          const actionResult = await this.executeAction(action, triggerData, execution);
          execution.addActionResult(action.id, actionResult);
          
          // Délai entre actions si spécifié
          if (action.delay && i < automation.actions.length - 1) {
            await this.delay(action.delay);
          }
          
        } catch (actionError) {
          console.error(`❌ Erreur action ${action.type}:`, actionError);
          execution.addError(actionError);
          
          // Gestion d'erreur selon la configuration
          if (automation.config.stopOnError) {
            throw actionError;
          }
        }
      }
      
      automation.status = 'active';
      automation.lastSuccessfulExecution = new Date();
      execution.complete('success', 'All actions executed successfully');
      
      // Enregistrer les métriques
      this.analytics.recordExecution(automation, execution);
      
      return execution.toJSON();
      
    } catch (error) {
      console.error(`❌ Erreur exécution automatisation ${automation.id}:`, error);
      automation.status = 'error';
      automation.lastError = {
        message: error.message,
        timestamp: new Date()
      };
      return {
        success: false,
        error: error.message,
        automationId: automation.id
      };
    }
  }

  /**
   * ✅ Vérifier les conditions d'une automatisation
   */
  async checkConditions(automation, data) {
    if (!automation.conditions || automation.conditions.length === 0) {
      return true;
    }
    
    for (const condition of automation.conditions) {
      const result = await this.evaluateCondition(condition, data);
      if (!result) {
        console.log(`❌ Condition non remplie: ${condition.type}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * 🔍 Évaluer une condition spécifique
   */
  async evaluateCondition(condition, data) {
    switch (condition.type) {
      case 'time_of_day':
        return this.checkTimeCondition(condition.config);
      
      case 'day_of_week':
        return this.checkDayCondition(condition.config);
      
      case 'data_field':
        return this.checkDataFieldCondition(condition.config, data);
      
      case 'campaign_status':
        return await this.checkCampaignStatus(condition.config);
      
      case 'prospect_count':
        return await this.checkProspectCount(condition.config);
      
      case 'response_rate':
        return await this.checkResponseRate(condition.config);
      
      default:
        console.warn(`⚠️ Type de condition inconnu: ${condition.type}`);
        return true;
    }
  }

  /**
   * 🎯 Exécuter une action spécifique
   */
  async executeAction(action, data, execution) {
    const actionHandler = this.actions.get(action.type);
    
    if (!actionHandler) {
      throw new Error(`Action type not found: ${action.type}`);
    }
    
    return await actionHandler.execute(action.config, data, execution);
  }

  /**
   * 📋 Obtenir toutes les automatisations
   */
  getAutomations(filters = {}) {
    let automations = Array.from(this.automations.values());
    
    // Filtres
    if (filters.status) {
      automations = automations.filter(a => a.status === filters.status);
    }
    if (filters.type) {
      automations = automations.filter(a => a.type === filters.type);
    }
    if (filters.campaignId) {
      automations = automations.filter(a => a.campaignId === filters.campaignId);
    }
    
    return automations.map(a => a.toJSON());
  }

  /**
   * 🔍 Obtenir une automatisation spécifique
   */
  getAutomation(automationId) {
    const automation = this.automations.get(automationId);
    return automation ? automation.toJSON() : null;
  }

  /**
   * 📊 Obtenir les métriques d'automatisation
   */
  getAutomationMetrics() {
    const automations = Array.from(this.automations.values());
    
    return {
      total: automations.length,
      byStatus: {
        active: automations.filter(a => a.status === 'active').length,
        inactive: automations.filter(a => a.status === 'inactive').length,
        running: automations.filter(a => a.status === 'running').length,
        error: automations.filter(a => a.status === 'error').length
      },
      performance: this.analytics.getPerformanceMetrics(),
      mostTriggered: this.getMostTriggeredAutomations(),
      recentActivity: this.getRecentActivity()
    };
  }

  /**
   * 🔧 Initialiser les composants
   */
  initializeComponents() {
    console.log('🔧 Initialisation des composants d\'automatisation');
    
    // Démarrer le moniteur
    this.monitor.start();
    
    // Démarrer le planificateur
    this.scheduler.start();
    
    console.log('✅ Composants d\'automatisation initialisés');
  }

  /**
   * 📥 Enregistrer les déclencheurs par défaut
   */
  registerDefaultTriggers() {
    // Déclencheur: Nouveau prospect trouvé
    this.triggers.set('prospect_found', {
      name: 'Nouveau Prospect Trouvé',
      description: 'Se déclenche quand un nouveau prospect est trouvé',
      dataSchema: {
        prospectId: 'string',
        campaignId: 'string',
        prospectData: 'object'
      }
    });

    // Déclencheur: Réponse reçue
    this.triggers.set('response_received', {
      name: 'Réponse Reçue',
      description: 'Se déclenche quand un prospect répond',
      dataSchema: {
        prospectId: 'string',
        responseType: 'string',
        responseData: 'object'
      }
    });

    // Déclencheur: Email ouvert
    this.triggers.set('email_opened', {
      name: 'Email Ouvert',
      description: 'Se déclenche quand un email est ouvert',
      dataSchema: {
        prospectId: 'string',
        emailId: 'string',
        openTime: 'date'
      }
    });

    // Déclencheur: Lien cliqué
    this.triggers.set('link_clicked', {
      name: 'Lien Cliqué',
      description: 'Se déclenche quand un lien est cliqué',
      dataSchema: {
        prospectId: 'string',
        linkUrl: 'string',
        clickTime: 'date'
      }
    });

    // Déclencheur: Planifié (temps)
    this.triggers.set('scheduled_time', {
      name: 'Heure Planifiée',
      description: 'Se déclenche à une heure spécifique',
      dataSchema: {
        scheduledTime: 'date',
        recurringType: 'string'
      }
    });

    console.log(`📥 ${this.triggers.size} déclencheurs enregistrés`);
  }

  /**
   * ⚡ Enregistrer les actions par défaut
   */
  registerDefaultActions() {
    // Action: Envoyer email
    this.actions.set('send_email', new SendEmailAction());
    
    // Action: Envoyer message LinkedIn
    this.actions.set('send_linkedin_message', new SendLinkedInMessageAction());
    
    // Action: Créer tâche
    this.actions.set('create_task', new CreateTaskAction());
    
    // Action: Mettre à jour prospect
    this.actions.set('update_prospect', new UpdateProspectAction());
    
    // Action: Notifier équipe
    this.actions.set('notify_team', new NotifyTeamAction());
    
    // Action: Créer deal CRM
    this.actions.set('create_deal', new CreateDealAction());
    
    // Action: Programmer follow-up
    this.actions.set('schedule_followup', new ScheduleFollowupAction());
    
    // Action: Webhook
    this.actions.set('webhook', new WebhookAction());

    console.log(`⚡ ${this.actions.size} actions enregistrées`);
  }

  // Méthodes utilitaires
  getAutomationsByTrigger(triggerId) {
    return Array.from(this.automations.values())
      .filter(automation => 
        automation.triggers.some(trigger => trigger.type === triggerId) &&
        automation.status === 'active'
      );
  }

  async validateAutomation(automation) {
    // Validation basique
    if (!automation.name || automation.name.trim() === '') {
      throw new Error('Automation name is required');
    }
    
    if (!automation.triggers || automation.triggers.length === 0) {
      throw new Error('At least one trigger is required');
    }
    
    if (!automation.actions || automation.actions.length === 0) {
      throw new Error('At least one action is required');
    }
    
    // Validation des déclencheurs
    for (const trigger of automation.triggers) {
      if (!this.triggers.has(trigger.type)) {
        throw new Error(`Unknown trigger type: ${trigger.type}`);
      }
    }
    
    // Validation des actions
    for (const action of automation.actions) {
      if (!this.actions.has(action.type)) {
        throw new Error(`Unknown action type: ${action.type}`);
      }
    }
  }

  async registerAutomationTriggers(automation) {
    // Enregistrer l'automatisation auprès du planificateur
    await this.scheduler.registerAutomation(automation);
  }

  checkTimeCondition(config) {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= config.startHour && currentHour <= config.endHour;
  }

  checkDayCondition(config) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = dimanche, 1 = lundi, etc.
    return config.allowedDays.includes(currentDay);
  }

  checkDataFieldCondition(config, data) {
    const value = this.getNestedValue(data, config.field);
    
    switch (config.operator) {
      case 'equals':
        return value === config.value;
      case 'not_equals':
        return value !== config.value;
      case 'greater_than':
        return value > config.value;
      case 'less_than':
        return value < config.value;
      case 'contains':
        return String(value).includes(config.value);
      default:
        return false;
    }
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  async checkCampaignStatus(config) {
    // Simulation - dans un vrai système, vérifier via l'API des campagnes
    return true;
  }

  async checkProspectCount(config) {
    // Simulation - dans un vrai système, vérifier le nombre de prospects
    return true;
  }

  async checkResponseRate(config) {
    // Simulation - dans un vrai système, calculer le taux de réponse
    return true;
  }

  getMostTriggeredAutomations() {
    return Array.from(this.automations.values())
      .sort((a, b) => b.executionCount - a.executionCount)
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        name: a.name,
        executionCount: a.executionCount
      }));
  }

  getRecentActivity() {
    return Array.from(this.automations.values())
      .filter(a => a.lastTriggered)
      .sort((a, b) => b.lastTriggered.getTime() - a.lastTriggered.getTime())
      .slice(0, 10)
      .map(a => ({
        automationId: a.id,
        name: a.name,
        lastTriggered: a.lastTriggered,
        status: a.status
      }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// === MODÈLE AUTOMATION ===

class Automation {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.type = data.type || 'general';
    this.campaignId = data.campaignId || null;
    this.triggers = data.triggers || [];
    this.conditions = data.conditions || [];
    this.actions = data.actions || [];
    this.config = data.config || {};
    this.status = data.status || 'inactive';
    this.executionCount = 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastTriggered = null;
    this.lastSuccessfulExecution = null;
    this.lastError = null;
  }

  activate() {
    this.status = 'active';
    this.updatedAt = new Date();
  }

  deactivate() {
    this.status = 'inactive';
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      campaignId: this.campaignId,
      triggers: this.triggers,
      conditions: this.conditions,
      actions: this.actions,
      config: this.config,
      status: this.status,
      executionCount: this.executionCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastTriggered: this.lastTriggered,
      lastSuccessfulExecution: this.lastSuccessfulExecution,
      lastError: this.lastError
    };
  }
}

// === MODÈLE EXÉCUTION ===

class AutomationExecution {
  constructor(data) {
    this.id = data.id;
    this.automationId = data.automationId;
    this.triggerData = data.triggerData || {};
    this.startedAt = data.startedAt || new Date();
    this.completedAt = null;
    this.status = 'running';
    this.result = null;
    this.actionResults = {};
    this.errors = [];
    this.duration = 0;
  }

  addActionResult(actionId, result) {
    this.actionResults[actionId] = result;
  }

  addError(error) {
    this.errors.push({
      message: error.message,
      timestamp: new Date()
    });
  }

  complete(status, result) {
    this.status = status;
    this.result = result;
    this.completedAt = new Date();
    this.duration = this.completedAt.getTime() - this.startedAt.getTime();
  }

  toJSON() {
    return {
      id: this.id,
      automationId: this.automationId,
      triggerData: this.triggerData,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      status: this.status,
      result: this.result,
      actionResults: this.actionResults,
      errors: this.errors,
      duration: this.duration
    };
  }
}

// === PLANIFICATEUR D'AUTOMATISATION ===

class AutomationScheduler {
  constructor() {
    this.scheduledTasks = new Map();
    this.recurringTasks = new Map();
  }

  start() {
    console.log('📅 Démarrage du planificateur d\'automatisation');
    
    // Vérifier les tâches planifiées toutes les minutes
    setInterval(() => {
      this.checkScheduledTasks();
    }, 60000);
  }

  async registerAutomation(automation) {
    // Enregistrer les déclencheurs temporels
    automation.triggers.forEach(trigger => {
      if (trigger.type === 'scheduled_time') {
        this.scheduleAutomation(automation, trigger.config);
      }
    });
  }

  scheduleAutomation(automation, scheduleConfig) {
    if (scheduleConfig.recurringType) {
      // Tâche récurrente
      this.recurringTasks.set(`${automation.id}_${scheduleConfig.recurringType}`, {
        automation,
        scheduleConfig,
        nextExecution: this.calculateNextExecution(scheduleConfig)
      });
    } else if (scheduleConfig.scheduledTime) {
      // Tâche unique
      const scheduledTime = new Date(scheduleConfig.scheduledTime);
      this.scheduledTasks.set(`${automation.id}_${scheduledTime.getTime()}`, {
        automation,
        scheduledTime
      });
    }
  }

  checkScheduledTasks() {
    const now = new Date();
    
    // Vérifier les tâches uniques
    for (const [taskId, task] of this.scheduledTasks.entries()) {
      if (now >= task.scheduledTime) {
        this.executeScheduledTask(task.automation);
        this.scheduledTasks.delete(taskId);
      }
    }
    
    // Vérifier les tâches récurrentes
    for (const [taskId, task] of this.recurringTasks.entries()) {
      if (now >= task.nextExecution) {
        this.executeScheduledTask(task.automation);
        task.nextExecution = this.calculateNextExecution(task.scheduleConfig);
      }
    }
  }

  calculateNextExecution(scheduleConfig) {
    const now = new Date();
    
    switch (scheduleConfig.recurringType) {
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(scheduleConfig.hour || 9, scheduleConfig.minute || 0, 0, 0);
        return tomorrow;
      
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
      
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Demain par défaut
    }
  }

  async executeScheduledTask(automation) {
    console.log(`⏰ Exécution planifiée: ${automation.name}`);
    // Cette méthode sera appelée par l'engine principal
  }
}

// === MONITEUR D'AUTOMATISATION ===

class AutomationMonitor {
  constructor() {
    this.alerts = [];
    this.metrics = new Map();
  }

  start() {
    console.log('👁️ Démarrage du moniteur d\'automatisation');
    
    // Monitoring toutes les 30 secondes
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  performHealthCheck() {
    // Surveillance des performances et alertes
    console.log('🔍 Vérification santé automatisations');
  }
}

// === ANALYTICS D'AUTOMATISATION ===

class AutomationAnalytics {
  constructor() {
    this.executions = [];
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0
    };
  }

  recordExecution(automation, execution) {
    this.executions.push({
      automationId: automation.id,
      executionId: execution.id,
      status: execution.status,
      duration: execution.duration,
      timestamp: execution.completedAt
    });
    
    this.updateMetrics();
  }

  updateMetrics() {
    this.metrics.totalExecutions = this.executions.length;
    this.metrics.successfulExecutions = this.executions.filter(e => e.status === 'success').length;
    this.metrics.failedExecutions = this.executions.filter(e => e.status === 'failed').length;
    
    const totalDuration = this.executions.reduce((sum, e) => sum + e.duration, 0);
    this.metrics.averageExecutionTime = this.executions.length > 0 ? 
      Math.round(totalDuration / this.executions.length) : 0;
  }

  getPerformanceMetrics() {
    return this.metrics;
  }
}

// === CLASSES D'ACTIONS ===

class SendEmailAction {
  async execute(config, data, execution) {
    console.log('📧 Envoi email automatique');
    
    // Simulation d'envoi d'email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      emailsSent: 1,
      recipientId: data.prospectId,
      template: config.template,
      timestamp: new Date()
    };
  }
}

class SendLinkedInMessageAction {
  async execute(config, data, execution) {
    console.log('💼 Envoi message LinkedIn automatique');
    
    // Simulation d'envoi LinkedIn
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      messagesSent: 1,
      recipientId: data.prospectId,
      messageTemplate: config.template,
      timestamp: new Date()
    };
  }
}

class CreateTaskAction {
  async execute(config, data, execution) {
    console.log('📋 Création tâche automatique');
    
    return {
      success: true,
      taskId: `task_${Date.now()}`,
      title: config.title,
      assignedTo: config.assignedTo,
      timestamp: new Date()
    };
  }
}

class UpdateProspectAction {
  async execute(config, data, execution) {
    console.log('👤 Mise à jour prospect automatique');
    
    return {
      success: true,
      prospectId: data.prospectId,
      updatedFields: config.fields,
      timestamp: new Date()
    };
  }
}

class NotifyTeamAction {
  async execute(config, data, execution) {
    console.log('🔔 Notification équipe automatique');
    
    return {
      success: true,
      notificationType: config.type,
      message: config.message,
      recipients: config.recipients,
      timestamp: new Date()
    };
  }
}

class CreateDealAction {
  async execute(config, data, execution) {
    console.log('💰 Création deal CRM automatique');
    
    return {
      success: true,
      dealId: `deal_${Date.now()}`,
      prospectId: data.prospectId,
      value: config.value,
      stage: config.initialStage,
      timestamp: new Date()
    };
  }
}

class ScheduleFollowupAction {
  async execute(config, data, execution) {
    console.log('⏰ Programmation follow-up automatique');
    
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + (config.delayDays || 3));
    
    return {
      success: true,
      followupId: `followup_${Date.now()}`,
      prospectId: data.prospectId,
      scheduledDate: followupDate,
      type: config.type,
      timestamp: new Date()
    };
  }
}

class WebhookAction {
  async execute(config, data, execution) {
    console.log('🔗 Appel webhook automatique');
    
    // Simulation d'appel webhook
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      webhookUrl: config.url,
      method: config.method || 'POST',
      responseStatus: 200,
      timestamp: new Date()
    };
  }
}

// Instance globale
const automationEngine = new AutomationEngine();

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

    console.log(`🤖 Automation Engine: ${method} ${action}`);

    switch (action) {
      case 'create':
        return await handleCreateAutomation(req, res);
      
      case 'trigger':
        return await handleTriggerAutomation(req, res);
      
      case 'list':
        return await handleListAutomations(req, res);
      
      case 'get':
        return await handleGetAutomation(req, res);
      
      case 'metrics':
        return await handleGetMetrics(req, res);
      
      case 'triggers':
        return await handleGetTriggers(req, res);
      
      case 'actions':
        return await handleGetActions(req, res);
      
      case 'activate':
        return await handleActivateAutomation(req, res);
      
      case 'deactivate':
        return await handleDeactivateAutomation(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: ['create', 'trigger', 'list', 'get', 'metrics', 'triggers', 'actions', 'activate', 'deactivate']
        });
    }

  } catch (error) {
    console.error('❌ Automation Engine Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
}

async function handleCreateAutomation(req, res) {
  try {
    const config = req.body;
    const result = await automationEngine.createAutomation(config);
    
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleTriggerAutomation(req, res) {
  try {
    const { triggerId } = req.query;
    const data = req.body || {};
    
    const result = await automationEngine.triggerAutomation(triggerId, data);
    
    return res.status(200).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleListAutomations(req, res) {
  try {
    const filters = req.query;
    const automations = automationEngine.getAutomations(filters);
    
    return res.status(200).json({
      success: true,
      automations,
      total: automations.length,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetMetrics(req, res) {
  try {
    const metrics = automationEngine.getAutomationMetrics();
    
    return res.status(200).json({
      success: true,
      metrics,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetTriggers(req, res) {
  try {
    const triggers = Array.from(automationEngine.triggers.entries()).map(([id, trigger]) => ({
      id,
      ...trigger
    }));
    
    return res.status(200).json({
      success: true,
      triggers,
      total: triggers.length,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetActions(req, res) {
  try {
    const actions = Array.from(automationEngine.actions.keys()).map(type => ({
      type,
      name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Action de type ${type}`
    }));
    
    return res.status(200).json({
      success: true,
      actions,
      total: actions.length,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}