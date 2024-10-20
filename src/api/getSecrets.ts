'use server'

import { type ApiResponse } from '@/types/Api';
import { getSecret } from '@/lib/getSecret';

export const getSecrets = async (): Promise<ApiResponse<{ supabaseUrl: string; supabaseAnonKey: string } | null>> => {
    try {
        // Fetch secrets using getSecret
        const supabaseUrl = await getSecret('SUPABASE_URL');
        const supabaseAnonKey = await getSecret('SUPABASE_ANON_KEY');

        return { errorMessage: null, data: { supabaseUrl, supabaseAnonKey } };
    } catch (error) {
        console.error('Error fetching secrets:', error);
        return { errorMessage: 'Error fetching secrets', data: null };
    }
};
