'use client';
import 'client-only';
import styles from '../styles/Convo.module.css';

export default function ChatBox() {
    return ( // TODO
        <>
            <textarea type='text' className={styles.chatBox} />
            <input type='file' accept='image/png, image/jpeg' className={styles.uploadBox} />
        </>
    );
}