import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { CopilotMessageSchema } from '../validators.js';
import { generateCopilotResponseAI } from '../services/aiService.js';
import { DBService } from '../services/dbService.js';

const router = Router();

// POST /api/copilot/chat
router.post('/copilot/chat', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = CopilotMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.errors });
      return;
    }

    const { message, moduleId, context: extraContext } = parseResult.data;
    const userId = req.user?.id || 'user_dev_pulse_01';

    let moduleTitle = 'General Learning Track';
    let difficulty = 'Intermediate';

    if (moduleId) {
      const moduleData = await DBService.getModuleById(moduleId);
      if (moduleData) {
        moduleTitle = moduleData.title;
        difficulty = moduleData.difficulty;
      }
    }

    const profile = await DBService.getProfile(userId);
    const targetRole = profile?.target_role || 'Full-Stack Software Engineer';

    const aiResponse = await generateCopilotResponseAI(message, {
      moduleTitle,
      difficulty,
      targetRole,
      userCodeSnippet: extraContext
    });

    res.json({
      reply: aiResponse,
      timestamp: new Date().toISOString(),
      contextUsed: {
        moduleTitle,
        difficulty,
        targetRole
      }
    });
  } catch (error: any) {
    console.error('[Copilot Chat Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI copilot query.' });
  }
});

export default router;
