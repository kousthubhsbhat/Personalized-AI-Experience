import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import {
  Profile,
  UserSkill,
  LearningPathway,
  PathwayModule,
  AssessmentLog
} from '../validators.js';

// In-Memory Fallback Database with pre-seeded rich mock data for instant testing
interface LocalStore {
  profiles: Map<string, Profile>;
  user_skills: Map<string, UserSkill[]>;
  pathways: Map<string, LearningPathway>;
  modules: Map<string, PathwayModule[]>;
  assessment_logs: Map<string, AssessmentLog[]>;
}

const localStore: LocalStore = {
  profiles: new Map(),
  user_skills: new Map(),
  pathways: new Map(),
  modules: new Map(),
  assessment_logs: new Map(),
};

// Seed default demo user
const seedUserId = 'user_dev_pulse_01';
localStore.profiles.set(seedUserId, {
  id: seedUserId,
  email: 'learner@skillpulse.ai',
  full_name: 'AI Learner',
  target_role: 'Senior Full-Stack AI Engineer',
  learning_style: 'hands-on',
  time_commitment_mins: 45,
  created_at: new Date().toISOString()
});

localStore.user_skills.set(seedUserId, [
  { id: uuidv4(), user_id: seedUserId, skill_name: 'React & TypeScript', mastery_score: 78, last_updated: new Date().toISOString() },
  { id: uuidv4(), user_id: seedUserId, skill_name: 'Node.js & Express Architecture', mastery_score: 65, last_updated: new Date().toISOString() },
  { id: uuidv4(), user_id: seedUserId, skill_name: 'PostgreSQL & Database RLS', mastery_score: 60, last_updated: new Date().toISOString() },
  { id: uuidv4(), user_id: seedUserId, skill_name: 'Gemini AI & LLM Systems', mastery_score: 72, last_updated: new Date().toISOString() },
  { id: uuidv4(), user_id: seedUserId, skill_name: 'Distributed Cloud Systems', mastery_score: 52, last_updated: new Date().toISOString() }
]);

const defaultPathwayId = 'pathway-dev-01';
localStore.pathways.set(defaultPathwayId, {
  id: defaultPathwayId,
  user_id: seedUserId,
  title: 'Senior Full-Stack AI Engineer Adaptive Track',
  domain: 'Full-Stack Web Development',
  status: 'active',
  created_at: new Date().toISOString()
});

localStore.modules.set(defaultPathwayId, [
  {
    id: 'mod-101',
    pathway_id: defaultPathwayId,
    module_order: 1,
    title: 'Modern Reactive State Machines & Optimistic UI',
    description: 'Fine-grained reactivity, normalized caches, and zero-latency client state synchronization.',
    difficulty: 'beginner',
    status: 'completed',
    ai_generated_content: {
      overview: 'Master client state machines and deterministic mutations for rich web applications.',
      reading_material: '### State Management Foundations\nState machines prevent impossible UI states by constraining transitions to explicit events.',
      code_snippet: {
        language: 'typescript',
        code: 'const transition = (state: string, action: string) => state;',
        explanation: 'Deterministic state transition helper.'
      },
      case_study: {
        scenario: 'High frequency dashboard updates.',
        challenge: 'UI lagging under rapid data bursts.',
        solution_strategy: 'Applied optimistic mutations with request debouncing.'
      },
      key_takeaways: ['Never allow invalid state permutations', 'Debounce high-rate inputs'],
      estimated_mins: 15
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'mod-102',
    pathway_id: defaultPathwayId,
    module_order: 2,
    title: 'High-Performance API Design & PostgreSQL RLS',
    description: 'Architect type-safe REST/GraphQL endpoints with granular Row-Level Security in Postgres.',
    difficulty: 'intermediate',
    status: 'in_progress',
    ai_generated_content: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'mod-103',
    pathway_id: defaultPathwayId,
    module_order: 3,
    title: 'Distributed Caching & Real-Time Event Streams',
    description: 'Implement Redis caching layers, WebSockets, and pub/sub message synchronization.',
    difficulty: 'intermediate',
    status: 'pending',
    ai_generated_content: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'mod-104',
    pathway_id: defaultPathwayId,
    module_order: 4,
    title: 'Edge Computing, Serverless Workflows & Gemini AI Orchestration',
    description: 'Deploy globally distributed edge functions with streaming AI inference and resilience.',
    difficulty: 'advanced',
    status: 'pending',
    ai_generated_content: null,
    created_at: new Date().toISOString()
  }
]);

export class DBService {
  // --- Profile Operations ---
  static async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) return data as Profile;
    }
    return localStore.profiles.get(userId) || null;
  }

  static async upsertProfile(profile: Partial<Profile> & { id: string; email: string }): Promise<Profile> {
    const fullProfile: Profile = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || profile.email.split('@')[0],
      target_role: profile.target_role || 'Full-Stack Developer',
      learning_style: profile.learning_style || 'hands-on',
      time_commitment_mins: profile.time_commitment_mins || 30,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').upsert(fullProfile);
    }
    localStore.profiles.set(profile.id, fullProfile);
    return fullProfile;
  }

  // --- Skills Matrix Operations ---
  static async getUserSkills(userId: string): Promise<UserSkill[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('user_skills').select('*').eq('user_id', userId);
      if (!error && data && data.length > 0) return data as UserSkill[];
    }
    const local = localStore.user_skills.get(userId);
    if (local && local.length > 0) return local;
    return localStore.user_skills.get(seedUserId) || [];
  }

  static async setUserSkills(userId: string, skillsMap: Record<string, number>): Promise<UserSkill[]> {
    const skillsList: UserSkill[] = Object.entries(skillsMap).map(([skill_name, rating]) => ({
      id: uuidv4(),
      user_id: userId,
      skill_name,
      mastery_score: Math.min(100, Math.max(1, rating * 20)), // Scale 1-5 to 20-100%
      last_updated: new Date().toISOString()
    }));

    if (isSupabaseConfigured && supabase) {
      for (const skill of skillsList) {
        await supabase.from('user_skills').upsert({
          user_id: userId,
          skill_name: skill.skill_name,
          mastery_score: skill.mastery_score,
          last_updated: skill.last_updated
        }, { onConflict: 'user_id,skill_name' });
      }
    }
    localStore.user_skills.set(userId, skillsList);
    return skillsList;
  }

  static async updateSkillMastery(userId: string, skillName: string, delta: number): Promise<void> {
    const userSkills = localStore.user_skills.get(userId) || [];
    const skill = userSkills.find(s => s.skill_name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.skill_name.toLowerCase()));
    
    if (skill) {
      skill.mastery_score = Math.min(100, Math.max(5, skill.mastery_score + delta));
      skill.last_updated = new Date().toISOString();
    } else {
      userSkills.push({
        id: uuidv4(),
        user_id: userId,
        skill_name: skillName,
        mastery_score: Math.min(100, Math.max(10, 50 + delta)),
        last_updated: new Date().toISOString()
      });
    }
    localStore.user_skills.set(userId, userSkills);

    if (isSupabaseConfigured && supabase) {
      // Supabase update
      await supabase.from('user_skills').upsert({
        user_id: userId,
        skill_name: skill ? skill.skill_name : skillName,
        mastery_score: skill ? skill.mastery_score : Math.min(100, Math.max(10, 50 + delta)),
        last_updated: new Date().toISOString()
      }, { onConflict: 'user_id,skill_name' });
    }
  }

  // --- Learning Pathways Operations ---
  static async createPathway(
    userId: string,
    title: string,
    domain: string,
    rawModules: Array<{
      module_order: number;
      title: string;
      description: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    }>
  ): Promise<LearningPathway> {
    const pathwayId = uuidv4();
    const newPathway: LearningPathway = {
      id: pathwayId,
      user_id: userId,
      title,
      domain,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const modulesList: PathwayModule[] = rawModules.map((m, idx) => ({
      id: uuidv4(),
      pathway_id: pathwayId,
      module_order: m.module_order || idx + 1,
      title: m.title,
      description: m.description,
      difficulty: m.difficulty,
      status: idx === 0 ? 'in_progress' : 'pending',
      ai_generated_content: null,
      created_at: new Date().toISOString()
    }));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('learning_pathways').insert(newPathway);
      await supabase.from('pathway_modules').insert(modulesList);
    }

    localStore.pathways.set(pathwayId, newPathway);
    localStore.modules.set(pathwayId, modulesList);

    return { ...newPathway, modules: modulesList };
  }

  static async getPathway(pathwayId: string, userId: string): Promise<LearningPathway | null> {
    let pathway: LearningPathway | null = null;
    let modules: PathwayModule[] = [];

    if (isSupabaseConfigured && supabase) {
      const { data: pData } = await supabase
        .from('learning_pathways')
        .select('*')
        .eq('id', pathwayId)
        .eq('user_id', userId)
        .single();
      
      if (pData) {
        pathway = pData as LearningPathway;
        const { data: mData } = await supabase
          .from('pathway_modules')
          .select('*')
          .eq('pathway_id', pathwayId)
          .order('module_order', { ascending: true });
        
        modules = (mData || []) as PathwayModule[];
      }
    }

    if (!pathway) {
      pathway = localStore.pathways.get(pathwayId) || null;
      if (pathway) {
        modules = localStore.modules.get(pathwayId) || [];
      }
    }

    if (!pathway) return null;
    return { ...pathway, modules };
  }

  static async getLatestPathwayForUser(userId: string): Promise<LearningPathway | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: pData } = await supabase
        .from('learning_pathways')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (pData) {
        return this.getPathway(pData.id, userId);
      }
    }

    // Check local store for any user pathway
    for (const [id, path] of localStore.pathways.entries()) {
      if (path.user_id === userId || userId.startsWith('user_dev')) {
        const modules = localStore.modules.get(id) || [];
        return { ...path, modules };
      }
    }

    // Default fallback to first pathway in store
    const firstPathway = Array.from(localStore.pathways.values())[0];
    if (firstPathway) {
      const modules = localStore.modules.get(firstPathway.id) || [];
      return { ...firstPathway, modules };
    }

    return null;
  }

  // --- Module Operations ---
  static async getModuleById(moduleId: string): Promise<PathwayModule | null> {
    for (const [pathId, mods] of localStore.modules.entries()) {
      const found = mods.find(m => m.id === moduleId);
      if (found) return found;
    }

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('pathway_modules').select('*').eq('id', moduleId).single();
      if (data) return data as PathwayModule;
    }
    return null;
  }

  static async updateModule(moduleId: string, updates: Partial<PathwayModule>): Promise<PathwayModule | null> {
    for (const [pathId, mods] of localStore.modules.entries()) {
      const idx = mods.findIndex(m => m.id === moduleId);
      if (idx !== -1) {
        mods[idx] = { ...mods[idx], ...updates };
        localStore.modules.set(pathId, mods);
        return mods[idx];
      }
    }

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('pathway_modules')
        .update(updates)
        .eq('id', moduleId)
        .select()
        .single();
      if (data) return data as PathwayModule;
    }
    return null;
  }

  // --- Dynamic Adaptation Operations ---
  // If Score < 60%: Injects a remediation module immediately after current module
  static async injectRemediationModule(
    pathwayId: string,
    currentOrder: number,
    remediationData: {
      title: string;
      description: string;
      difficulty: 'beginner' | 'intermediate';
      overview: string;
      drillCode: string;
    }
  ): Promise<PathwayModule> {
    const modules = localStore.modules.get(pathwayId) || [];
    
    // Shift subsequent modules order by 1
    modules.forEach(m => {
      if (m.module_order > currentOrder) {
        m.module_order += 1;
      }
    });

    const newModule: PathwayModule = {
      id: uuidv4(),
      pathway_id: pathwayId,
      module_order: currentOrder + 1,
      title: remediationData.title,
      description: remediationData.description,
      difficulty: remediationData.difficulty,
      status: 'in_progress', // immediately ready to study
      ai_generated_content: {
        overview: remediationData.overview,
        reading_material: `### 🎯 Targeted Remediation Drill\n\nThis focused module addresses the specific knowledge gap detected during your assessment.\n\n#### Key Focus Areas:\n- Foundational terminology & mechanical semantics\n- Avoiding common edge-case pitfalls\n- Step-by-step diagnostic verification`,
        code_snippet: {
          language: 'typescript',
          code: remediationData.drillCode,
          explanation: 'Step-by-step minimal demonstration of prerequisite concept.'
        },
        key_takeaways: [
          'Master simple invariants before scaling complexity.',
          'Verify every precondition and input type.',
          'Re-test understanding with the diagnostic quiz.'
        ],
        estimated_mins: 8
      },
      created_at: new Date().toISOString()
    };

    modules.splice(currentOrder, 0, newModule);
    // Sort modules by order
    modules.sort((a, b) => a.module_order - b.module_order);
    localStore.modules.set(pathwayId, modules);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('pathway_modules').insert(newModule);
    }

    return newModule;
  }

  // If Score > 90%: Fast-track / skip prerequisite or promote difficulty
  static async fastTrackPathway(pathwayId: string, currentOrder: number): Promise<void> {
    const modules = localStore.modules.get(pathwayId) || [];
    const nextModule = modules.find(m => m.module_order === currentOrder + 1);
    if (nextModule) {
      // If next module was beginner, promote to intermediate
      if (nextModule.difficulty === 'beginner') {
        nextModule.difficulty = 'intermediate';
      }
      nextModule.status = 'in_progress';
    }
  }

  // --- Assessment Logs ---
  static async recordAssessmentLog(
    userId: string,
    moduleId: string,
    score: number,
    feedbackNotes: string,
    adaptationTriggered: boolean
  ): Promise<AssessmentLog> {
    const log: AssessmentLog = {
      id: uuidv4(),
      user_id: userId,
      module_id: moduleId,
      score,
      feedback_notes: feedbackNotes,
      adaptation_triggered: adaptationTriggered,
      created_at: new Date().toISOString()
    };

    const userLogs = localStore.assessment_logs.get(userId) || [];
    userLogs.push(log);
    localStore.assessment_logs.set(userId, userLogs);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('assessment_logs').insert(log);
    }

    return log;
  }

  static async getAssessmentLogs(userId: string): Promise<AssessmentLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('assessment_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) return data as AssessmentLog[];
    }
    return localStore.assessment_logs.get(userId) || [];
  }
}
