// Enhanced Supabase client configuration for email verification
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for better security and flexibility
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://oddfdtkpmgxpxdgieoqf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZGZkdGtwbWd4cHhkZ2llb3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODE0NDEsImV4cCI6MjA3MjY1NzQ0MX0.U7g2auvRkh73ksXiT9lK086hy5D44lfzGLIJorPAOaI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
  },
  global: {
    headers: {
      'X-Client-Info': 'edvise-pathways-ai'
    }
  }
});
