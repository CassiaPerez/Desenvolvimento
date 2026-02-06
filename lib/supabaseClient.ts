import { createClient } from '@supabase/supabase-js';

// Configuration injected based on user request for Bolt environment
const SUPABASE_URL = 'https://hlwimyrmiyocnnwpwanl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_L9e8tK2tk9blMKckf5lySg_mrASHmxg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);