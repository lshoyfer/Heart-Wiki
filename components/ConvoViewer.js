'use client';
import 'client-only';
import ConvoDisplay from './ConvoDisplay';
import ChatBox from './ChatBox';
import { useState, useRef } from 'react';
import styles from '../styles/Convo.module.css';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

export default function ConvoViewer({ msgs, userData, convo }) {
    const [msgArr, setMsgArr] = useState(msgs);
    const convoDisplayRef = useRef();
    const router = useRouter();

    const handleClientMsg = (msg, two) => {
        console.log('client', msg, two, msgArr);
        setMsgArr([...msgArr, msg]);
    }

    const handleServerMsg = async (payload) => {
        // i could've used sets but at this point it's less
        // work just checking here and fuck performance
        // it's fast enough

        // deep regret at not just using Postgres correctly
        // because having an arr of msgs makes fucking zero
        // sense and is a TERRIBLE headache. terrible.
        // i would rewrite it all from scratch but i 
        // am at my wits end already

        let isPayloadInClientAlready = false;
        for (let i = msgArr.length - 1; i >= 0; i--) {
            if (msgArr[i].id === payload.new.msgs.at(-1)) {
                isPayloadInClientAlready = true;
                break;
            }
        }

        if (!isPayloadInClientAlready) {
            const { data: newMsgData } = await supabase
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
                .eq('id', payload.new.msgs.at(-1));

            setMsgArr([...msgArr, newMsgData?.at(0)])
        };
    }


    try {
        convoDisplayRef.current.scrollTop = convoDisplayRef.current.scrollHeight;
    } catch { }

    return (
        <>
            <div ref={convoDisplayRef} className={styles.convoContainer}>
                <ConvoDisplay msgs={msgArr} />
                <div style={{ height: '100px' }} />
            </div>

            <ChatBox {...userData} msgs={msgArr} convo={convo} clientMsgHandler={handleClientMsg} serverMsgHandler={handleServerMsg} />
        </>
    )
}