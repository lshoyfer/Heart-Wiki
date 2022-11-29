import 'server-only';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Message.module.css';
import Image from 'next/image';

async function getMsgData(id) {
    const { data, err } = await supabase
        .from('msg')
        .select(`
            id,
            created_at,
            content_html,
            user (
                username,
                profile_picture
            )
        `)
        .eq('id', id);

    // console.log(data);

    return data[0];
}

export default async function Message({ id }) {
    const msg = await getMsgData(id);
    // console.log('\n', msg, '\n');

    return (
        <div className={styles.messageContainer}>
            <Image
                src={msg.user.profile_picture} // TODO: no pic edge case
                width={32}
                height={32}
                alt={`${msg.user.username}'s profile picture.`}
            />
            <span className={styles.userName}>{msg.user.username}</span>
            <span dangerouslySetInnerHTML={{ __html: msg.content_html }} />
        </div>
    );
}