'use client';
import 'client-only';
import Message from './Message';
import styles from '../styles/Convo.module.css';


export default function ConvoDisplay({ msgs }) {
    return (
        <>
            {msgs?.length ?
                msgs.map((msg) => (<Message key={msg.id} msg={msg} />))
                :
                <span className={styles.emptyErr}>No messages yet</span>
            }   
        </>
    );
}
