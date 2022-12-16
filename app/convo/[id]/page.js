// 'use client'
// import 'client-only';
import 'server-only';
import { supabase } from '../../../utils/supabaseClient';
import getCurrentConvo from '../../../utils/getCurrentConvo';
import styles from '../../../styles/Convo.module.css';
import ConvoViewer from '../../../components/ConvoViewer';
import formatTimeStr from '../../../utils/formatTimeStr';
import getCurrentUser from '../../../utils/getCurrentUser';
import Link from 'next/link';

async function getMsgsContent(convoID) {
	return supabase
		.from('msg')
		.select(`
			*,
			user (
				username,
				profile_picture,
				id
			)
		`).order('created_at')
		.eq('convo', convoID);
}

export default async function ConvoPage({ params }) {
	const convo = await getCurrentConvo(params.id);
	const userData = await getCurrentUser();
	if (!convo?.id) return (<div>Convo doesn't exist.</div>);
	const { data: msgContents } = await getMsgsContent(convo.id);

	return (
		<>
			<div className={styles.infoBox}>
				<span>{convo.title}</span>
				{convo.description && <span>{convo.description}</span>}
				<div>
					<span>{convo.creator?.username ?? 'Public'}</span>
					<span>{formatTimeStr(convo.created_at)}</span>
				</div>
				{false && (console.log(convo.categories) ?? convo.categories) && // DISABLED
					<div>
						{convo.categories.map((name, index) =>
							(<span className={styles.category} key={index}>{name}</span>)
						)}
					</div>
				}
				{(convo.creator?.username === userData?.user?.username) &&
					<Link className={styles.edit} href={`/convo/${params.id}/edit`}>
						<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
							<path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z">
							</path>
						</svg>
					</Link>
				}
			</div>
			<ConvoViewer convo={convo} userData={userData} msgs={msgContents} />
		</>
	);
}