'use client';
import 'client-only';
import ConvoDisplay from './ConvoDisplay';
import ChatBox from './ChatBox';
import { useState, useRef } from 'react';
import ConvoContext from '../utils/ConvoContext';
import styles from '../styles/Convo.module.css';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

export default function ConvoViewer({ msgs, userData, convo }) {
    const [msgArr, setMsgArr] = useState(msgs);
    const [isEditMode, setIsEditMode] = useState(false);
    const [msgBeingEdited, setMsgBeingEdited] = useState({});
    const convoDisplayRef = useRef();
    const router = useRouter();

    const handleClientMsgDelete = (index) => {
        // reallllly shoulda used a hashmap
        setMsgArr([
            ...msgArr.slice(0, index),
            ...msgArr.slice(index + 1)
        ]);
    }

    const toggleEditMode = (index) => {
        if (!isEditMode) {
            setIsEditMode(true);
            setMsgBeingEdited({
                index,
                data: msgArr?.at(index)
            });
        } else disableEditMode();
    }

    const disableEditMode = () => {
        setIsEditMode(false);
        setMsgBeingEdited({});
    }

    const handleClientMsg = (msg, mode) => {
        // console.log('client', msg, convo, msgArr);
        if (mode === 'INSERT') setMsgArr([...msgArr, msg]);
        else if (mode === 'UPDATE') {
            const msgArrCopy = [...msgArr];
            msgArrCopy[msgBeingEdited.index] = msg;
            setMsgArr(msgArrCopy);
        } else if (mode === 'DELETE') {
            // TODO
        }
    }

    const handleServerMsg = async (payload) => {
        if (payload.new.owner !== userData.user.id) {
            /*
                My hand is forced to do a follow up fetch
                for username & pfp unless I want to hard
                store this data on msg, which would
                be stupid. Also I am always returned
                every column's worth of data
                - https://github.com/supabase/supabase/discussions/7486
                - https://github.com/supabase/supabase/discussions/6059
            */
            if (payload.eventType === 'INSERT') {
                const { data: ownerData } = await supabase
                    .from('user')
                    .select('username, profile_picture')
                    .eq('id', payload.new.owner)
                delete payload.new.owner;
                payload.new.user = ownerData?.at(0);
                setMsgArr([...msgArr, payload.new]);
            } else if (payload.eventType === 'UPDATE') {
                // I dont feel like rewriting msgArr to be a hashmap
                let updatedMsgIndex = null; 
                for (let i = msgArr.length - 1; i >= 0; i--) {
                    if (msgArr[i].id === payload.new.id) {
                        updatedMsgIndex = i;
                        break;
                    }
                }
                const msgArrCopy = [...msgArr];
                delete payload.new.owner;
                payload.new.user = msgArr[updatedMsgIndex].user;
                msgArrCopy[updatedMsgIndex] = payload.new;
                setMsgArr(msgArrCopy);
            } else if (payload.eventType === 'DELETE') {
                let deletedMsgIndex = null;
                for (let i = msgArr.length - 1; i >= 0; i--) {
                    if (msgArr[i].id === payload.old.id) {
                        deletedMsgIndex = i;
                        break;
                    }
                }
                setMsgArr([
                    ...msgArr.slice(0, deletedMsgIndex),
                    ...msgArr.slice(deletedMsgIndex + 1)
                ]);
            }
        };
    }

    try {
        convoDisplayRef.current.scrollTop = convoDisplayRef.current.scrollHeight;
    } catch { }

    return (
        <ConvoContext.Provider
            value={{
                isEditMode,
                toggleEditMode,
                disableEditMode,
                msgBeingEdited,
                deleteMsgClient: handleClientMsgDelete,
                convo,
                ...userData
            }}
        >
            <div ref={convoDisplayRef} className={styles.convoContainer}>
                <ConvoDisplay msgs={msgArr} />
                <div style={{ height: '100px' }} />
            </div>

            <ChatBox clientMsgHandler={handleClientMsg} serverMsgHandler={handleServerMsg} />
        </ConvoContext.Provider>
    )
}