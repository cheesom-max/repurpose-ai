import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

  const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`;

  if (import.meta.env.PROD) {
    throw new Error(errorMsg);
  } else {
    console.error(`[Supabase] ${errorMsg}`);
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
