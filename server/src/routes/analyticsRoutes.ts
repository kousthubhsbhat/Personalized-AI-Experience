import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { DBService } from '../services/dbService.js';

const router = Router();

// GET /api/analytics/overview
router.get('/analytics/overview', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user_dev_pulse_01';

    const [profile, skills, pathway, logs] = await Promise.all([
      DBService.getProfile(userId),
      DBService.getUserSkills(userId),
      DBService.getLatestPathwayForUser(userId),
      DBService.getAssessmentLogs(userId)
    ]);

    const totalModules = pathway?.modules?.length || 4;
    const completedModules = pathway?.modules?.filter(m => m.status === 'completed').length || 0;
    const inProgressModules = pathway?.modules?.filter(m => m.status === 'in_progress').length || 0;
    const remediationCount = pathway?.modules?.filter(m => m.status === 'remediation' || m.title.includes('Remediation')).length || 0;

    const avgMastery = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.mastery_score, 0) / skills.length)
      : 65;

    const avgAssessmentScore = logs.length > 0
      ? Math.round(logs.reduce((acc, l) => acc + l.score, 0) / logs.length)
      : 84;

    // Adaptive velocity calculation
    const velocityFactor = avgAssessmentScore > 85 ? 1.35 : avgAssessmentScore >= 60 ? 1.05 : 0.85;

    const radarSkills = skills.map(s => ({
      skill: s.skill_name,
      current: s.mastery_score,
      target: 95,
      fullMark: 100
    }));

    res.json({
      profile: profile || {
        full_name: 'Alex Chen',
        target_role: 'Senior Full-Stack AI Engineer',
        time_commitment_mins: 30,
        learning_style: 'hands-on'
      },
      stats: {
        avgMastery,
        completedModules,
        totalModules,
        inProgressModules,
        remediationCount,
        avgAssessmentScore,
        velocityMultiplier: `${velocityFactor.toFixed(2)}x`,
        hoursInvested: Math.round(completedModules * 1.5 + (inProgressModules * 0.8)),
        learningStreakDays: 5
      },
      skills: radarSkills,
      recentLogs: logs.slice(0, 10),
      aiRecommendations: [
        avgMastery < 70
          ? 'Focus on interactive code drills to reinforce foundational syntax and data flows.'
          : 'Accelerate to distributed architecture and agentic workflow orchestration.',
        remediationCount > 0
          ? 'Prioritize newly generated remediation exercises before taking high-difficulty milestones.'
          : 'Consistent mastery trajectory detected. Ready for advanced capstone validation.'
      ]
    });
  } catch (error: any) {
    console.error('[Get Analytics Overview Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch analytics.' });
  }
});

export default router;
