'use client';
import 'client-only';
import ConvoContext from '../utils/ConvoContext';
import deleteMsg from '../utils/deleteMsg';
import { useContext, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Message.module.css';
import Image from 'next/image';

export default function Message({ msg, index }) {
    const {
        msgBeingEdited,
        isEditMode,
        toggleEditMode,
        deleteMsgClient,
        convo,
        user } = useContext(ConvoContext);

    return (
        <div className={`${styles.messageContainer} ${isEditMode && (msgBeingEdited.data.id === msg.id) && styles.editingBorder}`}>
            <div className={styles.info}>
                <Image
                    src={msg.user.profile_picture ?? 'https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/avatar/sb_test1.jpg'} // TODO: no pic edge case
                    width={32}
                    height={32}
                    alt={`${msg.user.username}'s profile picture.`}
                />
                <span className={styles.username}>{msg.user.username}</span>
                {
                    (((convo.creator !== null) && (convo.creator === user?.id)) || (msg.user.id === user?.id)) &&
                    <>
                        <button
                            className={styles.editDelete}
                            onClick={() => toggleEditMode(index)}
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z">
                                </path>
                            </svg>
                        </button>
                        <button
                            className={styles.editDelete}
                            onClick={async () => {
                                deleteMsgClient(index);
                                await deleteMsg(msg.id);
                            }}
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 12 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z">
                                </path>
                            </svg>
                        </button>
                    </>
                }
            </div>
            <span className={styles.content} dangerouslySetInnerHTML={{ __html: msg.content_html }} />
        </div>
    );
}