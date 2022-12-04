'use client';
import 'client-only';
import { useLayoutEffect, useState } from 'react';
import styles from '../../styles/Account.module.css';
import * as borrowedLoginSignUpCSS from '../../styles/LoginSignup.module.css';
import { sanitize } from 'dompurify';
import { marked } from 'marked';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';


export default function AboutEditor({ aboutMD, aboutHTML, id }) {
    const [md, setMD] = useState(aboutMD);
    const [html, setHTML] = useState(aboutHTML);
    const [err, setErr] = useState(false);
    const router = useRouter();

    useLayoutEffect(() => {
        const newHTML = sanitize(marked.parse(md));
        setHTML(newHTML);
    }, [md]);


    const handleEdit = (e) => {
        setMD(e.target.value);
        err && setErr(false);
    }

    const handleConfirm = async () => {
        const { data, err } = await supabase
            .from('user')
            .update({
                about_md: md,
                about_html: html
            })
            .eq('id', id)
            .select();

        if (data) {
            router.push('/account')
            router.refresh();
        } else setErr(true);
    }

    return (
        <div className={styles.container}>
            <div style={{ fontSize: '25px' }} className={styles.container}>
                About Editor
            </div>
            <div id={styles.split}>
                <textarea
                    value={md}
                    className={styles.container}
                    onChange={handleEdit}
                />
                <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className={styles.container}
                />
            </div>
            {err &&
                <div className={`${styles.container} ${styles.red}`}>
                    Error Processing. Try again
                </div>
            }
            <button
                className={borrowedLoginSignUpCSS.button}
                onClick={handleConfirm}
            >
                Confirm
            </button>
        </div>
    );
}