/**
 * 📧 Email Integration System Graixl - Système d'Intégration Email Complet
 * Gestion avancée des emails pour prospection automatisée
 */

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// === SYSTÈME D'INTÉGRATION EMAIL PRINCIPAL ===

class EmailIntegrationSystem {
  constructor() {
    this.providers = new Map();
    this.templates = new Map();
    this.sequences = new Map();
    this.analytics = new EmailAnalytics();
    this.deliverability = new DeliverabilityManager();
    this.personalization = new PersonalizationEngine();
    
    this.initializeProviders();
    this.initializeTemplates();
  }

  /**
   * 📧 Envoyer email unique
   */
  async sendEmail(config) {
    console.log(`📧 Envoi email: ${config.type}`);
    
    try {
      const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Validation de l'email
      await this.validateEmailConfig(config);
      
      // Personnalisation du contenu
      const personalizedContent = await this.personalization.personalizeEmail(config);
      
      // Vérification délivrabilité
      const deliverabilityCheck = await this.deliverability.checkDeliverability(config);
      
      if (!deliverabilityCheck.canSend) {
        throw new Error(`Deliverability issue: ${deliverabilityCheck.reason}`);
      }
      
      // Sélection du fournisseur optimal
      const provider = await this.selectOptimalProvider(config);
      
      // Envoi via le fournisseur
      const result = await provider.sendEmail({
        ...config,
        ...personalizedContent,
        emailId,
        timestamp: new Date()
      });
      
      // Enregistrement des métriques
      this.analytics.recordEmailSent(emailId, config, result);
      
      console.log(`✅ Email ${emailId} envoyé avec succès`);
      
      return {
        success: true,
        emailId,
        result,
        deliverabilityScore: deliverabilityCheck.score,
        provider: provider.name,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * 📨 Envoyer email en masse
   */
  async sendBulkEmails(config) {
    console.log(`📨 Envoi en masse: ${config.recipients.length} emails`);
    
    try {
      const bulkId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const results = [];
      
      // Traitement par lots pour éviter la surcharge
      const batchSize = config.batchSize || 10;
      const delay = config.delayBetweenEmails || 2000; // 2 secondes par défaut
      
      for (let i = 0; i < config.recipients.length; i += batchSize) {
        const batch = config.recipients.slice(i, i + batchSize);
        console.log(`📦 Traitement lot ${Math.floor(i/batchSize) + 1}/${Math.ceil(config.recipients.length/batchSize)}`);
        
        const batchResults = await Promise.all(
          batch.map(async (recipient, index) => {
            // Délai progressif pour éviter les blocages
            await this.delay(index * (delay / batchSize));
            
            const emailConfig = {
              ...config,
              to: recipient.email,
              recipientData: recipient,
              bulkId
            };
            
            return await this.sendEmail(emailConfig);
          })
        );
        
        results.push(...batchResults);
        
        // Pause entre les lots
        if (i + batchSize < config.recipients.length) {
          await this.delay(delay);
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      console.log(`✅ Envoi en masse terminé: ${successCount} succès, ${failureCount} échecs`);
      
      return {
        success: true,
        bulkId,
        totalEmails: results.length,
        successCount,
        failureCount,
        successRate: Math.round((successCount / results.length) * 100),
        results,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Erreur envoi en masse:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔄 Créer et lancer séquence email
   */
  async createEmailSequence(config) {
    console.log(`🔄 Création séquence: ${config.name}`);
    
    try {
      const sequenceId = `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const sequence = new EmailSequence({
        id: sequenceId,
        ...config,
        status: 'created',
        createdAt: new Date()
      });
      
      // Validation de la séquence
      await this.validateSequence(sequence);
      
      this.sequences.set(sequenceId, sequence);
      
      // Planification automatique si demandée
      if (config.autoStart !== false) {
        await this.startEmailSequence(sequenceId);
      }
      
      return {
        success: true,
        sequenceId,
        sequence: sequence.toJSON(),
        message: 'Séquence créée avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur création séquence:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ▶️ Démarrer une séquence email
   */
  async startEmailSequence(sequenceId) {
    const sequence = this.sequences.get(sequenceId);
    if (!sequence) {
      throw new Error('Sequence not found');
    }

    sequence.status = 'running';
    sequence.startedAt = new Date();
    
    console.log(`▶️ Démarrage séquence: ${sequence.name}`);
    
    // Planifier tous les emails de la séquence
    for (const recipient of sequence.recipients) {
      await this.scheduleSequenceEmails(sequence, recipient);
    }
    
    return sequence;
  }

  /**
   * 📅 Planifier les emails d'une séquence pour un prospect
   */
  async scheduleSequenceEmails(sequence, recipient) {
    for (let stepIndex = 0; stepIndex < sequence.steps.length; stepIndex++) {
      const step = sequence.steps[stepIndex];
      const delay = this.calculateStepDelay(sequence, stepIndex);
      
      setTimeout(async () => {
        try {
          const emailConfig = {
            to: recipient.email,
            template: step.template,
            subject: step.subject,
            recipientData: recipient,
            sequenceId: sequence.id,
            stepIndex,
            stepId: step.id
          };
          
          const result = await this.sendEmail(emailConfig);
          sequence.recordStepExecution(recipient.email, stepIndex, result);
          
        } catch (error) {
          console.error(`❌ Erreur étape séquence ${step.id}:`, error);
          sequence.recordStepError(recipient.email, stepIndex, error);
        }
      }, delay);
    }
  }

  /**
   * 📊 Obtenir analytics email
   */
  getEmailAnalytics(filters = {}) {
    return this.analytics.getAnalytics(filters);
  }

  /**
   * 📝 Créer template email
   */
  async createEmailTemplate(config) {
    console.log(`📝 Création template: ${config.name}`);
    
    try {
      const templateId = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const template = new EmailTemplate({
        id: templateId,
        ...config,
        createdAt: new Date()
      });
      
      await this.validateTemplate(template);
      this.templates.set(templateId, template);
      
      return {
        success: true,
        templateId,
        template: template.toJSON(),
        message: 'Template créé avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur création template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 🔧 Initialiser les fournisseurs email
   */
  initializeProviders() {
    // Fournisseur SMTP générique
    this.providers.set('smtp', new SMTPProvider({
      name: 'SMTP',
      priority: 1,
      dailyLimit: 1000,
      hourlyLimit: 100
    }));

    // Fournisseur SendGrid
    this.providers.set('sendgrid', new SendGridProvider({
      name: 'SendGrid',
      priority: 2,
      dailyLimit: 5000,
      hourlyLimit: 500
    }));

    // Fournisseur Mailgun
    this.providers.set('mailgun', new MailgunProvider({
      name: 'Mailgun',
      priority: 3,
      dailyLimit: 3000,
      hourlyLimit: 300
    }));

    // Fournisseur AWS SES
    this.providers.set('aws_ses', new AWSSESProvider({
      name: 'AWS SES',
      priority: 4,
      dailyLimit: 10000,
      hourlyLimit: 1000
    }));

    console.log(`📧 ${this.providers.size} fournisseurs email initialisés`);
  }

  /**
   * 📋 Initialiser les templates par défaut
   */
  initializeTemplates() {
    // Template de prospection initiale
    this.templates.set('initial_outreach', {
      name: 'Prospection Initiale',
      subject: 'Collaboration {{company_name}} - {{sender_name}}',
      body: `Bonjour {{first_name}},

Je suis {{sender_name}} de {{sender_company}}. J'ai remarqué votre travail chez {{company_name}} et je pense que nous pourrions avoir des synergies intéressantes.

{{personalized_intro}}

Seriez-vous disponible pour un échange rapide de 15 minutes cette semaine ?

Cordialement,
{{sender_name}}
{{sender_title}}
{{sender_company}}`,
      type: 'prospection',
      variables: ['first_name', 'company_name', 'sender_name', 'sender_company', 'personalized_intro', 'sender_title']
    });

    // Template de follow-up
    this.templates.set('follow_up', {
      name: 'Relance',
      subject: 'Re: Collaboration {{company_name}}',
      body: `Bonjour {{first_name}},

J'espère que vous allez bien. Je fais suite à mon message de la semaine dernière concernant une potentielle collaboration entre {{company_name}} et {{sender_company}}.

{{follow_up_reason}}

Avez-vous eu l'occasion d'y réfléchir ? Je reste à votre disposition pour en discuter.

Cordialement,
{{sender_name}}`,
      type: 'follow_up',
      variables: ['first_name', 'company_name', 'sender_company', 'follow_up_reason', 'sender_name']
    });

    // Template de remerciement
    this.templates.set('thank_you', {
      name: 'Remerciement',
      subject: 'Merci pour votre temps, {{first_name}}',
      body: `Bonjour {{first_name}},

Merci beaucoup pour le temps que vous avez accordé à notre échange hier. C'était un plaisir de discuter de {{discussion_topic}}.

{{next_steps}}

Au plaisir de continuer nos échanges.

Cordialement,
{{sender_name}}`,
      type: 'thank_you',
      variables: ['first_name', 'discussion_topic', 'next_steps', 'sender_name']
    });

    console.log(`📋 ${this.templates.size} templates email initialisés`);
  }

  // Méthodes utilitaires
  async validateEmailConfig(config) {
    if (!config.to || !this.isValidEmail(config.to)) {
      throw new Error('Valid recipient email is required');
    }
    
    if (!config.subject || config.subject.trim() === '') {
      throw new Error('Email subject is required');
    }
    
    if (!config.body && !config.template) {
      throw new Error('Email body or template is required');
    }
  }

  async validateSequence(sequence) {
    if (!sequence.name || sequence.name.trim() === '') {
      throw new Error('Sequence name is required');
    }
    
    if (!sequence.steps || sequence.steps.length === 0) {
      throw new Error('At least one step is required');
    }
    
    if (!sequence.recipients || sequence.recipients.length === 0) {
      throw new Error('At least one recipient is required');
    }
  }

  async validateTemplate(template) {
    if (!template.name || template.name.trim() === '') {
      throw new Error('Template name is required');
    }
    
    if (!template.subject || template.subject.trim() === '') {
      throw new Error('Template subject is required');
    }
    
    if (!template.body || template.body.trim() === '') {
      throw new Error('Template body is required');
    }
  }

  async selectOptimalProvider(config) {
    // Sélectionner le fournisseur avec la meilleure disponibilité
    const availableProviders = Array.from(this.providers.values())
      .filter(p => p.isAvailable())
      .sort((a, b) => a.priority - b.priority);
    
    if (availableProviders.length === 0) {
      throw new Error('No email providers available');
    }
    
    return availableProviders[0];
  }

  calculateStepDelay(sequence, stepIndex) {
    if (stepIndex === 0) return 0; // Premier email immédiat
    
    const step = sequence.steps[stepIndex];
    const delay = step.delay || (24 * 60 * 60 * 1000); // 24h par défaut
    
    return delay;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// === MODÈLE SÉQUENCE EMAIL ===

class EmailSequence {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.steps = data.steps || [];
    this.recipients = data.recipients || [];
    this.status = data.status || 'created';
    this.createdAt = data.createdAt || new Date();
    this.startedAt = null;
    this.completedAt = null;
    this.executions = new Map(); // Map recipient email -> step executions
    this.config = data.config || {};
  }

  recordStepExecution(recipientEmail, stepIndex, result) {
    if (!this.executions.has(recipientEmail)) {
      this.executions.set(recipientEmail, []);
    }
    
    this.executions.get(recipientEmail)[stepIndex] = {
      result,
      timestamp: new Date(),
      status: result.success ? 'success' : 'failed'
    };
  }

  recordStepError(recipientEmail, stepIndex, error) {
    if (!this.executions.has(recipientEmail)) {
      this.executions.set(recipientEmail, []);
    }
    
    this.executions.get(recipientEmail)[stepIndex] = {
      error: error.message,
      timestamp: new Date(),
      status: 'error'
    };
  }

  getProgress() {
    const totalSteps = this.recipients.length * this.steps.length;
    let completedSteps = 0;
    
    for (const [email, executions] of this.executions.entries()) {
      completedSteps += executions.filter(e => e && e.status !== 'pending').length;
    }
    
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      steps: this.steps,
      recipients: this.recipients,
      status: this.status,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      progress: this.getProgress(),
      config: this.config
    };
  }
}

// === MODÈLE TEMPLATE EMAIL ===

class EmailTemplate {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.subject = data.subject;
    this.body = data.body;
    this.type = data.type || 'general';
    this.variables = data.variables || [];
    this.createdAt = data.createdAt || new Date();
    this.usageCount = 0;
  }

  render(variables = {}) {
    let subject = this.subject;
    let body = this.body;
    
    // Remplacer les variables dans le sujet et le corps
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value || '');
      body = body.replace(regex, value || '');
    }
    
    this.usageCount++;
    
    return { subject, body };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      subject: this.subject,
      body: this.body,
      type: this.type,
      variables: this.variables,
      createdAt: this.createdAt,
      usageCount: this.usageCount
    };
  }
}

// === ANALYTICS EMAIL ===

class EmailAnalytics {
  constructor() {
    this.emails = [];
    this.metrics = {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalReplied: 0,
      totalBounced: 0
    };
  }

  recordEmailSent(emailId, config, result) {
    this.emails.push({
      id: emailId,
      to: config.to,
      subject: config.subject,
      template: config.template,
      sequenceId: config.sequenceId,
      result,
      timestamp: new Date(),
      opens: 0,
      clicks: 0,
      replied: false,
      bounced: false
    });
    
    this.updateMetrics();
  }

  recordEmailOpened(emailId) {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.opens++;
      this.updateMetrics();
    }
  }

  recordEmailClicked(emailId, linkUrl) {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.clicks++;
      email.lastClickedUrl = linkUrl;
      this.updateMetrics();
    }
  }

  recordEmailReply(emailId) {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.replied = true;
      this.updateMetrics();
    }
  }

  updateMetrics() {
    this.metrics.totalSent = this.emails.length;
    this.metrics.totalDelivered = this.emails.filter(e => e.result.success).length;
    this.metrics.totalOpened = this.emails.filter(e => e.opens > 0).length;
    this.metrics.totalClicked = this.emails.filter(e => e.clicks > 0).length;
    this.metrics.totalReplied = this.emails.filter(e => e.replied).length;
    this.metrics.totalBounced = this.emails.filter(e => e.bounced).length;
  }

  getAnalytics(filters = {}) {
    let filteredEmails = this.emails;
    
    if (filters.dateFrom) {
      filteredEmails = filteredEmails.filter(e => e.timestamp >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      filteredEmails = filteredEmails.filter(e => e.timestamp <= new Date(filters.dateTo));
    }
    
    if (filters.sequenceId) {
      filteredEmails = filteredEmails.filter(e => e.sequenceId === filters.sequenceId);
    }
    
    const totalSent = filteredEmails.length;
    const totalOpened = filteredEmails.filter(e => e.opens > 0).length;
    const totalClicked = filteredEmails.filter(e => e.clicks > 0).length;
    const totalReplied = filteredEmails.filter(e => e.replied).length;
    
    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalReplied,
      openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
      replyRate: totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0,
      performance: {
        best_performing_templates: this.getBestPerformingTemplates(filteredEmails),
        engagement_by_day: this.getEngagementByDay(filteredEmails),
        recent_activity: this.getRecentActivity(filteredEmails)
      }
    };
  }

  getBestPerformingTemplates(emails) {
    const templateStats = {};
    
    emails.forEach(email => {
      if (email.template) {
        if (!templateStats[email.template]) {
          templateStats[email.template] = { sent: 0, opened: 0, clicked: 0, replied: 0 };
        }
        
        templateStats[email.template].sent++;
        if (email.opens > 0) templateStats[email.template].opened++;
        if (email.clicks > 0) templateStats[email.template].clicked++;
        if (email.replied) templateStats[email.template].replied++;
      }
    });
    
    return Object.entries(templateStats)
      .map(([template, stats]) => ({
        template,
        ...stats,
        openRate: stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0,
        replyRate: stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0
      }))
      .sort((a, b) => b.replyRate - a.replyRate)
      .slice(0, 5);
  }

  getEngagementByDay(emails) {
    const dayStats = {};
    
    emails.forEach(email => {
      const day = email.timestamp.toISOString().split('T')[0];
      if (!dayStats[day]) {
        dayStats[day] = { sent: 0, opened: 0, clicked: 0, replied: 0 };
      }
      
      dayStats[day].sent++;
      if (email.opens > 0) dayStats[day].opened++;
      if (email.clicks > 0) dayStats[day].clicked++;
      if (email.replied) dayStats[day].replied++;
    });
    
    return dayStats;
  }

  getRecentActivity(emails) {
    return emails
      .filter(e => e.opens > 0 || e.clicks > 0 || e.replied)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
      .map(e => ({
        emailId: e.id,
        to: e.to,
        subject: e.subject,
        activity: e.replied ? 'replied' : e.clicks > 0 ? 'clicked' : 'opened',
        timestamp: e.timestamp
      }));
  }
}

// === GESTIONNAIRE DE DÉLIVRABILITÉ ===

class DeliverabilityManager {
  constructor() {
    this.blacklist = new Set();
    this.reputation = new Map();
    this.limits = {
      hourly: 100,
      daily: 1000,
      burst: 10 // emails par minute
    };
    this.sentCount = {
      hourly: 0,
      daily: 0,
      lastHour: Date.now(),
      lastDay: Date.now()
    };
  }

  async checkDeliverability(config) {
    const checks = [
      this.checkBlacklist(config.to),
      this.checkRateLimit(),
      this.checkDomainReputation(config.to),
      this.checkContentSpam(config)
    ];
    
    const results = await Promise.all(checks);
    const canSend = results.every(r => r.passed);
    
    const score = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    
    return {
      canSend,
      score: Math.round(score),
      checks: results,
      reason: canSend ? 'OK' : results.find(r => !r.passed)?.reason
    };
  }

  checkBlacklist(email) {
    const domain = email.split('@')[1];
    const isBlacklisted = this.blacklist.has(email) || this.blacklist.has(domain);
    
    return {
      name: 'blacklist',
      passed: !isBlacklisted,
      score: isBlacklisted ? 0 : 100,
      reason: isBlacklisted ? 'Email or domain is blacklisted' : 'OK'
    };
  }

  checkRateLimit() {
    const now = Date.now();
    
    // Reset compteurs si nécessaire
    if (now - this.sentCount.lastHour > 3600000) { // 1 heure
      this.sentCount.hourly = 0;
      this.sentCount.lastHour = now;
    }
    
    if (now - this.sentCount.lastDay > 86400000) { // 24 heures
      this.sentCount.daily = 0;
      this.sentCount.lastDay = now;
    }
    
    const withinLimits = this.sentCount.hourly < this.limits.hourly && 
                        this.sentCount.daily < this.limits.daily;
    
    return {
      name: 'rate_limit',
      passed: withinLimits,
      score: withinLimits ? 100 : 0,
      reason: withinLimits ? 'OK' : 'Rate limit exceeded'
    };
  }

  checkDomainReputation(email) {
    const domain = email.split('@')[1];
    const reputation = this.reputation.get(domain) || 85; // Score par défaut
    
    return {
      name: 'domain_reputation',
      passed: reputation >= 70,
      score: reputation,
      reason: reputation >= 70 ? 'OK' : 'Low domain reputation'
    };
  }

  checkContentSpam(config) {
    const spamWords = ['urgent', 'act now', 'limited time', 'free', 'money back'];
    const content = `${config.subject} ${config.body || ''}`.toLowerCase();
    
    const spamWordCount = spamWords.filter(word => content.includes(word)).length;
    const spamScore = Math.max(0, 100 - (spamWordCount * 20));
    
    return {
      name: 'content_spam',
      passed: spamScore >= 70,
      score: spamScore,
      reason: spamScore >= 70 ? 'OK' : 'Content appears spammy'
    };
  }
}

// === MOTEUR DE PERSONNALISATION ===

class PersonalizationEngine {
  async personalizeEmail(config) {
    if (!config.recipientData) {
      return config;
    }
    
    const recipient = config.recipientData;
    
    // Personnalisation du sujet
    let personalizedSubject = config.subject;
    if (recipient.company_name) {
      personalizedSubject = personalizedSubject.replace(/{{company_name}}/g, recipient.company_name);
    }
    if (recipient.first_name) {
      personalizedSubject = personalizedSubject.replace(/{{first_name}}/g, recipient.first_name);
    }
    
    // Personnalisation du corps
    let personalizedBody = config.body;
    if (personalizedBody) {
      Object.entries(recipient).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        personalizedBody = personalizedBody.replace(regex, value || '');
      });
    }
    
    // Génération d'intro personnalisée avec IA
    const personalizedIntro = await this.generatePersonalizedIntro(recipient);
    personalizedBody = personalizedBody.replace(/{{personalized_intro}}/g, personalizedIntro);
    
    return {
      ...config,
      subject: personalizedSubject,
      body: personalizedBody
    };
  }

  async generatePersonalizedIntro(recipient) {
    // Simulation de génération IA d'intro personnalisée
    const intros = [
      `J'ai été impressionné par votre récente initiative chez ${recipient.company_name || 'votre entreprise'}.`,
      `Votre expertise en ${recipient.industry || 'votre secteur'} pourrait être très complémentaire à nos solutions.`,
      `Félicitations pour votre croissance chez ${recipient.company_name || 'votre entreprise'} !`,
      `J'ai remarqué vos accomplissements en tant que ${recipient.job_title || 'professionnel'}.`
    ];
    
    return intros[Math.floor(Math.random() * intros.length)];
  }
}

// === FOURNISSEURS EMAIL ===

class EmailProvider {
  constructor(config) {
    this.name = config.name;
    this.priority = config.priority;
    this.dailyLimit = config.dailyLimit;
    this.hourlyLimit = config.hourlyLimit;
    this.sentToday = 0;
    this.sentThisHour = 0;
    this.lastReset = Date.now();
  }

  isAvailable() {
    this.resetCountersIfNeeded();
    return this.sentThisHour < this.hourlyLimit && this.sentToday < this.dailyLimit;
  }

  resetCountersIfNeeded() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    
    if (now - this.lastReset > oneHour) {
      this.sentThisHour = 0;
    }
    
    if (now - this.lastReset > oneDay) {
      this.sentToday = 0;
      this.lastReset = now;
    }
  }

  async sendEmail(config) {
    if (!this.isAvailable()) {
      throw new Error(`Provider ${this.name} has reached its limits`);
    }
    
    // Simulation d'envoi
    await this.delay(500 + Math.random() * 1000);
    
    this.sentThisHour++;
    this.sentToday++;
    
    return {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: this.name,
      status: 'sent',
      timestamp: new Date()
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class SMTPProvider extends EmailProvider {
  async sendEmail(config) {
    console.log(`📧 SMTP: Envoi vers ${config.to}`);
    return await super.sendEmail(config);
  }
}

class SendGridProvider extends EmailProvider {
  async sendEmail(config) {
    console.log(`📧 SendGrid: Envoi vers ${config.to}`);
    return await super.sendEmail(config);
  }
}

class MailgunProvider extends EmailProvider {
  async sendEmail(config) {
    console.log(`📧 Mailgun: Envoi vers ${config.to}`);
    return await super.sendEmail(config);
  }
}

class AWSSESProvider extends EmailProvider {
  async sendEmail(config) {
    console.log(`📧 AWS SES: Envoi vers ${config.to}`);
    return await super.sendEmail(config);
  }
}

// Instance globale
const emailSystem = new EmailIntegrationSystem();

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
    const action = query.action || 'send';

    console.log(`📧 Email Integration: ${method} ${action}`);

    switch (action) {
      case 'send':
        return await handleSendEmail(req, res);
      
      case 'bulk':
        return await handleBulkEmail(req, res);
      
      case 'sequence':
        return await handleCreateSequence(req, res);
      
      case 'start_sequence':
        return await handleStartSequence(req, res);
      
      case 'template':
        return await handleCreateTemplate(req, res);
      
      case 'templates':
        return await handleGetTemplates(req, res);
      
      case 'analytics':
        return await handleGetAnalytics(req, res);
      
      case 'sequences':
        return await handleGetSequences(req, res);
      
      case 'track_open':
        return await handleTrackOpen(req, res);
      
      case 'track_click':
        return await handleTrackClick(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: ['send', 'bulk', 'sequence', 'start_sequence', 'template', 'templates', 'analytics', 'sequences', 'track_open', 'track_click']
        });
    }

  } catch (error) {
    console.error('❌ Email Integration Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
}

async function handleSendEmail(req, res) {
  try {
    const config = req.body;
    const result = await emailSystem.sendEmail(config);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleBulkEmail(req, res) {
  try {
    const config = req.body;
    const result = await emailSystem.sendBulkEmails(config);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleCreateSequence(req, res) {
  try {
    const config = req.body;
    const result = await emailSystem.createEmailSequence(config);
    
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleCreateTemplate(req, res) {
  try {
    const config = req.body;
    const result = await emailSystem.createEmailTemplate(config);
    
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleGetTemplates(req, res) {
  try {
    const templates = Array.from(emailSystem.templates.entries()).map(([id, template]) => ({
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

async function handleGetAnalytics(req, res) {
  try {
    const filters = req.query;
    const analytics = emailSystem.getEmailAnalytics(filters);
    
    return res.status(200).json({
      success: true,
      analytics,
      timestamp: new Date()
    });
  } catch (error) {
    throw error;
  }
}