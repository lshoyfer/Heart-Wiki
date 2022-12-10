import { supabase } from './supabaseClient';
export default async function deleteMsg(msgID) {
    return supabase
        .from('msg')
        .delete()
        .eq('id', msgID);
}