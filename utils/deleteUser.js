// import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// USES SERVICE ROLE. KEEP ON SERVER. ADMIN ONLY.
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const supabaseAdmin = createClient(supabaseURL, supabaseServiceRole);
// console.log('\ninCLIENTAREA\n', supabaseServiceRole);

export default async function deleteUser({ pubID, authID }) {

    const { publicErr } = await supabase
        .from('user')
        .delete()
        .eq('id', pubID);

    const { data, authErr } = await supabaseAdmin.auth.admin.deleteUser(
        authID
    );

    // console.log('delete sucessful', data);
}