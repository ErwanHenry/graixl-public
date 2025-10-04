/**
 * 🚀 Graixl Ecosystem API for Vercel
 * API principale pour l'écosystème déployé
 */

// Import simplifié pour Vercel
// const { EcosystemLauncher } = require('../src/EcosystemLauncher');

// Instance globale de l'écosystème (persiste entre les requêtes)
let globalEcosystem = null;
let ecosystemStatus = {
  isInitialized: false,
  startTime: null,
  lastActivity: null
};

// Headers CORS pour autoriser les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Fonction principale de l'API
export default async function handler(req, res) {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const { method, query, body } = req;
    const action = query.action || 'status';

    // Mettre à jour la dernière activité
    ecosystemStatus.lastActivity = new Date();

    console.log(`🌐 API Request: ${method} ${action}`);

    switch (action) {
      case 'status':
        return await handleStatus(res);
      
      case 'start':
        return await handleStart(res, body);
      
      case 'prospection':
        return await handleProspection(res, body);
      
      case 'campaign':
        return await handleCampaign(res, body);
      
      case 'experiment':
        return await handleExperiment(res, body);
      
      case 'optimize':
        return await handleOptimize(res, body);
      
      case 'metrics':
        return await handleMetrics(res);
      
      case 'health':
        return await handleHealth(res);
      
      case 'restart':
        return await handleRestart(res);
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: ['status', 'start', 'prospection', 'campaign', 'experiment', 'optimize', 'metrics', 'health', 'restart']
        });
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
}

// 🔧 Handlers pour chaque action

async function handleStatus(res) {
  try {
    if (!globalEcosystem || !ecosystemStatus.isInitialized) {
      return res.status(200).json({
        success: true,
        status: 'not_started',
        ecosystem_initialized: false,
        uptime: 0,
        last_activity: ecosystemStatus.lastActivity,
        message: 'Ecosystem not started. Use /api/ecosystem?action=start to initialize.'
      });
    }

    const status = await globalEcosystem.getEcosystemStatus();
    const uptime = ecosystemStatus.startTime ? Date.now() - ecosystemStatus.startTime : 0;

    return res.status(200).json({
      success: true,
      ...status,
      uptime,
      last_activity: ecosystemStatus.lastActivity,
      vercel_deployment: true
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function handleStart(res, body = {}) {
  try {
    if (globalEcosystem && ecosystemStatus.isInitialized) {
      return res.status(200).json({
        success: true,
        message: 'Ecosystem already running (simulated)',
        status: 'operational',
        uptime: Date.now() - ecosystemStatus.startTime
      });
    }

    console.log('🚀 Starting Graixl Ecosystem on Vercel (simulated)...');

    // Simulation pour Vercel (démo)
    ecosystemStatus.isInitialized = true;
    ecosystemStatus.startTime = Date.now();
    globalEcosystem = { status: 'simulated' }; // Simulation

    console.log('✅ Graixl Ecosystem started successfully on Vercel (demo mode)!');

    return res.status(200).json({
      success: true,
      status: 'operational',
      startup_time: 2500,
      engines_count: 6,
      capabilities: {
        intelligent_prospection: true,
        predictive_analytics: true,
        ai_recommendations: true,
        multi_channel_campaigns: true,
        real_time_optimization: true,
        creative_experimentation: true
      },
      vercel_deployment: true,
      demo_mode: true,
      started_at: new Date()
    });

  } catch (error) {
    console.error('❌ Ecosystem startup failed:', error);
    globalEcosystem = null;
    ecosystemStatus.isInitialized = false;

    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'start_ecosystem'
    });
  }
}

async function handleProspection(res, body = {}) {
  if (!await ensureEcosystemReady(res)) return;

  try {
    const criteria = {
      industry: 'technology',
      company_size: '50-500',
      location: 'France',
      job_titles: ['CEO', 'CTO', 'Head of Sales'],
      ...body
    };

    console.log('🎯 Running intelligent prospection (simulated)...');
    
    // Simulation des résultats
    const result = {
      success: true,
      prospects_found: Math.floor(Math.random() * 50) + 20,
      execution_time: 3500,
      quality_score: 0.89 + Math.random() * 0.1,
      engines_used: ['teamSimulation', 'predictiveIntelligence', 'advancedWorkflows']
    };

    return res.status(200).json({
      success: true,
      action: 'intelligent_prospection',
      result,
      criteria,
      demo_mode: true,
      timestamp: new Date()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'intelligent_prospection'
    });
  }
}

async function handleCampaign(res, body = {}) {
  if (!await ensureEcosystemReady(res)) return;

  try {
    const campaignConfig = {
      name: 'Vercel Deployment Campaign',
      channels: ['email', 'linkedin'],
      strategy: ['nurturing'],
      personalization_level: 'high',
      ...body
    };

    console.log('📧 Running smart campaign (simulated)...');
    
    // Simulation des résultats
    const result = {
      success: true,
      campaign_id: `campaign_${Date.now()}`,
      channels_activated: campaignConfig.channels.length,
      estimated_reach: Math.floor(Math.random() * 1000) + 500,
      execution_time: 4200,
      orchestration_score: 0.92
    };

    return res.status(200).json({
      success: true,
      action: 'smart_campaign',
      result,
      config: campaignConfig,
      demo_mode: true,
      timestamp: new Date()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'smart_campaign'
    });
  }
}

async function handleExperiment(res, body = {}) {
  if (!await ensureEcosystemReady(res)) return;

  try {
    const experimentConfig = {
      experiment_type: 'ab_test',
      creativity_level: 'high',
      focus_area: 'email_content',
      ...body
    };

    console.log('🧪 Running creative experiment (simulated)...');
    
    // Simulation des résultats
    const result = {
      success: true,
      experiment_id: `exp_${Date.now()}`,
      innovation_score: 0.85 + Math.random() * 0.1,
      creative_variations: Math.floor(Math.random() * 5) + 3,
      execution_time: 5100,
      predicted_improvement: 15 + Math.random() * 20
    };

    return res.status(200).json({
      success: true,
      action: 'creative_experiment',
      result,
      config: experimentConfig,
      demo_mode: true,
      timestamp: new Date()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'creative_experiment'
    });
  }
}

async function handleOptimize(res, body = {}) {
  if (!await ensureEcosystemReady(res)) return;

  try {
    const scope = body.scope || 'full';

    console.log(`⚡ Running ecosystem optimization (${scope}) (simulated)...`);
    
    // Simulation des résultats
    const result = {
      success: true,
      optimizations_applied: Math.floor(Math.random() * 8) + 3,
      performance_improvement: 12 + Math.random() * 15,
      execution_time: 2800,
      efficiency_gain: 18 + Math.random() * 12
    };

    return res.status(200).json({
      success: true,
      action: 'ecosystem_optimization',
      result,
      scope,
      demo_mode: true,
      timestamp: new Date()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'ecosystem_optimization'
    });
  }
}

async function handleMetrics(res) {
  if (!await ensureEcosystemReady(res)) return;

  try {
    // Simulation des métriques
    const metrics = {
      ecosystem: {
        uptime: ecosystemStatus.startTime ? Date.now() - ecosystemStatus.startTime : 0,
        operations_executed: Math.floor(Math.random() * 1000) + 500,
        engines_operational: 6
      },
      performance: {
        efficiency_score: 0.87 + Math.random() * 0.1,
        ai_coordination_score: 0.92 + Math.random() * 0.05,
        innovation_rate: 0.78 + Math.random() * 0.15,
        system_health: 0.94 + Math.random() * 0.05
      }
    };
    
    return res.status(200).json({
      success: true,
      action: 'performance_metrics',
      metrics,
      vercel_deployment: true,
      demo_mode: true,
      timestamp: new Date()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'performance_metrics'
    });
  }
}

async function handleHealth(res) {
  if (!await ensureEcosystemReady(res)) return;

  try {
    // Simulation de la santé système
    const health = {
      status: 'healthy',
      engines_operational: 6,
      uptime: ecosystemStatus.startTime ? Date.now() - ecosystemStatus.startTime : 0,
      overall_score: 0.94 + Math.random() * 0.05,
      issues: [],
      checked_at: new Date()
    };
    
    return res.status(200).json({
      success: true,
      action: 'ecosystem_health',
      health,
      vercel_deployment: true,
      demo_mode: true,
      timestamp: new Date()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'ecosystem_health'
    });
  }
}

async function handleRestart(res) {
  try {
    console.log('🔄 Restarting ecosystem...');

    if (globalEcosystem) {
      await globalEcosystem.shutdown();
    }

    globalEcosystem = null;
    ecosystemStatus.isInitialized = false;
    ecosystemStatus.startTime = null;

    // Redémarrage
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await handleStart(res);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      action: 'restart_ecosystem'
    });
  }
}

// 🔧 Utilitaires

async function ensureEcosystemReady(res) {
  if (!globalEcosystem || !ecosystemStatus.isInitialized) {
    res.status(400).json({
      success: false,
      error: 'Ecosystem not initialized',
      message: 'Please start the ecosystem first using /api/ecosystem?action=start',
      required_action: 'start'
    });
    return false;
  }
  return true;
}

// Auto-nettoyage après inactivité (pour économiser les ressources Vercel)
setInterval(() => {
  if (ecosystemStatus.lastActivity) {
    const inactiveTime = Date.now() - ecosystemStatus.lastActivity.getTime();
    const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

    if (inactiveTime > maxInactiveTime && globalEcosystem) {
      console.log('🧹 Auto-cleanup: Shutting down inactive ecosystem');
      globalEcosystem.shutdown().catch(console.error);
      globalEcosystem = null;
      ecosystemStatus.isInitialized = false;
    }
  }
}, 5 * 60 * 1000); // Vérification toutes les 5 minutes