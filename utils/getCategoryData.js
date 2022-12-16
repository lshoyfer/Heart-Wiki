import 'server-only';
import { supabase } from './supabaseClient';
export default async function getCategoryData(id) {
    return (await supabase
        .from('category')
        .select('*, creator:user (username, id)')
        .eq('id', id)).data[0];
}