import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://likkqgzihhptkwmhnyng.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpa2txZ3ppaGhwdGt3bWhueW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MzAyNjIsImV4cCI6MjEwNTIwNjI2Mn0.nAQjRge6TQCb9lbyadp2J1ThWEGldFjJHZpAvKULNqk';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
// Automatically sanitize: remove '/rest/v1' or trailing slashes if accidentally pasted
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project')
  );
};

// Create a singleton Supabase client or null if not configured
let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Initialization error:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;
