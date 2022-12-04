'use client';
import 'client-only';
import { useState, cache, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../../styles/LoginSignup.module.css';

// use nextjs router reload

const cachedLoginSignupSB = cache(async (isSignup, credentials, username) => {
    // console.log('in cache', isSignup, credsObj);
    if (isSignup) {
        const { data, signUpError } = await supabase.auth.signUp(credentials);
        const { insertError } = await supabase
            .from('user')
            .insert({
                username,
                auth_id: data.user.id
            });
        return { data, signUpError };
    } else {
        return supabase.auth.signInWithPassword(credentials);
    }
    // return isSignup
    //     ? supabase.auth.signUp(credsObj)
    //     : supabase.auth.signInWithPassword(credsObj);
});

supabase.auth.onAuthStateChange((e, session) => {
    if (e === 'SIGNED_OUT' || e === 'USER_DELETED') {
        const expires = new Date(0).toUTCString();
        document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    } else if (e === 'SIGNED_IN' || e === 'TOKEN_REFRESHED') {
        const maxAge = 100 * 365 * 24 * 60 * 60;
        document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    }
});

export default function SignInUpOut({ isSignOut }) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignupPage, setIsSignupPage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            (async () => {
                const { data, err } = await cachedLoginSignupSB(isSignupPage, { email, password }, username);
                if (err) setErr(true);
                else {
                    console.log('DATA OBJ', isSignupPage, data);
                    setLoading(false);
                    setEmail('');
                    setPassword('')
                    router.refresh();
                }
            })();
        }
    }, [loading, email, password, username, isSignupPage, router]);


    if (isSignOut) {
        return (
            <button
                onClick={async () => { await supabase.auth.signOut(); router.refresh() }}
                className={styles.button}
            >
                Sign Out
            </button>
        );
    }

    const handleSignXNavigation = () => {
        setIsSignupPage(!isSignupPage);
        setErr(false);
    }

    const handleLoginSignup = (e) => {
        e.preventDefault(); // or actually let browser reload, prolly nextjs inte is better

        setLoading(true);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    return (
        <>
            <div>{isSignupPage ? 'Sign Up' : 'Sign In'}</div>
            <form onSubmit={handleLoginSignup} className={`${styles.container} ${styles.loginForm}`}>
                <div>
                    <span>Email</span>
                    <input onChange={handleEmail} value={email} type='text' />
                </div>
                <div>
                    <span>Password</span>
                    <input onChange={handlePassword} value={password} type='password' />
                </div>
                {isSignupPage &&
                    <div>
                        <span>Username</span>
                        <input onChange={handleUsername} value={username} type='text' />
                    </div>
                }
                <button className={styles.button}>{isSignupPage ? "Sign Up" : "Login"}</button>
                {err && <span style={{ color: 'red' }}>Invalid Input</span>}
            </form>
            <button onClick={handleSignXNavigation} style={{ marginTop: '20px' }} className={styles.button}>{isSignupPage ? 'Go to Sign In' : 'Go to Sign Up'}</button>
        </>
    );
}