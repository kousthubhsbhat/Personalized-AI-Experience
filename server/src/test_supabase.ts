import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

async function testSupabase() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  console.log('Testing Supabase URL:', url);
  console.log('Testing Key (starts with):', key.slice(0, 15) + '...');

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const tables = ['profiles', 'user_skills', 'learning_pathways', 'pathway_modules', 'assessment_logs'];
  for (const t of tables) {
    const res = await supabase.from(t).select('*').limit(1);
    if (res.error) {
      console.log(`❌ Table [${t}]: ${res.error.message} (Code: ${res.error.code})`);
    } else {
      console.log(`✅ Table [${t}]: Accessible! Count: ${res.data.length}`);
    }
  }

  // Test inserting into profiles
  console.log('\nTesting writing a record to profiles:');
  const testId = 'test_user_001';
  const insertRes = await supabase.from('profiles').upsert({
    id: testId,
    email: 'test@skillpulse.ai',
    full_name: 'Test User',
    target_role: 'Full-Stack Developer'
  });

  if (insertRes.error) {
    console.log('❌ Insert Error:', insertRes.error.message, '| Hint:', insertRes.error.hint, '| Details:', insertRes.error.details);
  } else {
    console.log('✅ Upsert succeeded!');
  }
}

testSupabase().catch(console.error);
