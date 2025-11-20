import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use placeholders for local dev
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYwNjg0MDAsImV4cCI6MTk2MTY0NDQwMH0.placeholder';

if (!supabaseUrl.includes('supabase')) {
  console.warn('⚠️ Using placeholder Supabase credentials. App will use local mock data.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
