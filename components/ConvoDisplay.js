'use client';
import 'client-only';
import Message from './Message';
import styles from '../styles/Convo.module.css';

export default function ConvoDisplay({ msgs }) {
    return (
        <>
            {msgs?.length ?
                msgs.map((msg, index) => (<Message key={msg.id} index={index} msg={msg} />))
                :
                <span className={styles.emptyErr}>No messages yet</span>
            }
        </>
    );
}
