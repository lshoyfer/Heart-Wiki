import 'server-only';
import { supabase } from './supabaseClient';
export default async function getCategoryData(id) {
    return (await supabase
        .from('category')
        .select('*, creator:user (username)')
        .eq('id', id)).data[0];
}