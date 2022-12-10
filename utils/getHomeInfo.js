import 'server-only';
import { supabase } from './supabaseClient';

export default async function getHomeInfo() {
    const { data: categories } = await supabase
        .from('category')
        .select('name, id');

    const { data: analyses } = await supabase
        .from('analysis')
        .select('title, id');

    const { data: convos } = await supabase
        .from('convo')
        .select('title, id');

    return { categories, analyses, convos };
}