import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceRoleKey &&
  !supabaseUrl.includes('your-supabase') &&
  !supabaseUrl.includes('mock-supabase')
);

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('[Supabase Config] Successfully connected to live Supabase Cloud instance.');
  } catch (error) {
    console.warn('[Supabase Config Warning] Could not initialize Supabase client:', error);
  }
} else {
  console.log('[Supabase Config] Running in Hybrid Memory-Isolated Store Mode for rapid local development.');
}

export const supabase = supabaseClient;
