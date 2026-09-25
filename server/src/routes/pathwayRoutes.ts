import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { OnboardingSchema } from '../validators.js';
import { generatePathwayAI } from '../services/aiService.js';
import { DBService } from '../services/dbService.js';

const router = Router();

// POST /api/onboarding/generate-path
router.post('/onboarding/generate-path', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = OnboardingSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.errors });
      return;
    }

    const { target_role, learning_style, time_commitment_mins, initial_skills } = parseResult.data;
    const userId = req.user?.id || 'user_dev_pulse_01';
    const email = req.user?.email || 'user@skillpulse.ai';
    const fullName = req.user?.full_name || 'Learner';

    // 1. Upsert Profile
    await DBService.upsertProfile({
      id: userId,
      email,
      full_name: fullName,
      target_role,
      learning_style,
      time_commitment_mins
    });

    // 2. Set Initial Skills Matrix
    await DBService.setUserSkills(userId, initial_skills);

    // 3. Generate AI Adaptive Pathway
    const aiPathway = await generatePathwayAI(target_role, learning_style, initial_skills);

    // 4. Save Pathway & Modules in Database
    const pathway = await DBService.createPathway(
      userId,
      aiPathway.title,
      aiPathway.domain,
      aiPathway.modules
    );

    res.status(201).json({
      message: 'Pathway successfully generated and calibrated by Gemini AI.',
      pathway
    });
  } catch (error: any) {
    console.error('[Onboarding Pathway Generation Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to generate pathway.' });
  }
});

// GET /api/pathway/user/current
router.get('/pathway/user/current', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user_dev_pulse_01';
    const [pathway, skills, profile] = await Promise.all([
      DBService.getLatestPathwayForUser(userId),
      DBService.getUserSkills(userId),
      DBService.getProfile(userId),
    ]);

    if (!pathway) {
      res.status(404).json({ error: 'No active learning pathway found for user. Please complete onboarding.' });
      return;
    }

    res.json({
      pathway,
      skills,
      profile: profile || {
        id: userId,
        email: req.user?.email || 'user@skillpulse.ai',
        full_name: req.user?.full_name || 'Learner',
        target_role: 'Senior Full-Stack AI Engineer',
        learning_style: 'hands-on',
        time_commitment_mins: 45
      }
    });
  } catch (error: any) {
    console.error('[Get Current Pathway Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch current pathway.' });
  }
});

// GET /api/pathway/:id
router.get('/pathway/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'user_dev_pulse_01';
    const pathway = await DBService.getPathway(id, userId);

    if (!pathway) {
      res.status(404).json({ error: 'Learning pathway not found.' });
      return;
    }

    res.json(pathway);
  } catch (error: any) {
    console.error('[Get Pathway By Id Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch pathway.' });
  }
});

export default router;
