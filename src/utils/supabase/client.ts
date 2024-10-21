import { getSecrets } from '@/api/getSecrets';
import { createBrowserClient } from '@supabase/ssr';

export const createClient = async () => {
  try {
    const secrets = await getSecrets()

    if (!secrets.data) {
      throw new Error('Failed to fetch secrets.')
    }
    
    const { supabaseAnonKey, supabaseUrl } = secrets.data

    if (!supabaseAnonKey ||  !supabaseUrl) {
      throw new Error('Supabase secrets are missing: Anon Key and/or URL not found.');
    }

    // Create and return the Supabase client
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw new Error('Failed to create Supabase client');
  }
};