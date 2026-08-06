import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const url =
    metaEnv.VITE_SUPABASE_URL ||
    (typeof window !== 'undefined' && localStorage.getItem('VITE_SUPABASE_URL')) ||
    (typeof window !== 'undefined' && localStorage.getItem('supabase_url')) ||
    (typeof window !== 'undefined' && localStorage.getItem('SUPABASE_URL')) ||
    (typeof window !== 'undefined' && (window as any).__SUPABASE_URL__);

  const key =
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    (typeof window !== 'undefined' && localStorage.getItem('VITE_SUPABASE_ANON_KEY')) ||
    (typeof window !== 'undefined' && localStorage.getItem('supabase_anon_key')) ||
    (typeof window !== 'undefined' && localStorage.getItem('SUPABASE_ANON_KEY')) ||
    (typeof window !== 'undefined' && (window as any).__SUPABASE_ANON_KEY__);

  return {
    url: url ? String(url).trim() : '',
    key: key ? String(key).trim() : ''
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(
    url &&
    key &&
    url !== 'https://your-supabase-project.supabase.co' &&
    key !== 'your-supabase-anon-key' &&
    url.startsWith('http') &&
    key.length > 20
  );
};

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!cachedClient || cachedUrl !== url || cachedKey !== key) {
    cachedUrl = url;
    cachedKey = key;
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedClient;
};

export const supabase = getSupabaseClient();
