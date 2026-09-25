import { z } from 'zod';

export const OnboardingSchema = z.object({
  target_role: z.string().min(2, "Target role is required"),
  learning_style: z.enum(['hands-on', 'visual', 'theoretical']),
  time_commitment_mins: z.number().min(15).max(180),
  initial_skills: z.record(z.string(), z.number().min(1).max(5))
});

export const QuizSubmissionSchema = z.object({
  moduleId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedIndex: z.number().min(0).max(3)
  }))
});

export const CopilotMessageSchema = z.object({
  moduleId: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  context: z.string().optional()
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type QuizSubmissionInput = z.infer<typeof QuizSubmissionSchema>;
export type CopilotMessageInput = z.infer<typeof CopilotMessageSchema>;

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  target_role: string;
  learning_style: 'hands-on' | 'visual' | 'theoretical';
  time_commitment_mins: number;
  created_at: string;
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
  created_at: string;
}

export interface LearningPathway {
  id: string;
  user_id: string;
  title: string;
  domain: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  modules?: PathwayModule[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentLog {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  feedback_notes: string;
  adaptation_triggered: boolean;
  created_at: string;
}
