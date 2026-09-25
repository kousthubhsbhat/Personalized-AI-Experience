import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

async function seedSupabase() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  console.log('Seeding Supabase database:', url);
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const userId = 'user_dev_pulse_01';

  // 1. Seed Profile
  console.log('1. Inserting Profile...');
  const { error: pErr } = await supabase.from('profiles').upsert({
    id: userId,
    email: 'learner@skillpulse.ai',
    full_name: 'AI Learner',
    target_role: 'Senior Full-Stack AI Engineer',
    learning_style: 'hands-on',
    time_commitment_mins: 45
  });
  if (pErr) console.error('Profile err:', pErr);

  // 2. Seed User Skills
  console.log('2. Inserting Skills...');
  const skillsData = [
    { id: uuidv4(), user_id: userId, skill_name: 'React & TypeScript Architecture', mastery_score: 82 },
    { id: uuidv4(), user_id: userId, skill_name: 'Node.js & Express API Design', mastery_score: 74 },
    { id: uuidv4(), user_id: userId, skill_name: 'PostgreSQL & Database RLS', mastery_score: 68 },
    { id: uuidv4(), user_id: userId, skill_name: 'Google Gemini 2.5 Flash SDK', mastery_score: 88 },
    { id: uuidv4(), user_id: userId, skill_name: 'Distributed Cloud Systems', mastery_score: 60 }
  ];
  for (const s of skillsData) {
    const { error: sErr } = await supabase.from('user_skills').upsert(s, { onConflict: 'user_id,skill_name' });
    if (sErr) console.error('Skill err:', sErr);
  }

  // 3. Seed Learning Pathway
  console.log('3. Inserting Pathway...');
  const pathwayId = 'pathway_dev_01';
  const { error: pathErr } = await supabase.from('learning_pathways').upsert({
    id: pathwayId,
    user_id: userId,
    title: 'Senior Full-Stack AI Engineer Adaptive Track',
    domain: 'Full-Stack AI Engineering',
    status: 'active'
  });
  if (pathErr) console.error('Pathway err:', pathErr);

  // 4. Seed Modules
  console.log('4. Inserting Pathway Modules...');
  const modulesData: any[] = [
    {
      id: 'mod_101',
      pathway_id: pathwayId,
      module_order: 1,
      title: 'Modern Reactive State Machines & Optimistic UI',
      description: 'Fine-grained reactivity, normalized caches, and zero-latency client state synchronization.',
      difficulty: 'beginner',
      status: 'completed',
      ai_generated_content: {
        overview: 'Master client state machines and deterministic mutations for rich web applications.',
        reading_material: '### State Management Foundations\nState machines prevent impossible UI states by constraining transitions to explicit events.',
        key_takeaways: ['Never allow invalid state permutations', 'Debounce high-rate inputs'],
        estimated_mins: 15
      }
    },
    {
      id: 'mod_102',
      pathway_id: pathwayId,
      module_order: 2,
      title: 'High-Performance API Design & PostgreSQL RLS',
      description: 'Architect type-safe REST/GraphQL endpoints with granular Row-Level Security in Postgres.',
      difficulty: 'intermediate',
      status: 'in_progress',
      ai_generated_content: {
        overview: 'Build robust multitenant APIs with Postgres Row-Level Security.',
        reading_material: '### Row Level Security\nRLS filters query rows at the database engine level based on authenticated session claims.',
        key_takeaways: ['Always enable RLS on sensitive tables', 'Use service_role only in trusted servers'],
        estimated_mins: 20
      }
    },
    {
      id: 'mod_103',
      pathway_id: pathwayId,
      module_order: 3,
      title: 'Distributed Caching & Real-Time Event Streams',
      description: 'Implement Redis caching layers, WebSockets, and pub/sub message synchronization.',
      difficulty: 'intermediate',
      status: 'pending',
      ai_generated_content: null
    },
    {
      id: 'mod_104',
      pathway_id: pathwayId,
      module_order: 4,
      title: 'Edge Computing, Serverless Workflows & Gemini AI Orchestration',
      description: 'Deploy globally distributed edge functions with streaming AI inference and resilience.',
      difficulty: 'advanced',
      status: 'pending',
      ai_generated_content: null
    }
  ];

  for (const m of modulesData) {
    const { error: mErr } = await supabase.from('pathway_modules').upsert(m);
    if (mErr) console.error('Module err:', mErr);
  }

  // 5. Seed Assessment Logs
  console.log('5. Inserting Assessment Logs...');
  const logsData = [
    {
      id: uuidv4(),
      user_id: userId,
      module_id: 'mod_101',
      score: 95,
      feedback_notes: 'Demonstrated deep conceptual grasp of reactive state machines and optimistic UI.',
      adaptation_triggered: false
    },
    {
      id: uuidv4(),
      user_id: userId,
      module_id: 'mod_102',
      score: 55,
      feedback_notes: 'Diagnostic assessment indicated prerequisite gaps. Remediation module injected.',
      adaptation_triggered: true
    }
  ];

  for (const l of logsData) {
    const { error: lErr } = await supabase.from('assessment_logs').upsert(l);
    if (lErr) console.error('Log err:', lErr);
  }

  console.log('\n🎉 Successfully seeded all 5 Supabase tables!');
}

seedSupabase().catch(console.error);
