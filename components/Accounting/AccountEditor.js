'use client';
import 'client-only'
import { useEffect, useReducer, useState } from 'react';
import styles from '../../styles/Account.module.css';
import * as borrowedLoginSignUpCSS from '../../styles/LoginSignup.module.css';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

const formReducer = (state, payload) => {
    switch (payload.type) {
        case 'USERNAME':
            return { ...state, username: payload.body };
        case 'NAME':
            return { ...state, name: payload.body };
        case 'LOCATION':
            return { ...state, location: payload.body };
        case 'DISCORD':
            return { ...state, discord: payload.body };
        default:
            console.err('INTERNAL ERROR: @account/settings/edit reducer')
            return { ...state };

    }
}


export default function AccountEditor({
    username,
    name,
    location,
    discord,
    id
}) {
    const [state, d] = useReducer(formReducer, {
        username, name, location, discord
    }); // d for dispatch
    const [err, setErr] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setErr(false);
    }, [state])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, err } = await supabase
            .from('user')
            .update(state)
            .eq('id', id)
            .select();

        if (data) {
            router.push('/account')
            router.refresh();
        } else setErr(true);
    }

    return (
        <div className={styles.container}>
            <div style={{ marginTop: 0, marginBottom: '20px', fontSize: '25px' }} className={styles.container}>
                Account Information
            </div>
            <form
                onSubmit={handleSubmit}
                className={`${borrowedLoginSignUpCSS.container} ${borrowedLoginSignUpCSS.loginForm}`}
                style={{ marginTop: 0 }}
            >
                <div>
                    <span>Username</span>
                    <input
                        onChange={(e) => { d({ type: 'USERNAME', body: e.target.value }) }}
                        value={state.username}
                        type='text'
                    />
                </div>
                <div>
                    <span>Name</span>
                    <input
                        onChange={(e) => { d({ type: 'NAME', body: e.target.value }) }}
                        value={state.name}
                        type='text'
                    />
                </div>
                <div>
                    <span>Location</span>
                    <input
                        onChange={(e) => { d({ type: 'LOCATION', body: e.target.value }) }}
                        value={state.location}
                        type='text'
                    />
                </div>
                <div>
                    <span>Discord</span>
                    <input
                        onChange={(e) => { d({ type: 'DISCORD', body: e.target.value }) }}
                        value={state.discord}
                        type='text'
                    />
                </div>
                {err &&
                    <div className={`${styles.container} ${styles.red}`}>
                        Error Processing. Try again
                    </div>
                }
                <button className={borrowedLoginSignUpCSS.button}>Change</button>
                {/* {err && <span style={{ color: 'red' }}>Invalid Input</span>} */}
            </form>
        </div>
    );
}