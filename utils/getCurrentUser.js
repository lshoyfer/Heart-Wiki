import 'server-only';
import getSession from './getSession';
import { supabase } from './supabaseClient';

export default async function getCurrentUser() {
    const { user: userAuthData } = await getSession() ?? { user: null };
    if (userAuthData) {
        const { data: userPublicData, err } = await supabase
            .from('user')
            .select()
            .eq('auth_id', userAuthData.id);
        return { auth: userAuthData, user: userPublicData[0] };
    } else {
        return { auth: null, user: null };
    }
}