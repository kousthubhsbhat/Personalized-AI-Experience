import axios from 'axios';
import {
  LearningPathway,
  PathwayModule,
  QuizQuestion,
  QuizSubmissionResponse,
  AnalyticsOverview,
  Profile,
  UserSkill
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach mock/dev bearer token for Supabase/Express auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillpulse_auth_token') || 'demo-user-token';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface OnboardingPayload {
  target_role: string;
  learning_style: 'hands-on' | 'visual' | 'theoretical';
  time_commitment_mins: number;
  initial_skills: Record<string, number>;
}

export const api = {
  // Health
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Onboarding & Pathways
  submitOnboarding: async (data: OnboardingPayload): Promise<{ message: string; pathway: LearningPathway }> => {
    const res = await apiClient.post('/onboarding/generate-path', data);
    return res.data;
  },

  getCurrentPathway: async (): Promise<{ pathway: LearningPathway; skills: UserSkill[]; profile: Profile }> => {
    const res = await apiClient.get('/pathway/user/current');
    return res.data;
  },

  getPathwayById: async (id: string): Promise<LearningPathway> => {
    const res = await apiClient.get(`/pathway/${id}`);
    return res.data;
  },

  // Module Micro-Lessons & Quizzes
  getLesson: async (moduleId: string): Promise<{ module: PathwayModule; lesson: any }> => {
    const res = await apiClient.post(`/modules/${moduleId}/lesson`);
    return res.data;
  },

  getQuiz: async (moduleId: string): Promise<{ questions: QuizQuestion[]; moduleTitle: string; difficulty: string }> => {
    const res = await apiClient.get(`/modules/${moduleId}/quiz`);
    return res.data;
  },

  submitQuiz: async (
    moduleId: string,
    answers: Array<{ questionId: string; selectedIndex: number }>
  ): Promise<QuizSubmissionResponse> => {
    const res = await apiClient.post(`/modules/${moduleId}/submit-quiz`, {
      moduleId,
      answers,
    });
    return res.data;
  },

  // Contextual Copilot
  askCopilot: async (message: string, moduleId?: string, context?: string) => {
    const res = await apiClient.post('/copilot/chat', {
      message,
      moduleId,
      context,
    });
    return res.data;
  },

  // Analytics Overview
  getAnalytics: async (): Promise<AnalyticsOverview> => {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  },

  // Code Sandbox
  runCodeSandbox: async (code: string, language: string = 'javascript') => {
    const res = await apiClient.post('/sandbox/run', { code, language });
    return res.data;
  },

  // Skill Gap Analyzer
  analyzeSkillGap: async (targetRole?: string) => {
    const res = await apiClient.post('/skill-gap/analyze', { targetRole });
    return res.data;
  },

  // Certificate Generator
  generateCertificate: async () => {
    const res = await apiClient.get('/certificate/generate');
    return res.data;
  },

  // Settings & Gemini API key verify
  verifyGeminiKey: async (apiKey: string) => {
    const res = await apiClient.post('/settings/verify-key', { apiKey });
    return res.data;
  },
};
