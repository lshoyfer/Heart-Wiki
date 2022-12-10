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
	const { data: msgContents } = await getMsgsContent(convo.id);
	// console.log('got data', msgContents.data, convo.id);
	// console.log('here', convo);
	return (
		<>
			<div className={styles.infoBox}>
				<span>{convo.title}</span>
				{convo.description && <span>{convo.description}</span>}
				<div>
					<span>{convo.creator?.username ?? 'Public'}</span>
					<span>{formatTimeStr(convo.created_at)}</span>
				</div>
				{convo.categories &&
					<div>
						{convo.categories.map((name, index) =>
							(<span className={styles.category} key={index}>{name}</span>)
						)}
					</div>
				}
				{(convo.creator?.username === userData?.user?.username) &&
					<Link className={styles.edit} href={`/convo/${params.id}/edit`}>Edit</Link>
				}
			</div>
			<ConvoViewer convo={convo} userData={userData} msgs={msgContents} />
		</>
	);
}