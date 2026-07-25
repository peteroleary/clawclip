import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (assuming running locally or via standard deployment)
dotenv.config({ path: '../.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase service role variables are missing. Ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set.');
}

// Initialize the Supabase Service Role client for backend operations
// This bypasses RLS, so only use it in secure server environments
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
