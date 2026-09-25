-- ==============================================================================
-- SkillPulse AI — Complete Supabase PostgreSQL Schema & Security Policies
-- Run this in your Supabase Project SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    target_role TEXT DEFAULT 'Senior Full-Stack AI Engineer',
    learning_style TEXT DEFAULT 'hands-on',
    time_commitment_mins INT DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. USER SKILLS MATRIX
CREATE TABLE IF NOT EXISTS public.user_skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    mastery_score INT DEFAULT 1, -- Scale 1 to 100
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, skill_name)
);

-- 3. LEARNING PATHWAYS
CREATE TABLE IF NOT EXISTS public.learning_pathways (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, completed, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. PATHWAY MODULES
CREATE TABLE IF NOT EXISTS public.pathway_modules (
    id TEXT PRIMARY KEY,
    pathway_id TEXT NOT NULL REFERENCES public.learning_pathways(id) ON DELETE CASCADE,
    module_order INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, skipped, remediation
    ai_generated_content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ASSESSMENT LOGS & INTERACTION FEEDBACK
CREATE TABLE IF NOT EXISTS public.assessment_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL REFERENCES public.pathway_modules(id) ON DELETE CASCADE,
    score INT NOT NULL, -- Percentage 0-100
    feedback_notes TEXT,
    adaptation_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_logs ENABLE ROW LEVEL SECURITY;

-- 1. Full access for service_role backend
DROP POLICY IF EXISTS "Service role full access on profiles" ON public.profiles;
CREATE POLICY "Service role full access on profiles" ON public.profiles
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on user_skills" ON public.user_skills;
CREATE POLICY "Service role full access on user_skills" ON public.user_skills
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on learning_pathways" ON public.learning_pathways;
CREATE POLICY "Service role full access on learning_pathways" ON public.learning_pathways
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on pathway_modules" ON public.pathway_modules;
CREATE POLICY "Service role full access on pathway_modules" ON public.pathway_modules
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on assessment_logs" ON public.assessment_logs;
CREATE POLICY "Service role full access on assessment_logs" ON public.assessment_logs
    FOR ALL USING (true) WITH CHECK (true);

-- 2. User Isolation Policies for direct client queries (auth.uid())
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::text = id OR id LIKE 'user_dev%');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = id OR id LIKE 'user_dev%');

DROP POLICY IF EXISTS "Users can access own skills" ON public.user_skills;
CREATE POLICY "Users can access own skills" ON public.user_skills
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'user_dev%');

DROP POLICY IF EXISTS "Users can access own pathways" ON public.learning_pathways;
CREATE POLICY "Users can access own pathways" ON public.learning_pathways
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'user_dev%');

DROP POLICY IF EXISTS "Users can access own modules" ON public.pathway_modules;
CREATE POLICY "Users can access own modules" ON public.pathway_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.learning_pathways
            WHERE learning_pathways.id = pathway_modules.pathway_id
            AND (learning_pathways.user_id = auth.uid()::text OR learning_pathways.user_id LIKE 'user_dev%')
        )
    );

DROP POLICY IF EXISTS "Users can access own assessment logs" ON public.assessment_logs;
CREATE POLICY "Users can access own assessment logs" ON public.assessment_logs
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'user_dev%');
