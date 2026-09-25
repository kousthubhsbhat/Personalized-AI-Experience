import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // Default to standard demo user for rapid onboarding if no header in dev
      req.user = {
        id: 'user_dev_pulse_01',
        email: 'learner@skillpulse.ai',
        full_name: 'Learner'
      };
      return next();
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      res.status(401).json({ error: 'Missing authentication token.' });
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        res.status(401).json({ error: 'Invalid or expired Supabase authentication token.' });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email || 'user@skillpulse.ai',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner'
      };
      return next();
    }

    // Dev/Mock Auth fallback token decoder
    if (token.startsWith('demo-') || token.startsWith('user_') || token.length > 5) {
      const userId = token.startsWith('demo-') ? token : `user_${token.slice(0, 12)}`;
      req.user = {
        id: userId,
        email: `${userId}@skillpulse.ai`,
        full_name: 'Adaptive Learner'
      };
      return next();
    }

    req.user = {
      id: 'user_dev_pulse_01',
      email: 'learner@skillpulse.ai',
      full_name: 'AI Learner'
    };
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    res.status(500).json({ error: 'Internal authorization failure.' });
  }
};
