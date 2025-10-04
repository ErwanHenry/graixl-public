/**
 * 🔄 Gestionnaire de Workflows Graixl - Orchestration Intelligente
 * Gestion des workflows de prospection et automatisation
 */

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// === GESTIONNAIRE DE WORKFLOWS ===

class WorkflowManager {
  constructor() {
    this.workflows = new Map();
    this.templates = new Map();
    this.scheduler = new WorkflowScheduler();
    this.executor = new WorkflowExecutor();
    this.monitor = new WorkflowMonitor();
    
    this.initializeTemplates();
  }

  /**
   * 🚀 Créer et lancer un workflow
   */
  async createWorkflow(config) {
    console.log(`🚀 Création workflow: ${config.type}`);
    
    try {
      const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const workflow = new Workflow({
        id: workflowId,
        ...config,
        status: 'created',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      this.workflows.set(workflowId, workflow);
      
      // Planifier l'exécution
      if (config.autoStart !== false) {
        await this.scheduler.scheduleWorkflow(workflow);
      }

      console.log(`✅ Workflow ${workflowId} créé et planifié`);
      
      return {
        success: true,
        workflowId,
        workflow: workflow.toJSON(),
        message: 'Workflow créé avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur création workflow:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ▶️ Démarrer un workflow
   */
  async startWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    if (workflow.status !== 'created' && workflow.status !== 'paused') {
      throw new Error(`Cannot start workflow in status: ${workflow.status}`);
    }

    workflow.status = 'running';
    workflow.startedAt = new Date();
    workflow.updatedAt = new Date();

    // Démarrer l'exécution
    await this.executor.executeWorkflow(workflow);

    return workflow;
  }

  /**
   * ⏸️ Mettre en pause un workflow
   */
  async pauseWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    if (workflow.status !== 'running') {
      throw new Error(`Cannot pause workflow in status: ${workflow.status}`);
    }

    workflow.status = 'paused';
    workflow.updatedAt = new Date();

    await this.executor.pauseWorkflow(workflow);

    return workflow;
  }

  /**
   * 🛑 Arrêter un workflow
   */
  async stopWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    workflow.status = 'stopped';
    workflow.completedAt = new Date();
    workflow.updatedAt = new Date();

    await this.executor.stopWorkflow(workflow);

    return workflow;
  }

  /**
   * 📋 Obtenir tous les workflows
   */
  getWorkflows(filters = {}) {
    let workflows = Array.from(this.workflows.values());

    // Filtres
    if (filters.status) {
      workflows = workflows.filter(w => w.status === filters.status);
    }
    if (filters.type) {
      workflows = workflows.filter(w => w.type === filters.type);
    }
    if (filters.campaignId) {
      workflows = workflows.filter(w => w.campaignId === filters.campaignId);
    }

    return workflows.map(w => w.toJSON());
  }

  /**
   * 🔍 Obtenir un workflow spécifique
   */
  getWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    return workflow ? workflow.toJSON() : null;
  }

  /**
   * 📊 Obtenir métriques des workflows
   */
  getWorkflowMetrics() {
    const workflows = Array.from(this.workflows.values());
    
    return {
      total: workflows.length,
      byStatus: {
        created: workflows.filter(w => w.status === 'created').length,
        running: workflows.filter(w => w.status === 'running').length,
        paused: workflows.filter(w => w.status === 'paused').length,
        completed: workflows.filter(w => w.status === 'completed').length,
        failed: workflows.filter(w => w.status === 'failed').length,
        stopped: workflows.filter(w => w.status === 'stopped').length
      },
      byType: this.getWorkflowsByType(workflows),
      performance: this.calculatePerformanceMetrics(workflows)
    };
  }

  /**
   * 📋 Initialiser templates de workflows
   */
  initializeTemplates() {
    // Template: Prospection complète
    this.templates.set('full_prospection', {
      name: 'Prospection Complète',
      description: 'Workflow complet de recherche, enrichissement et scoring',
      steps: [
        { id: 'search', type: 'linkedin_search', config: {} },
        { id: 'enrich', type: 'email_enrichment', config: {} },
        { id: 'score', type: 'ai_scoring', config: {} },
        { id: 'validate', type: 'validation', config: {} }
      ],
      estimatedDuration: 300000, // 5 minutes
      requiredInputs: ['criteria', 'campaignId']
    });

    // Template: Enrichissement email rapide
    this.templates.set('quick_email_enrichment', {
      name: 'Enrichissement Email Rapide',
      description: 'Enrichissement email de prospects existants',
      steps: [
        { id: 'enrich', type: 'email_enrichment', config: { fast: true } },
        { id: 'verify', type: 'email_verification', config: {} }
      ],
      estimatedDuration: 60000, // 1 minute
      requiredInputs: ['prospects']
    });

    // Template: Campagne séquentielle
    this.templates.set('sequential_campaign', {
      name: 'Campagne Séquentielle',
      description: 'Campagne automatisée avec séquences',
      steps: [
        { id: 'initial_contact', type: 'linkedin_message', config: {} },
        { id: 'wait', type: 'delay', config: { duration: 259200000 } }, // 3 jours
        { id: 'follow_up', type: 'email_send', config: {} },
        { id: 'wait_2', type: 'delay', config: { duration: 604800000 } }, // 7 jours
        { id: 'final_follow_up', type: 'phone_call', config: {} }
      ],
      estimatedDuration: 1209600000, // 14 jours
      requiredInputs: ['prospects', 'campaignConfig']
    });

    console.log(`✅ ${this.templates.size} templates de workflows initialisés`);
  }

  getWorkflowsByType(workflows) {
    const types = {};
    workflows.forEach(workflow => {
      types[workflow.type] = (types[workflow.type] || 0) + 1;
    });
    return types;
  }

  calculatePerformanceMetrics(workflows) {
    const completed = workflows.filter(w => w.status === 'completed');
    const failed = workflows.filter(w => w.status === 'failed');
    
    const totalExecutionTime = completed.reduce((sum, w) => {
      return sum + (w.completedAt ? w.completedAt.getTime() - w.startedAt.getTime() : 0);
    }, 0);

    return {
      successRate: workflows.length > 0 ? Math.round((completed.length / workflows.length) * 100) : 0,
      failureRate: workflows.length > 0 ? Math.round((failed.length / workflows.length) * 100) : 0,
      averageExecutionTime: completed.length > 0 ? Math.round(totalExecutionTime / completed.length) : 0,
      totalProspectsProcessed: completed.reduce((sum, w) => sum + (w.results?.totalProspects || 0), 0),
      totalEmailsFound: completed.reduce((sum, w) => sum + (w.results?.emailsFound || 0), 0)
    };
  }
}

// === MODÈLE WORKFLOW ===

class Workflow {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.campaignId = data.campaignId;
    this.config = data.config || {};
    this.steps = data.steps || [];
    this.status = data.status || 'created';
    this.progress = 0;
    this.results = {};
    this.errors = [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.startedAt = data.startedAt || null;
    this.completedAt = data.completedAt || null;
    this.estimatedDuration = data.estimatedDuration || 0;
    this.actualDuration = 0;
  }

  updateProgress(progress) {
    this.progress = Math.min(100, Math.max(0, progress));
    this.updatedAt = new Date();
  }

  addResult(stepId, result) {
    this.results[stepId] = result;
    this.updatedAt = new Date();
  }

  addError(error) {
    this.errors.push({
      timestamp: new Date(),
      message: error.message,
      stack: error.stack
    });
    this.updatedAt = new Date();
  }

  complete(finalResults = {}) {
    this.status = 'completed';
    this.progress = 100;
    this.completedAt = new Date();
    this.actualDuration = this.startedAt ? this.completedAt.getTime() - this.startedAt.getTime() : 0;
    this.results = { ...this.results, ...finalResults };
    this.updatedAt = new Date();
  }

  fail(error) {
    this.status = 'failed';
    this.completedAt = new Date();
    this.actualDuration = this.startedAt ? this.completedAt.getTime() - this.startedAt.getTime() : 0;
    this.addError(error);
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      campaignId: this.campaignId,
      config: this.config,
      steps: this.steps,
      status: this.status,
      progress: this.progress,
      results: this.results,
      errors: this.errors,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      estimatedDuration: this.estimatedDuration,
      actualDuration: this.actualDuration
    };
  }
}

// === PLANIFICATEUR DE WORKFLOWS ===

class WorkflowScheduler {
  constructor() {
    this.scheduledTasks = new Map();
  }

  async scheduleWorkflow(workflow) {
    console.log(`📅 Planification workflow ${workflow.id}`);
    
    // Planifier selon le type et la configuration
    if (workflow.config.scheduleAt) {
      const scheduleTime = new Date(workflow.config.scheduleAt);
      const delay = scheduleTime.getTime() - Date.now();
      
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          this.executeScheduledWorkflow(workflow.id);
        }, delay);
        
        this.scheduledTasks.set(workflow.id, timeoutId);
        console.log(`⏰ Workflow ${workflow.id} planifié pour ${scheduleTime}`);
      }
    } else {
      // Exécution immédiate
      setTimeout(() => this.executeScheduledWorkflow(workflow.id), 1000);
    }
  }

  async executeScheduledWorkflow(workflowId) {
    console.log(`🚀 Exécution planifiée workflow ${workflowId}`);
    // L'exécuteur prendra le relais
  }

  cancelScheduledWorkflow(workflowId) {
    const timeoutId = this.scheduledTasks.get(workflowId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledTasks.delete(workflowId);
      console.log(`❌ Annulation planification workflow ${workflowId}`);
    }
  }
}

// === EXÉCUTEUR DE WORKFLOWS ===

class WorkflowExecutor {
  constructor() {
    this.runningWorkflows = new Set();
  }

  async executeWorkflow(workflow) {
    if (this.runningWorkflows.has(workflow.id)) {
      throw new Error('Workflow already running');
    }

    this.runningWorkflows.add(workflow.id);
    console.log(`⚡ Démarrage exécution workflow ${workflow.id}`);

    try {
      workflow.status = 'running';
      workflow.startedAt = new Date();

      // Simulation d'exécution des étapes
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        console.log(`📋 Exécution étape ${step.id} (${i + 1}/${workflow.steps.length})`);
        
        const stepResult = await this.executeStep(step, workflow);
        workflow.addResult(step.id, stepResult);
        
        const progress = Math.round(((i + 1) / workflow.steps.length) * 100);
        workflow.updateProgress(progress);
        
        // Délai entre les étapes
        await this.delay(500);
      }

      // Compilation des résultats finaux
      const finalResults = this.compileFinalResults(workflow);
      workflow.complete(finalResults);
      
      console.log(`✅ Workflow ${workflow.id} terminé avec succès`);

    } catch (error) {
      console.error(`❌ Erreur workflow ${workflow.id}:`, error);
      workflow.fail(error);
    } finally {
      this.runningWorkflows.delete(workflow.id);
    }

    return workflow;
  }

  async executeStep(step, workflow) {
    console.log(`🔧 Exécution étape: ${step.type}`);
    
    // Simulation d'exécution selon le type d'étape
    switch (step.type) {
      case 'linkedin_search':
        return await this.simulateLinkedInSearch(step.config, workflow);
      
      case 'email_enrichment':
        return await this.simulateEmailEnrichment(step.config, workflow);
      
      case 'ai_scoring':
        return await this.simulateAIScoring(step.config, workflow);
      
      case 'validation':
        return await this.simulateValidation(step.config, workflow);
      
      case 'linkedin_message':
        return await this.simulateLinkedInMessage(step.config, workflow);
      
      case 'email_send':
        return await this.simulateEmailSend(step.config, workflow);
      
      case 'delay':
        return await this.simulateDelay(step.config);
      
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  async simulateLinkedInSearch(config, workflow) {
    await this.delay(2000);
    const prospectsFound = Math.floor(Math.random() * 50) + 20; // 20-70 prospects
    return {
      success: true,
      prospectsFound,
      searchQuery: workflow.config.criteria?.jobTitles || 'Default search',
      duration: 2000
    };
  }

  async simulateEmailEnrichment(config, workflow) {
    await this.delay(1500);
    const inputProspects = workflow.results.search?.prospectsFound || 30;
    const emailsFound = Math.floor(inputProspects * (0.6 + Math.random() * 0.3)); // 60-90%
    return {
      success: true,
      inputProspects,
      emailsFound,
      enrichmentRate: Math.round((emailsFound / inputProspects) * 100),
      duration: 1500
    };
  }

  async simulateAIScoring(config, workflow) {
    await this.delay(1000);
    const inputProspects = workflow.results.enrich?.emailsFound || 25;
    return {
      success: true,
      prospectsScored: inputProspects,
      averageScore: Math.round(Math.random() * 20 + 70), // 70-90
      highQualityProspects: Math.floor(inputProspects * 0.3), // 30%
      duration: 1000
    };
  }

  async simulateValidation(config, workflow) {
    await this.delay(500);
    const inputProspects = workflow.results.score?.prospectsScored || 20;
    const validatedProspects = Math.floor(inputProspects * 0.8); // 80% passent la validation
    return {
      success: true,
      inputProspects,
      validatedProspects,
      validationRate: Math.round((validatedProspects / inputProspects) * 100),
      duration: 500
    };
  }

  async simulateLinkedInMessage(config, workflow) {
    await this.delay(3000);
    const prospects = workflow.config.prospects?.length || 10;
    const messagesSent = Math.floor(prospects * 0.9); // 90% des messages envoyés
    return {
      success: true,
      totalProspects: prospects,
      messagesSent,
      sendRate: Math.round((messagesSent / prospects) * 100),
      duration: 3000
    };
  }

  async simulateEmailSend(config, workflow) {
    await this.delay(2000);
    const prospects = workflow.config.prospects?.length || 8;
    const emailsSent = Math.floor(prospects * 0.95); // 95% des emails envoyés
    return {
      success: true,
      totalProspects: prospects,
      emailsSent,
      sendRate: Math.round((emailsSent / prospects) * 100),
      duration: 2000
    };
  }

  async simulateDelay(config) {
    const duration = config.duration || 1000;
    await this.delay(Math.min(duration, 5000)); // Max 5s pour la simulation
    return {
      success: true,
      delayDuration: duration,
      actualWaitTime: Math.min(duration, 5000)
    };
  }

  async pauseWorkflow(workflow) {
    console.log(`⏸️ Mise en pause workflow ${workflow.id}`);
    // Logique de pause
  }

  async stopWorkflow(workflow) {
    console.log(`🛑 Arrêt workflow ${workflow.id}`);
    this.runningWorkflows.delete(workflow.id);
  }

  compileFinalResults(workflow) {
    const results = workflow.results;
    
    return {
      totalProspects: results.search?.prospectsFound || 0,
      emailsFound: results.enrich?.emailsFound || 0,
      highQualityProspects: results.score?.highQualityProspects || 0,
      validatedProspects: results.validate?.validatedProspects || 0,
      messagesSent: results.initial_contact?.messagesSent || 0,
      emailsSent: results.follow_up?.emailsSent || 0,
      totalSteps: Object.keys(results).length,
      executionSummary: {
        success: true,
        quality: 'high',
        efficiency: Math.round(Math.random() * 20 + 80) // 80-100%
      }
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// === MONITEUR DE WORKFLOWS ===

class WorkflowMonitor {
  constructor() {
    this.alerts = [];
    this.thresholds = {
      executionTime: 600000, // 10 minutes
      failureRate: 20, // 20%
      memoryUsage: 80 // 80%
    };
  }

  checkWorkflowHealth(workflows) {
    const running = workflows.filter(w => w.status === 'running');
    const failed = workflows.filter(w => w.status === 'failed');
    
    // Vérifier les workflows en cours trop longs
    running.forEach(workflow => {
      const runTime = Date.now() - workflow.startedAt.getTime();
      if (runTime > this.thresholds.executionTime) {
        this.createAlert('long_execution', workflow);
      }
    });

    // Vérifier le taux d'échec
    if (workflows.length > 10) {
      const failureRate = (failed.length / workflows.length) * 100;
      if (failureRate > this.thresholds.failureRate) {
        this.createAlert('high_failure_rate', { rate: failureRate });
      }
    }

    return {
      healthy: this.alerts.length === 0,
      alerts: this.alerts,
      metrics: {
        runningWorkflows: running.length,
        failedWorkflows: failed.length,
        avgExecutionTime: this.calculateAvgExecutionTime(workflows)
      }
    };
  }

  createAlert(type, data) {
    this.alerts.push({
      id: `alert_${Date.now()}`,
      type,
      data,
      timestamp: new Date(),
      severity: this.getAlertSeverity(type)
    });
  }

  getAlertSeverity(type) {
    const severities = {
      long_execution: 'warning',
      high_failure_rate: 'critical',
      memory_usage: 'warning',
      system_error: 'critical'
    };
    return severities[type] || 'info';
  }

  calculateAvgExecutionTime(workflows) {
    const completed = workflows.filter(w => w.actualDuration > 0);
    if (completed.length === 0) return 0;
    
    const totalTime = completed.reduce((sum, w) => sum + w.actualDuration, 0);
    return Math.round(totalTime / completed.length);
  }
}

// Instance globale du gestionnaire
const workflowManager = new WorkflowManager();

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

    console.log(`🔄 Workflow Manager: ${method} ${action}`);

    switch (action) {
      case 'create':
        return await handleCreateWorkflow(req, res);
      
      case 'start':
        return await handleStartWorkflow(req, res);
      
      case 'pause':
        return await handlePauseWorkflow(req, res);
      
      case 'stop':
        return await handleStopWorkflow(req, res);
      
      case 'list':
        return await handleListWorkflows(req, res);
      
      case 'get':
        return await handleGetWorkflow(req, res);
      
      case 'metrics':
        return await handleGetMetrics(req, res);
      
      case 'templates':
        return await handleGetTemplates(req, res);
      
      case 'health':
        return await handleHealthCheck(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: ['create', 'start', 'pause', 'stop', 'list', 'get', 'metrics', 'templates', 'health']
        });
    }

  } catch (error) {
    console.error('❌ Workflow Manager Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
}

async function handleCreateWorkflow(req, res) {
  try {
    const config = req.body;
    const result = await workflowManager.createWorkflow(config);
    
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleStartWorkflow(req, res) {
  try {
    const { id } = req.query;
    const workflow = await workflowManager.startWorkflow(id);
    
    return res.status(200).json({
      success: true,
      workflow: workflow.toJSON(),
      message: 'Workflow started successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function handleListWorkflows(req, res) {
  try {
    const filters = req.query;
    const workflows = workflowManager.getWorkflows(filters);
    
    return res.status(200).json({
      success: true,
      workflows,
      total: workflows.length,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetMetrics(req, res) {
  try {
    const metrics = workflowManager.getWorkflowMetrics();
    
    return res.status(200).json({
      success: true,
      metrics,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleGetTemplates(req, res) {
  try {
    const templates = Array.from(workflowManager.templates.entries()).map(([id, template]) => ({
      id,
      ...template
    }));
    
    return res.status(200).json({
      success: true,
      templates,
      total: templates.length,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}

async function handleHealthCheck(req, res) {
  try {
    const workflows = workflowManager.getWorkflows();
    const health = workflowManager.monitor.checkWorkflowHealth(workflows);
    
    return res.status(200).json({
      success: true,
      health,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}