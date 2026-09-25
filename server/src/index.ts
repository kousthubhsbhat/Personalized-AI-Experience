import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pathwayRoutes from './routes/pathwayRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import copilotRoutes from './routes/copilotRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import extraRoutes from './routes/extraRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillPulse AI Backend',
    model: 'gemini-2.5-flash',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', pathwayRoutes);
app.use('/api', moduleRoutes);
app.use('/api', copilotRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', extraRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`
  ======================================================
  ⚡ SkillPulse AI Engine Running on http://localhost:${PORT}
  🤖 Model: Google Gemini 2.5 Flash
  🛡️ Auth & Isolation: Supabase RLS / Dev Token Layer
  ======================================================
  `);
});
