import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { QuizSubmissionSchema } from '../validators.js';
import {
  generateMicroLessonAI,
  generateAdaptiveQuizAI,
  generateRemediationModuleAI
} from '../services/aiService.js';
import { DBService } from '../services/dbService.js';

const router = Router();

// Store generated quizzes in-memory for server-side score verification
const activeQuizCache = new Map<string, any[]>();

// POST /api/modules/:id/lesson
router.post('/modules/:id/lesson', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'user_dev_pulse_01';

    const moduleData = await DBService.getModuleById(id);
    if (!moduleData) {
      res.status(404).json({ error: 'Pathway module not found.' });
      return;
    }

    // Return cached AI content if already generated
    if (moduleData.ai_generated_content) {
      res.json({
        module: moduleData,
        lesson: moduleData.ai_generated_content
      });
      return;
    }

    const profile = await DBService.getProfile(userId);
    const targetRole = profile?.target_role || 'Full-Stack Software Engineer';
    const learningStyle = profile?.learning_style || 'hands-on';

    // Generate dynamic micro-lesson content with Gemini AI
    const lessonContent = await generateMicroLessonAI(
      moduleData.title,
      moduleData.difficulty,
      targetRole,
      learningStyle
    );

    // Save to database
    const updatedModule = await DBService.updateModule(id, {
      ai_generated_content: lessonContent,
      status: moduleData.status === 'pending' ? 'in_progress' : moduleData.status
    });

    res.json({
      module: updatedModule,
      lesson: lessonContent
    });
  } catch (error: any) {
    console.error('[Generate Micro-Lesson Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to generate micro-lesson.' });
  }
});

// GET or POST /api/modules/:id/quiz
const handleGetQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const moduleData = await DBService.getModuleById(id);
    if (!moduleData) {
      res.status(404).json({ error: 'Pathway module not found.' });
      return;
    }

    // Generate 3-question adaptive quiz via Gemini AI
    const quizData = await generateAdaptiveQuizAI(moduleData.title, moduleData.difficulty);

    // Cache quiz answers server-side for secure evaluation
    activeQuizCache.set(id, quizData.questions);

    // Provide questions to client
    res.json({
      moduleId: id,
      moduleTitle: moduleData.title,
      difficulty: moduleData.difficulty,
      questions: quizData.questions
    });
  } catch (error: any) {
    console.error('[Generate Adaptive Quiz Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to generate adaptive quiz.' });
  }
};

router.get('/modules/:id/quiz', authMiddleware, handleGetQuiz);
router.post('/modules/:id/quiz', authMiddleware, handleGetQuiz);

// POST /api/modules/:id/submit-quiz
router.post('/modules/:id/submit-quiz', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'user_dev_pulse_01';

    const parseResult = QuizSubmissionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid quiz submission format', details: parseResult.error.errors });
      return;
    }

    const { answers } = parseResult.data;
    const moduleData = await DBService.getModuleById(id);
    if (!moduleData) {
      res.status(404).json({ error: 'Pathway module not found.' });
      return;
    }

    let cachedQuestions = activeQuizCache.get(id);
    if (!cachedQuestions || cachedQuestions.length === 0) {
      // Regenerate / get questions
      const generated = await generateAdaptiveQuizAI(moduleData.title, moduleData.difficulty);
      cachedQuestions = generated.questions;
    }

    // Calculate score
    let correctCount = 0;
    const results = cachedQuestions.map((q, idx) => {
      const userAns = answers.find(a => a.questionId === q.id) || answers[idx];
      const isCorrect = userAns ? userAns.selectedIndex === q.correctIndex : false;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        question: q.question,
        selectedIndex: userAns?.selectedIndex ?? -1,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = cachedQuestions.length || 3;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    let feedbackNotes = '';
    let adaptationTriggered = false;
    let remediationModule = null;

    const profile = await DBService.getProfile(userId);
    const targetRole = profile?.target_role || 'Full-Stack Engineer';

    // Apply Advisory Rules
    if (scorePercentage < 60) {
      // RULE 1: Score < 60% -> Inject remediation micro-module before advancing
      adaptationTriggered = true;
      feedbackNotes = `Diagnostic assessment indicates foundational gaps (${scorePercentage}%). Automatically injecting a targeted remediation drill to reinforce core mechanisms before progression.`;

      const remediationData = await generateRemediationModuleAI(
        moduleData.title,
        targetRole,
        ['Core Mechanics & Syntax Invariants', 'Idempotency & State Invariants']
      );

      remediationModule = await DBService.injectRemediationModule(
        moduleData.pathway_id,
        moduleData.module_order,
        remediationData
      );

      await DBService.updateModule(id, { status: 'remediation' });
      await DBService.updateSkillMastery(userId, moduleData.title, -4);
    } else if (scorePercentage > 90) {
      // RULE 2: Score > 90% -> Skip basic prerequisite modules and increase difficulty level
      adaptationTriggered = true;
      feedbackNotes = `Exceptional mastery demonstrated (${scorePercentage}%). Fast-tracking curriculum velocity and accelerating upcoming module complexity to Advanced.`;

      await DBService.updateModule(id, { status: 'completed' });
      await DBService.fastTrackPathway(moduleData.pathway_id, moduleData.module_order);
      await DBService.updateSkillMastery(userId, moduleData.title, 15);
    } else {
      // Standard progression (60% <= Score <= 90%)
      adaptationTriggered = false;
      feedbackNotes = `Solid comprehension demonstrated (${scorePercentage}%). Module verified and advanced to the next milestone.`;

      await DBService.updateModule(id, { status: 'completed' });
      await DBService.updateSkillMastery(userId, moduleData.title, 8);
    }

    // Record Assessment Log
    const assessmentLog = await DBService.recordAssessmentLog(
      userId,
      id,
      scorePercentage,
      feedbackNotes,
      adaptationTriggered
    );

    const updatedPathway = await DBService.getPathway(moduleData.pathway_id, userId);
    const updatedSkills = await DBService.getUserSkills(userId);

    res.json({
      score: scorePercentage,
      passed: scorePercentage >= 60,
      correctCount,
      totalQuestions,
      results,
      feedbackNotes,
      adaptationTriggered,
      remediationModule,
      assessmentLog,
      pathway: updatedPathway,
      skills: updatedSkills
    });
  } catch (error: any) {
    console.error('[Submit Quiz Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to process quiz submission.' });
  }
});

// PATCH /api/modules/:id/status
router.patch('/modules/:id/status', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'completed', 'skipped', 'remediation'].includes(status)) {
      res.status(400).json({ error: 'Invalid module status value.' });
      return;
    }

    const updated = await DBService.updateModule(id, { status });
    if (!updated) {
      res.status(404).json({ error: 'Pathway module not found.' });
      return;
    }

    res.json(updated);
  } catch (error: any) {
    console.error('[Update Module Status Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to update module status.' });
  }
});

export default router;
