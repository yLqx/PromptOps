import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase client for when you're ready to use Supabase features
// This is separate from the database connection which uses standard PostgreSQL
export const supabase = createClient(
  process.env.SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_ANON_KEY || 'dummy-key'
);

// Service role client for admin operations (when needed)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key'
);

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}
