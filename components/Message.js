'use client';
import 'client-only';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Message.module.css';
import Image from 'next/image';

// async function getMsgData(id) {
//     const { data, err } = await supabase
//         .from('msg')
//         .select(`
//             id,
//             created_at,
//             content_html,
//             user (
//                 username,
//                 profile_picture
//             )
//         `)
//         .eq('id', id);

//     // console.log(data);

//     return data?.at(0);
// }

export default function Message({ msg }) {
    // const msg = await getMsgData(id);
    // console.log('\n', msg, '\n');

    return (
        <div className={styles.messageContainer}>
            <Image
                src={msg.user.profile_picture ?? 'https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/avatar/sb_test1.jpg' } // TODO: no pic edge case
                width={32}
                height={32}
                alt={`${msg.user.username}'s profile picture.`}
            />
            <span className={styles.userName}>{msg.user.username}</span>
            <span dangerouslySetInnerHTML={{ __html: msg.content_html }} />
        </div>
    );
}