const { Prospect, ContactInfo, ProspectionMetadata, LinkedInProfile } = require('../core/domain/entities/Prospect');

describe('Prospect', () => {
  describe('Initialization', () => {
    test('should create prospect with required fields', () => {
      const prospect = new Prospect({
        id: 'prospect-1',
        name: 'John Doe',
        title: 'Director of Technology',
        company: 'TechCorp',
        industry: 'technology'
      });

      expect(prospect.id).toBe('prospect-1');
      expect(prospect.name).toBe('John Doe');
      expect(prospect.title).toBe('Director of Technology');
      expect(prospect.company).toBe('TechCorp');
      expect(prospect.industry).toBe('technology');
    });

    test('should create prospect with optional fields', () => {
      const prospect = new Prospect({
        id: 'prospect-2',
        name: 'Jane Smith',
        title: 'VP Marketing',
        company: 'MarketCo',
        industry: 'ecommerce',
        email: 'jane@marketco.com',
        linkedinProfile: new LinkedInProfile({ url: 'https://linkedin.com/in/jane', profileId: 'jane-123' }),
        contactInfo: new ContactInfo({ email: 'jane@marketco.com', emailVerified: true })
      });

      expect(prospect.email).toBe('jane@marketco.com');
      expect(prospect.linkedinProfile).toBeDefined();
      expect(prospect.linkedinProfile.profileId).toBe('jane-123');
      expect(prospect.contactInfo.isEmailVerified()).toBe(true);
    });

    test('should initialize with default values', () => {
      const prospect = new Prospect({
        id: 'prospect-3',
        name: 'Bob Johnson',
        title: 'Manager',
        company: 'BizInc',
        industry: 'consulting'
      });

      expect(prospect.email).toBeNull();
      expect(prospect.linkedinProfile).toBeNull();
      expect(prospect.createdAt).toBeInstanceOf(Date);
      expect(prospect.updatedAt).toBeInstanceOf(Date);
      expect(prospect.version).toBe(1);
    });

    test('should use default ContactInfo when none provided', () => {
      const prospect = new Prospect({
        id: 'prospect-4',
        name: 'Alice Brown',
        title: 'Head of Sales',
        company: 'SalesForce',
        industry: 'banking'
      });

      expect(prospect.contactInfo).toBeInstanceOf(ContactInfo);
      expect(prospect.contactInfo.isEmailVerified()).toBe(false);
    });

    test('should use default ProspectionMetadata when none provided', () => {
      const prospect = new Prospect({
        id: 'prospect-5',
        name: 'Charlie Davis',
        title: 'Lead Developer',
        company: 'CodeCraft',
        industry: 'gaming'
      });

      expect(prospect.prospectionMetadata).toBeInstanceOf(ProspectionMetadata);
      expect(prospect.prospectionMetadata.status).toBe('new');
    });
  });

  describe('Validation Methods', () => {
    let prospect;

    beforeEach(() => {
      prospect = new Prospect({
        id: 'test-prospect',
        name: 'Test User',
        title: 'Director of Engineering',
        company: 'TestCo',
        industry: 'technology',
        email: 'test@testco.com'
      });
    });

    describe('hasCompleteProfile', () => {
      test('should return true when all required fields present', () => {
        expect(prospect.hasCompleteProfile()).toBeTruthy();
      });

      test('should return false when name missing', () => {
        prospect.name = null;
        expect(prospect.hasCompleteProfile()).toBeFalsy();
      });

      test('should return false when title missing', () => {
        prospect.title = null;
        expect(prospect.hasCompleteProfile()).toBeFalsy();
      });

      test('should return false when company missing', () => {
        prospect.company = null;
        expect(prospect.hasCompleteProfile()).toBeFalsy();
      });

      test('should return false when industry missing', () => {
        prospect.industry = null;
        expect(prospect.hasCompleteProfile()).toBeFalsy();
      });
    });

    describe('hasValidEmail', () => {
      test('should return true when email present and verified', () => {
        prospect.contactInfo.setEmailVerification(true);
        expect(prospect.hasValidEmail()).toBe(true);
      });

      test('should return false when email not verified', () => {
        prospect.contactInfo.setEmailVerification(false);
        expect(prospect.hasValidEmail()).toBe(false);
      });

      test('should return false when email null', () => {
        prospect.email = null;
        expect(prospect.hasValidEmail()).toBe(false);
      });
    });

    describe('hasLinkedInProfile', () => {
      test('should return true when linkedin profile exists and valid', () => {
        prospect.linkedinProfile = new LinkedInProfile({
          url: 'https://linkedin.com/in/test',
          profileId: 'test-123',
          isValid: true
        });
        expect(prospect.hasLinkedInProfile()).toBe(true);
      });

      test('should return false when linkedin profile null', () => {
        expect(prospect.hasLinkedInProfile()).toBe(false);
      });

      test('should return false when linkedin profile invalid', () => {
        prospect.linkedinProfile = new LinkedInProfile({
          url: 'https://linkedin.com/in/test',
          profileId: 'test-123',
          isValid: false
        });
        expect(prospect.hasLinkedInProfile()).toBe(false);
      });
    });

    describe('isInTargetIndustry', () => {
      test('should return true for technology industry', () => {
        prospect.industry = 'technology';
        expect(prospect.isInTargetIndustry()).toBe(true);
      });

      test('should return true for banking industry', () => {
        prospect.industry = 'banking';
        expect(prospect.isInTargetIndustry()).toBe(true);
      });

      test('should return true for ecommerce industry', () => {
        prospect.industry = 'ecommerce';
        expect(prospect.isInTargetIndustry()).toBe(true);
      });

      test('should return true for gaming industry', () => {
        prospect.industry = 'gaming';
        expect(prospect.isInTargetIndustry()).toBe(true);
      });

      test('should return true for consulting industry', () => {
        prospect.industry = 'consulting';
        expect(prospect.isInTargetIndustry()).toBe(true);
      });

      test('should return false for non-target industry', () => {
        prospect.industry = 'retail';
        expect(prospect.isInTargetIndustry()).toBe(false);
      });

      test('should be case insensitive', () => {
        prospect.industry = 'TECHNOLOGY';
        expect(prospect.isInTargetIndustry()).toBe(true);
      });
    });

    describe('hasSeniorPosition', () => {
      test('should return true for Head position', () => {
        prospect.title = 'Head of Engineering';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return true for Director position', () => {
        prospect.title = 'Director of Marketing';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return true for Manager position', () => {
        prospect.title = 'Manager of Sales';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return true for Chief position', () => {
        prospect.title = 'Chief Technology Officer';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return true for VP position', () => {
        prospect.title = 'VP of Operations';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return true for Vice President position', () => {
        prospect.title = 'Vice President of Strategy';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return true for Lead position', () => {
        prospect.title = 'Lead Developer';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });

      test('should return false for non-senior position', () => {
        prospect.title = 'Junior Developer';
        expect(prospect.hasSeniorPosition()).toBe(false);
      });

      test('should be case insensitive', () => {
        prospect.title = 'DIRECTOR OF ENGINEERING';
        expect(prospect.hasSeniorPosition()).toBe(true);
      });
    });
  });

  describe('Business Logic - calculateGraixlScore', () => {
    test('should return 0 for prospect with no information', () => {
      const prospect = new Prospect({
        id: 'minimal',
        name: 'Min',
        title: 'Intern',
        company: 'Start',
        industry: 'other'
      });

      expect(prospect.calculateGraixlScore()).toBe(0);
    });

    test('should add 30 points for complete profile', () => {
      const prospect = new Prospect({
        id: 'complete',
        name: 'Complete User',
        title: 'Director',
        company: 'CompleteCo',
        industry: 'technology'
      });

      expect(prospect.calculateGraixlScore()).toBeGreaterThanOrEqual(30);
    });

    test('should add 20 points for target industry', () => {
      const prospect = new Prospect({
        id: 'target-ind',
        name: 'Target User',
        title: 'Analyst',
        company: 'TargetCo',
        industry: 'technology'
      });

      expect(prospect.calculateGraixlScore()).toBeGreaterThanOrEqual(50);
    });

    test('should add 25 points for senior position', () => {
      const prospect = new Prospect({
        id: 'senior',
        name: 'Senior User',
        title: 'Director',
        company: 'SeniorCo',
        industry: 'technology'
      });

      expect(prospect.calculateGraixlScore()).toBeGreaterThanOrEqual(75);
    });

    test('should add 25 points for verified email', () => {
      const prospect = new Prospect({
        id: 'verified-email',
        name: 'Verified User',
        title: 'Director',
        company: 'VerifiedCo',
        industry: 'technology',
        email: 'verified@verifiedco.com'
      });
      prospect.contactInfo.setEmailVerification(true);

      expect(prospect.calculateGraixlScore()).toBeGreaterThanOrEqual(100);
    });

    test('should add 15 points for LinkedIn profile', () => {
      const prospect = new Prospect({
        id: 'linkedin',
        name: 'LinkedIn User',
        title: 'Director',
        company: 'LinkedInCo',
        industry: 'technology',
        email: 'linkedin@linkedinco.com'
      });
      prospect.contactInfo.setEmailVerification(true);
      prospect.linkedinProfile = new LinkedInProfile({
        url: 'https://linkedin.com/in/linkedin',
        profileId: 'linkedin-123',
        isValid: true
      });

      expect(prospect.calculateGraixlScore()).toBe(100);
    });

    test('should include engagement score from metadata', () => {
      const prospect = new Prospect({
        id: 'engagement',
        name: 'Engaged User',
        title: 'Director',
        company: 'EngagedCo',
        industry: 'technology',
        email: 'engaged@engagedco.com'
      });
      prospect.contactInfo.setEmailVerification(true);
      prospect.prospectionMetadata.addEnrichmentStep('initial', {});
      prospect.prospectionMetadata.addEnrichmentStep('research', {});

      expect(prospect.calculateGraixlScore()).toBe(100);
    });

    test('should cap score at maximum 100', () => {
      const prospect = new Prospect({
        id: 'max-score',
        name: 'Max User',
        title: 'Chief Executive Officer',
        company: 'MaxCo',
        industry: 'technology',
        email: 'max@maxco.com'
      });
      prospect.contactInfo.setEmailVerification(true);
      prospect.linkedinProfile = new LinkedInProfile({
        url: 'https://linkedin.com/in/max',
        profileId: 'max-123',
        isValid: true
      });

      for (let i = 0; i < 10; i++) {
        prospect.prospectionMetadata.addEnrichmentStep(`step-${i}`, {});
      }

      expect(prospect.calculateGraixlScore()).toBe(100);
    });

    test('should not return negative score', () => {
      const prospect = new Prospect({
        id: 'negative',
        name: 'Negative',
        title: 'Intern',
        company: 'NegativeCo',
        industry: 'unknown'
      });

      expect(prospect.calculateGraixlScore()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Email Generation Support - getPersonalizationData', () => {
    test('should return personalization data with correct structure', () => {
      const prospect = new Prospect({
        id: 'pers-test',
        name: 'Personalization User',
        title: 'Director of Sales',
        company: 'PersCo',
        industry: 'ecommerce',
        email: 'pers@persco.com'
      });

      const data = prospect.getPersonalizationData();

      expect(data).toEqual({
        name: 'Personalization User',
        firstName: 'Personalization',
        title: 'Director of Sales',
        company: 'PersCo',
        industry: 'ecommerce',
        graixlScore: expect.any(Number),
        seniorLevel: true,
        hasLinkedIn: false
      });
    });

    test('should extract first name correctly', () => {
      const prospect = new Prospect({
        id: 'first-name',
        name: 'Jean-Pierre Dupont',
        title: 'Manager',
        company: 'NameCo',
        industry: 'consulting'
      });

      const data = prospect.getPersonalizationData();
      expect(data.firstName).toBe('Jean-Pierre');
    });

    test('should calculate graixlScore in personalization data', () => {
      const prospect = new Prospect({
        id: 'score-pers',
        name: 'Score User',
        title: 'Director',
        company: 'ScoreCo',
        industry: 'technology'
      });

      const data = prospect.getPersonalizationData();
      expect(data.graixlScore).toBeGreaterThan(0);
    });

    test('should detect senior level correctly', () => {
      const prospect = new Prospect({
        id: 'senior-pers',
        name: 'Senior User',
        title: 'Intern',
        company: 'SeniorPersCo',
        industry: 'technology'
      });

      const data = prospect.getPersonalizationData();
      expect(data.seniorLevel).toBe(false);
    });

    test('should detect LinkedIn presence', () => {
      const prospect = new Prospect({
        id: 'linkedin-pers',
        name: 'LinkedIn User',
        title: 'Director',
        company: 'LinkedInPersCo',
        industry: 'technology'
      });
      prospect.linkedinProfile = new LinkedInProfile({
        url: 'https://linkedin.com/in/linkedinpers',
        profileId: 'linkedinpers-123',
        isValid: true
      });

      const data = prospect.getPersonalizationData();
      expect(data.hasLinkedIn).toBe(true);
    });
  });

  describe('Update Methods', () => {
    let prospect;

    beforeEach(() => {
      prospect = new Prospect({
        id: 'update-test',
        name: 'Update User',
        title: 'Director',
        company: 'UpdateCo',
        industry: 'technology'
      });
    });

    describe('enrichWithEmail', () => {
      test('should update email and verification status', () => {
        prospect.enrichWithEmail('new@email.com', true);

        expect(prospect.email).toBe('new@email.com');
        expect(prospect.hasValidEmail()).toBe(true);
      });

      test('should add enrichment step to metadata', () => {
        const initialSteps = prospect.prospectionMetadata.getStepsCount();
        prospect.enrichWithEmail('enriched@email.com', false);

        expect(prospect.prospectionMetadata.getStepsCount()).toBe(initialSteps + 1);
      });

      test('should update updatedAt timestamp', () => {
        const oldTimestamp = prospect.updatedAt;
        prospect.enrichWithEmail('updated@email.com', true);

        expect(prospect.updatedAt).not.toEqual(oldTimestamp);
      });

      test('should increment version', () => {
        const oldVersion = prospect.version;
        prospect.enrichWithEmail('version@email.com', true);

        expect(prospect.version).toBe(oldVersion + 1);
      });
    });

    describe('enrichWithLinkedIn', () => {
      test('should update LinkedIn profile', () => {
        const linkedinProfile = new LinkedInProfile({
          url: 'https://linkedin.com/in/test',
          profileId: 'test-456',
          isValid: true
        });

        prospect.enrichWithLinkedIn(linkedinProfile);

        expect(prospect.linkedinProfile).toEqual(linkedinProfile);
      });

      test('should add enrichment step to metadata', () => {
        const initialSteps = prospect.prospectionMetadata.getStepsCount();
        const linkedinProfile = new LinkedInProfile({
          url: 'https://linkedin.com/in/step',
          profileId: 'step-789',
          isValid: true
        });

        prospect.enrichWithLinkedIn(linkedinProfile);

        expect(prospect.prospectionMetadata.getStepsCount()).toBe(initialSteps + 1);
      });

      test('should update updatedAt timestamp', () => {
        const oldTimestamp = prospect.updatedAt;
        const linkedinProfile = new LinkedInProfile({
          url: 'https://linkedin.com/in/update',
          profileId: 'update-123',
          isValid: true
        });

        prospect.enrichWithLinkedIn(linkedinProfile);

        expect(prospect.updatedAt).not.toEqual(oldTimestamp);
      });

      test('should increment version', () => {
        const oldVersion = prospect.version;
        const linkedinProfile = new LinkedInProfile({
          url: 'https://linkedin.com/in/version',
          profileId: 'version-456',
          isValid: true
        });

        prospect.enrichWithLinkedIn(linkedinProfile);

        expect(prospect.version).toBe(oldVersion + 1);
      });
    });

    describe('updateProspectionStatus', () => {
      test('should update status in metadata', () => {
        prospect.updateProspectionStatus('contacted', 'agent-1', { method: 'email' });

        expect(prospect.prospectionMetadata.status).toBe('contacted');
      });

      test('should update updatedAt timestamp', () => {
        const oldTimestamp = prospect.updatedAt;
        prospect.updateProspectionStatus('qualified', 'agent-2', { score: 85 });

        expect(prospect.updatedAt).not.toEqual(oldTimestamp);
      });

      test('should increment version', () => {
        const oldVersion = prospect.version;
        prospect.updateProspectionStatus('converted', 'agent-3', { value: 50000 });

        expect(prospect.version).toBe(oldVersion + 1);
      });

      test('should add entry to prospection history', () => {
        const initialHistory = prospect.prospectionMetadata.prospectionHistory.length;
        prospect.updateProspectionStatus('in-progress', 'agent-4', { priority: 'high' });

        expect(prospect.prospectionMetadata.prospectionHistory.length).toBe(initialHistory + 1);
      });
    });
  });

  describe('Tagging System', () => {
    let prospect;

    beforeEach(() => {
      prospect = new Prospect({
        id: 'tag-test',
        name: 'Tag User',
        title: 'Director',
        company: 'TagCo',
        industry: 'technology'
      });
    });

    test('should add tag with default source', () => {
      prospect.addTag('high-value');

      expect(prospect.hasTag('high-value')).toBe(true);
    });

    test('should add tag with custom source', () => {
      prospect.addTag('auto-tag', 'ai-agent');

      expect(prospect.hasTag('auto-tag')).toBe(true);
    });

    test('should update updatedAt when adding tag', () => {
      const oldTimestamp = prospect.updatedAt;
      prospect.addTag('priority');

      expect(prospect.updatedAt).not.toEqual(oldTimestamp);
    });

    test('should remove existing tag', () => {
      prospect.addTag('remove-me');
      expect(prospect.hasTag('remove-me')).toBe(true);

      prospect.removeTag('remove-me');
      expect(prospect.hasTag('remove-me')).toBe(false);
    });

    test('should update updatedAt when removing tag', () => {
      prospect.addTag('update-on-remove');
      const oldTimestamp = prospect.updatedAt;

      prospect.removeTag('update-on-remove');

      expect(prospect.updatedAt).not.toEqual(oldTimestamp);
    });

    test('should handle removing non-existent tag gracefully', () => {
      expect(() => prospect.removeTag('non-existent')).not.toThrow();
    });

    test('should handle multiple tags', () => {
      prospect.addTag('tag1');
      prospect.addTag('tag2');
      prospect.addTag('tag3');

      expect(prospect.hasTag('tag1')).toBe(true);
      expect(prospect.hasTag('tag2')).toBe(true);
      expect(prospect.hasTag('tag3')).toBe(true);
    });
  });

  describe('Analytics Support - getAnalyticsData', () => {
    test('should return analytics data with correct structure', () => {
      const prospect = new Prospect({
        id: 'analytics-test',
        name: 'Analytics User',
        title: 'Director',
        company: 'AnalyticsCo',
        industry: 'technology',
        email: 'analytics@analyticsco.com'
      });

      const data = prospect.getAnalyticsData();

      expect(data).toEqual({
        id: 'analytics-test',
        industry: 'technology',
        title: 'Director',
        company: 'AnalyticsCo',
        graixlScore: expect.any(Number),
        hasEmail: true,
        hasLinkedIn: false,
        createdAt: expect.any(Date),
        prospectionSteps: 0,
        tags: []
      });
    });

    test('should include LinkedIn presence in analytics', () => {
      const prospect = new Prospect({
        id: 'analytics-linkedin',
        name: 'LinkedIn Analytics',
        title: 'Director',
        company: 'LinkedInAnalyticsCo',
        industry: 'technology'
      });
      prospect.linkedinProfile = new LinkedInProfile({
        url: 'https://linkedin.com/in/analyticslinkedin',
        profileId: 'analyticslinkedin-123',
        isValid: true
      });

      const data = prospect.getAnalyticsData();
      expect(data.hasLinkedIn).toBe(true);
    });

    test('should include prospection steps count', () => {
      const prospect = new Prospect({
        id: 'analytics-steps',
        name: 'Steps Analytics',
        title: 'Director',
        company: 'StepsAnalyticsCo',
        industry: 'technology'
      });
      prospect.prospectionMetadata.addEnrichmentStep('step1', {});
      prospect.prospectionMetadata.addEnrichmentStep('step2', {});

      const data = prospect.getAnalyticsData();
      expect(data.prospectionSteps).toBe(2);
    });

    test('should include tags in analytics', () => {
      const prospect = new Prospect({
        id: 'analytics-tags',
        name: 'Tags Analytics',
        title: 'Director',
        company: 'TagsAnalyticsCo',
        industry: 'technology'
      });
      prospect.addTag('analytics-tag1');
      prospect.addTag('analytics-tag2');

      const data = prospect.getAnalyticsData();
      expect(data.tags).toEqual(['analytics-tag1', 'analytics-tag2']);
    });

    test('should calculate graixlScore in analytics data', () => {
      const prospect = new Prospect({
        id: 'analytics-score',
        name: 'Score Analytics',
        title: 'Chief Executive Officer',
        company: 'ScoreAnalyticsCo',
        industry: 'technology'
      });

      const data = prospect.getAnalyticsData();
      expect(data.graixlScore).toBeGreaterThan(0);
    });
  });

  describe('Domain Events', () => {
    let prospect;

    beforeEach(() => {
      prospect = new Prospect({
        id: 'events-test',
        name: 'Events User',
        title: 'Director',
        company: 'EventsCo',
        industry: 'technology'
      });
    });

    test('should retrieve uncommitted events', () => {
      prospect.addTag('event-tag', 'manual');
      const events = prospect.getUncommittedEvents();

      expect(events.length).toBeGreaterThan(0);
    });

    test('should mark events as committed', () => {
      prospect.addTag('commit-tag', 'manual');
      expect(prospect.getUncommittedEvents().length).toBeGreaterThan(0);

      prospect.markEventsAsCommitted();
      expect(prospect.getUncommittedEvents().length).toBe(0);
    });

    test('should generate enrichment events', () => {
      prospect.enrichWithEmail('event@email.com', true);
      const events = prospect.getUncommittedEvents();

      const enrichmentEvent = events.find(e => e.type === 'ProspectEnriched');
      expect(enrichmentEvent).toBeDefined();
    });
  });

  describe('Export/Serialization', () => {
    let prospect;

    beforeEach(() => {
      prospect = new Prospect({
        id: 'serialize-test',
        name: 'Serialize User',
        title: 'Director',
        company: 'SerializeCo',
        industry: 'technology',
        email: 'serialize@serializeco.com'
      });
      prospect.addTag('serialize-tag');
    });

    test('should serialize to JSON correctly', () => {
      const json = prospect.toJSON();

      expect(json).toEqual({
        id: 'serialize-test',
        name: 'Serialize User',
        title: 'Director',
        company: 'SerializeCo',
        industry: 'technology',
        email: 'serialize@serializeco.com',
        linkedinProfile: undefined,
        contactInfo: expect.any(Object),
        prospectionMetadata: expect.any(Object),
        graixlScore: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        version: 1
      });
    });

    test('should deserialize from JSON correctly', () => {
      const json = prospect.toJSON();
      const deserialized = Prospect.fromJSON(json);

      expect(deserialized.id).toBe(prospect.id);
      expect(deserialized.name).toBe(prospect.name);
      expect(deserialized.title).toBe(prospect.title);
      expect(deserialized.company).toBe(prospect.company);
      expect(deserialized.industry).toBe(prospect.industry);
      expect(deserialized.email).toBe(prospect.email);
      expect(deserialized.version).toBe(prospect.version);
    });

    test('should maintain calculated score after deserialization', () => {
      const json = prospect.toJSON();
      const deserialized = Prospect.fromJSON(json);

      expect(deserialized.calculateGraixlScore()).toBe(prospect.calculateGraixlScore());
    });

    test('should maintain tags after deserialization', () => {
      const json = prospect.toJSON();
      const deserialized = Prospect.fromJSON(json);

      expect(deserialized.hasTag('serialize-tag')).toBe(true);
    });

    test('should serialize LinkedIn profile', () => {
      prospect.linkedinProfile = new LinkedInProfile({
        url: 'https://linkedin.com/in/serialize',
        profileId: 'serialize-123',
        isValid: true
      });

      const json = prospect.toJSON();
      expect(json.linkedinProfile).toBeDefined();
      expect(json.linkedinProfile.profileId).toBe('serialize-123');
    });

    test('should deserialize LinkedIn profile', () => {
      prospect.linkedinProfile = new LinkedInProfile({
        url: 'https://linkedin.com/in/deserialize',
        profileId: 'deserialize-456',
        isValid: true
      });

      const json = prospect.toJSON();
      const deserialized = Prospect.fromJSON(json);

      expect(deserialized.linkedinProfile).toBeDefined();
      expect(deserialized.linkedinProfile.profileId).toBe('deserialize-456');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string name', () => {
      const prospect = new Prospect({
        id: 'empty-name',
        name: '',
        title: 'Director',
        company: 'EmptyNameCo',
        industry: 'technology'
      });

      expect(prospect.hasCompleteProfile()).toBeFalsy();
    });

    test('should handle undefined optional fields', () => {
      const prospect = new Prospect({
        id: 'undefined-optional',
        name: 'Undefined User',
        title: 'Director',
        company: 'UndefinedCo',
        industry: 'technology',
        email: undefined,
        linkedinProfile: undefined
      });

      expect(prospect.email).toBeNull();
      expect(prospect.linkedinProfile).toBeNull();
    });

    test('should handle array with zero enrichment steps', () => {
      const prospect = new Prospect({
        id: 'zero-steps',
        name: 'Zero Steps User',
        title: 'Director',
        company: 'ZeroStepsCo',
        industry: 'technology'
      });

      expect(prospect.prospectionMetadata.getStepsCount()).toBe(0);
      expect(prospect.prospectionMetadata.getEngagementScore()).toBe(0);
    });

    test('should handle very long company name', () => {
      const longName = 'A'.repeat(500);
      const prospect = new Prospect({
        id: 'long-company',
        name: 'Long Company User',
        title: 'Director',
        company: longName,
        industry: 'technology'
      });

      expect(prospect.company).toBe(longName);
    });

    test('should handle special characters in name', () => {
      const prospect = new Prospect({
        id: 'special-chars',
        name: 'Jean-Pierre François-Müller',
        title: 'Director',
        company: 'SpecialCharsCo',
        industry: 'technology'
      });

      const data = prospect.getPersonalizationData();
      expect(data.firstName).toBe('Jean-Pierre');
    });

    test('should handle single word name', () => {
      const prospect = new Prospect({
        id: 'single-word',
        name: 'Madonna',
        title: 'Director',
        company: 'SingleWordCo',
        industry: 'technology'
      });

      const data = prospect.getPersonalizationData();
      expect(data.firstName).toBe('Madonna');
    });
  });

  describe('Value Objects - ContactInfo', () => {
    test('should create with default values', () => {
      const contactInfo = new ContactInfo();

      expect(contactInfo.email).toBeNull();
      expect(contactInfo.emailVerified).toBe(false);
      expect(contactInfo.phone).toBeNull();
      expect(contactInfo.phoneVerified).toBe(false);
      expect(contactInfo.socialProfiles).toEqual([]);
    });

    test('should create with provided values', () => {
      const contactInfo = new ContactInfo({
        email: 'test@test.com',
        emailVerified: true,
        phone: '+1234567890',
        phoneVerified: true,
        socialProfiles: [{ platform: 'twitter', url: 'https://twitter.com/test' }]
      });

      expect(contactInfo.email).toBe('test@test.com');
      expect(contactInfo.isEmailVerified()).toBe(true);
      expect(contactInfo.phone).toBe('+1234567890');
    });

    test('should add social profile', () => {
      const contactInfo = new ContactInfo();
      contactInfo.addSocialProfile('linkedin', 'https://linkedin.com/in/test');

      expect(contactInfo.socialProfiles.length).toBe(1);
      expect(contactInfo.socialProfiles[0].platform).toBe('linkedin');
      expect(contactInfo.socialProfiles[0].url).toBe('https://linkedin.com/in/test');
    });

    test('should set email verification', () => {
      const contactInfo = new ContactInfo({ email: 'test@test.com' });
      contactInfo.setEmailVerification(true);

      expect(contactInfo.isEmailVerified()).toBe(true);
    });
  });

  describe('Value Objects - ProspectionMetadata', () => {
    let metadata;

    beforeEach(() => {
      metadata = new ProspectionMetadata();
    });

    test('should create with default status', () => {
      expect(metadata.status).toBe('new');
    });

    test('should update status', () => {
      metadata.updateStatus('contacted', 'agent-1', { method: 'email' });

      expect(metadata.status).toBe('contacted');
    });

    test('should add enrichment step', () => {
      metadata.addEnrichmentStep('email', { email: 'test@test.com' });

      expect(metadata.enrichmentSteps.length).toBe(1);
      expect(metadata.enrichmentSteps[0].type).toBe('email');
    });

    test('should calculate engagement score', () => {
      metadata.addEnrichmentStep('step1', {});
      metadata.addEnrichmentStep('step2', {});
      metadata.updateStatus('in-progress', 'agent-2');

      const score = metadata.getEngagementScore();
      expect(score).toBeGreaterThan(0);
    });

    test('should cap engagement score at 30', () => {
      for (let i = 0; i < 20; i++) {
        metadata.addEnrichmentStep(`step-${i}`, {});
      }
      for (let i = 0; i < 20; i++) {
        metadata.updateStatus(`status-${i}`, 'agent-test');
      }

      expect(metadata.getEngagementScore()).toBeLessThanOrEqual(30);
    });

    test('should retrieve tags as array', () => {
      metadata.addTag('tag1');
      metadata.addTag('tag2');

      const tags = metadata.getTags();
      expect(tags).toContain('tag1');
      expect(tags).toContain('tag2');
    });
  });

  describe('Value Objects - LinkedInProfile', () => {
    let profile;

    beforeEach(() => {
      profile = new LinkedInProfile({
        url: 'https://linkedin.com/in/testprofile',
        profileId: 'test-profile-123',
        summary: 'Test summary',
        experience: [
          { title: 'Senior Developer', company: 'TestCo' },
          { title: 'Junior Developer', company: 'StartUp' }
        ],
        education: [{ school: 'Test University', degree: 'CS' }],
        skills: ['javascript', 'nodejs', 'react'],
        connections: 500,
        isValid: true
      });
    });

    test('should create with all fields', () => {
      expect(profile.url).toBe('https://linkedin.com/in/testprofile');
      expect(profile.profileId).toBe('test-profile-123');
      expect(profile.connections).toBe(500);
      expect(profile.isValid).toBe(true);
    });

    test('should detect senior profile', () => {
      expect(profile.isSeniorProfile()).toBe(true);
    });

    test('should return false for non-senior profile', () => {
      const nonSenior = new LinkedInProfile({
        url: 'https://linkedin.com/in/nonsenior',
        profileId: 'non-senior-123',
        experience: [
          { title: 'Intern', company: 'TestCo' },
          { title: 'Associate', company: 'StartUp' }
        ]
      });

      expect(nonSenior.isSeniorProfile()).toBe(false);
    });

    test('should filter relevant skills', () => {
      const targetSkills = ['javascript', 'python', 'java'];
      const relevant = profile.getRelevantSkills(targetSkills);

      expect(relevant).toContain('javascript');
      expect(relevant).not.toContain('nodejs');
    });

    test('should be case insensitive when filtering skills', () => {
      const targetSkills = ['JavaScript', 'Python'];
      const relevant = profile.getRelevantSkills(targetSkills);

      expect(relevant).toContain('javascript');
    });

    test('should serialize to JSON', () => {
      const json = profile.toJSON();

      expect(json).toEqual({
        url: 'https://linkedin.com/in/testprofile',
        profileId: 'test-profile-123',
        summary: 'Test summary',
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Array),
        connections: 500,
        isValid: true,
        scrapedAt: expect.any(Date)
      });
    });

    test('should deserialize from JSON', () => {
      const json = profile.toJSON();
      const deserialized = LinkedInProfile.fromJSON(json);

      expect(deserialized.url).toBe(profile.url);
      expect(deserialized.profileId).toBe(profile.profileId);
      expect(deserialized.connections).toBe(profile.connections);
    });
  });
});
