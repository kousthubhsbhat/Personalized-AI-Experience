export interface Profile {
  id: string;
  username: string; // user.name handle e.g. 'janedoe'
  email: string;
  full_name: string;
  target_role: string;
  learning_style: 'hands-on' | 'visual' | 'theoretical';
  time_commitment_mins: number;
  avatar_seed?: string;
  security_pin?: string;
  created_at?: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  mastery_score: number; // 1 to 100
  last_updated: string;
}

export interface PathwayModule {
  id: string;
  pathway_id: string;
  module_order: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'remediation';
  ai_generated_content?: {
    overview: string;
    reading_material: string;
    code_snippet?: {
      language: string;
      code: string;
      explanation: string;
    };
    case_study?: {
      scenario: string;
      challenge: string;
      solution_strategy: string;
    };
    key_takeaways: string[];
    estimated_mins: number;
  } | null;
  created_at?: string;
}

export interface LearningPathway {
  id: string;
  user_id: string;
  title: string;
  domain: string;
  status: 'active' | 'completed' | 'archived';
  created_at?: string;
  modules?: PathwayModule[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
  questionType?: 'Architecture Scenario' | 'Code Output Debug' | 'Security & RLS Analysis' | 'Algorithmic Complexity' | 'System Design Tradeoff';
}

export interface QuizResultItem {
  questionId: string;
  question: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmissionResponse {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: QuizResultItem[];
  feedbackNotes: string;
  adaptationTriggered: boolean;
  remediationModule?: PathwayModule | null;
  pathway?: LearningPathway;
  skills?: UserSkill[];
}

export interface AnalyticsOverview {
  profile: Profile;
  stats: {
    avgMastery: number;
    completedModules: number;
    totalModules: number;
    inProgressModules: number;
    remediationCount: number;
    avgAssessmentScore: number;
    velocityMultiplier: string;
    hoursInvested: number;
    learningStreakDays: number;
  };
  skills: Array<{
    skill: string;
    current: number;
    target: number;
    fullMark: number;
  }>;
  recentLogs: Array<{
    id: string;
    module_id: string;
    score: number;
    feedback_notes: string;
    adaptation_triggered: boolean;
    created_at: string;
  }>;
  aiRecommendations: string[];
}
