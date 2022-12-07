import 'server-only';
import { supabase } from './supabaseClient';

export default async function getCurrentConvo(id) {
	const { data, err } = await supabase
		.from('convo')
		.select('*, creator:user(username)')
		.eq('id', id);

	return data[0];
}