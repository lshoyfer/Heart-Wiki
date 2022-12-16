'use client';
import 'client-only';
import styles from '../styles/Convo.module.css';
import { submit } from '../styles/Form.module.css';
import { useRef, useState, useEffect, useContext } from 'react';
import ConvoContext from '../utils/ConvoContext';
import { supabase } from '../utils/supabaseClient';
import { sanitize } from 'dompurify';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import uuid4 from 'uuid4';

export default function ChatBox({
    clientMsgHandler,
    serverMsgHandler,
    handleUploadContent,
    uploadContent,
    flushXUploadState
}) {
    const {
        user,
        auth,
        convo,
        isEditMode,
        disableEditMode,
        msgBeingEdited
    } = useContext(ConvoContext);
    const [contentMD, setContentMD] = useState('');
    const [contentHTML, setContentHTML] = useState('');
    const [err, setErr] = useState(false);
    const router = useRouter();
    const formRef = useRef();
    const textareaRef = useRef();

    // this could be in <ConvoViewer /> but it doesn't
    // really matter & it makes the props look cute
    supabase
        .channel(`public:msg:convo=eq.${convo.id}`)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'msg', filter: `convo=eq.${convo.id}` },
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
        if ((!contentMD) && (!uploadContent.length)) return;
        setContentMD('');
        flushXUploadState({ all: true });

        const uploadDataArr = await Promise.all(uploadContent.map(async (path) => {
            const { data } = await supabase
                .from('msg')
                .insert({
                    owner: user.id,
                    convo: convo.id,
                    is_upload: true,
                    content_md: `https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/image/${path}`,
                    content_html: sanitize(marked.parse('https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/image/')) // this doesn't too anything but im keeping it for the db to be consistent since I left it
                })
                .select(`
                    *,
                    user (
                        username,
                        profile_picture,
                        id
                    )
            `);
            return data[0];
        }));

        let msgData = null;
        if (contentMD) {
            ({ data: msgData } = await supabase
                .from('msg')
                .insert({
                    owner: user.id,
                    convo: convo.id,
                    content_md: contentMD,
                    content_html: contentHTML
                })
                .select(`
                    *,
                    user (
                        username,
                        profile_picture,
                        id
                    )
            `));
        }

        const { data: convoData } = await supabase
            .from('convo')
            .update({
                time_last_interaction: msgData?.at(0).created_at ?? uploadDataArr.at(-1).created_at,
                num_msgs: convo.num_msgs + uploadDataArr.length + (msgData && 1)
            })
            .eq('id', convo.id)
            .select();


        // console.log(uploadDataArr);
        if ((convoData) && (msgData || uploadDataArr.length)) {
            clientMsgHandler(uploadDataArr, msgData?.at(0), 'INSERT');
        } else {
            setErr(true);
        }
    }

    const handleMessagePATCH = async (e) => {
        e.preventDefault();
        setContentMD('');
        disableEditMode();

        const { data: msgData } = await supabase
            .from('msg')
            .update({
                content_md: contentMD,
                content_html: contentHTML,
                last_edited_at: new Date().toISOString()
            })
            .eq('id', msgBeingEdited.data.id)
            .select(`
                *,
                user (
                    username,
                    profile_picture,
                    id
                )
            `);

        const { data: convoData } = await supabase
            .from('convo')
            .update({
                time_last_interaction: msgData[0].created_at
            })
            .eq('id', convo.id)
            .select();


        if (msgData && convoData) {
            clientMsgHandler(null, msgData[0], 'UPDATE'); // TODO

        } else {
            setErr(true);
        }
    }
    const handleFileUpload = async (e) => {
        const content = await Promise.all(Object.values(e.target.files).map(async (file) => {
            const { data } = await supabase
                .storage
                .from('image')
                .upload(`public/${uuid4()}_${file.name}`, file)
            return data.path
        }));
        handleUploadContent(content);
    }

    const handleType = (e) => {
        setContentMD(e.target.value);
    }


    useEffect(() => {
        setContentHTML(sanitize(marked.parse(contentMD)));
        setErr(false);
    }, [contentMD]);

    useEffect(() => {
        setContentMD(msgBeingEdited.data?.content_md ?? '');
        isEditMode && textareaRef.current.focus();
    }, [isEditMode, msgBeingEdited]);

    if (auth?.aud !== 'authenticated') return (
        <div className={styles.msgErr}>
            You must be logged in to chat.
        </div>
    );

    return (
        <>
            {!!uploadContent.length &&
                <div className={styles.imgPreviewContainer}>
                    {uploadContent.map((path, i) => (
                        <Image
                            key={i}
                            src={`https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/image/${path}`}
                            alt={`Image preview ${i + 1}`}
                            width={500}
                            height={500}
                            className={styles.img}
                            onClick={() => flushXUploadState({ index: i })}
                        />
                    ))}
                </div>
            }
            <form onSubmit={isEditMode ? handleMessagePATCH : handleMessagePOST} ref={formRef} id={styles.formContainer}>
                <textarea
                    type='text'
                    placeholder='Type message here' // not accessible, rip
                    value={contentMD}
                    className={`${styles.chatBox} ${isEditMode ? styles.chatBoxEditMode : ''}`}
                    onChange={handleType}
                    onKeyDown={onPressEnter}
                    ref={textareaRef}
                />
            </form>
            <div className={styles.inputHandlers}>
                <label className={`${styles.uploadBox} ${submit}`} alt='upload image button'>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z">
                        </path>
                    </svg>
                    <input
                        type='file'
                        accept='image/png, image/jpeg'
                        multiple
                        onChange={handleFileUpload}
                    />
                </label>
                <button
                    onClick={isEditMode ? handleMessagePATCH : handleMessagePOST}
                    className={submit}
                >
                    {isEditMode ? 'Confirm' : 'Send'}
                </button>
            </div>
            {err &&
                <div className={styles.msgErr}>
                    Message failed to go through
                </div>
            }
        </>
    );
}