'use client';
import 'client-only';
import styles from '../styles/Convo.module.css';
import { submit } from '../styles/Form.module.css';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { sanitize } from 'dompurify';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';

export default function ChatBox({ user, auth, convo, clientMsgHandler, serverMsgHandler, msgs }) {
    // convo IS AN ARCHIVED VERSION AT TIME OF LOAD THAT UNPREDICABLY UPDATES;
    // SO IT IS ONLY USED FOR RARELY CHANGING DATA i.e. NOT MSGS;
    // MY STUPIDITY AND SLUGGISHNESS IN REALIZING THIS HAS CAUSED TERRIBLE DAMAGE;
    const [contentMD, setContentMD] = useState('');
    const [contentHTML, setContentHTML] = useState('');
    const [uploadContent, setUploadContnet] = useState(null);
    const [err, setErr] = useState(false);
    const router = useRouter();
    const formRef = useRef();

    supabase
        .channel(`public:convo:id=eq.${convo.id}`)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'convo', filter: `id=eq.${convo.id}` },
            serverMsgHandler
        ).subscribe();

    const onPressEnter = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            formRef.current.requestSubmit();
        }
    }

    const handleMessagePOST = async (e) => {
        e.preventDefault();
        setContentMD(''); // testing out
        const { data: msgData } = await supabase
            .from('msg')
            .insert({
                owner: user.id,
                convo: convo.id,
                content_md: contentMD,
                content_html: contentHTML,
            })
            .select(`
                id,                    
                created_at,
                content_html,
                user (
                    username,
                    profile_picture
                )
            `);

        const { data: convoData } = await supabase
            .from('convo')
            .update({
                time_last_msg: msgData[0].created_at,
                num_msgs: convo.num_msgs + 1,
                msgs: convo.msgs?.length ? [...msgs.map((m) => m.id), msgData[0].id] : [msgData[0].id]
            })
            .eq('id', convo.id)
            .select();


        if (msgData && convoData) {
            clientMsgHandler(msgData[0], convoData[0]);
        } else {
            setErr(true);
        }
    }

    useEffect(() => {
        setContentHTML(sanitize(marked.parse(contentMD)));
        setErr(false);
    }, [contentMD]);

    const handleType = (e) => {
        setContentMD(e.target.value);
    }


    if (auth?.aud !== 'authenticated') return (
        console.log(auth) ??
        <div className={styles.msgErr}>
            You must be logged in to chat.
        </div>
    );

    return (
        <>
            <form onSubmit={handleMessagePOST} ref={formRef} id={styles.formContainer}>
                <textarea
                    type='text'
                    placeholder='Type message here' // not accessible, rip
                    value={contentMD}
                    className={styles.chatBox}
                    onChange={handleType}
                    onKeyDown={onPressEnter}
                />
            </form>
            <div className={styles.inputHandlers}>
                <label className={`${styles.uploadBox} ${submit}`} alt='upload image button'>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z">
                        </path>
                    </svg>
                    <input type='file' accept='image/png, image/jpeg' />
                </label>
                <button onClick={handleMessagePOST} className={submit}>Send</button>
            </div>
            {err &&
                <div className={styles.msgErr}>
                    Message failed to go through
                </div>
            }
        </>
    );
}