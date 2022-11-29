import 'server-only';
import { cookies } from 'next/headers';
import { supabase } from '../utils/supabaseClient';

// As advertised, NextJS does dedupe these so I'm spamming this
// in everything serverside.
export default async function getSession() {
    const nextCookies = cookies();
    const refreshToken = nextCookies.get('my-refresh-token');
    const accessToken = nextCookies.get('my-access-token');

    let data, err;
    if (accessToken && refreshToken) {
        ({ data, err } = await supabase.auth.setSession({
            refresh_token: refreshToken.value,
            access_token: accessToken.value
        }));
    } else {
        console.log('NOT AUTHENTICATED')
    }

    return data;
}