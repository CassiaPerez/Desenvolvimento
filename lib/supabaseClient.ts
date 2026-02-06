import { createClient } from '@supabase/supabase-js';

// Configuration injected based on user request
const SUPABASE_URL = 'https://hlwimyrmiyocnnwpwanl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_L9e8tK2tk9blMKckf5lySg_mrASHmxg'; // Note: In a real Vite app, use import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);