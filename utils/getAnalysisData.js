import 'server-only';
import { supabase } from './supabaseClient';

export default async function getAnalysisData(id) {
    const { data, error } = await supabase
        .from('analysis')
        .select('*, owner:user(username, id)')
        .eq('id', id);
    return data[0];
}