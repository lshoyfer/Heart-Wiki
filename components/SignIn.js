'use client';
import 'client-only';
import { useState, use, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Account.module.css';

// use nextjs router reload

export default function SignIn({ handleSignIn }) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignupPage, setIsSignupPage] = useState(false);

    console.log('RENDERING!', loading);
    // useEffect(() => {

    // }, []);

    if (loading && !isSignupPage) {
        console.log('logging in!', password);
        // try {
        const { data, err } = console.log('USING!') ?? use(supabase.auth.signInWithPassword({ email, password })); // uh should this be server side? lol
        console.log('SETTING LOAD') ?? setLoading(false);
        setEmail('');
        setPassword('');
        console.log("SUCCESS!", data);
        // } catch (err) {
        //     console.log('ERRRRR SIGNIN', err);
        //     setLoading(false);
        //     setErr(true);
        // }
    }

    // :) <-- he repeats code instead of putting it in a function conditionally
    if (loading && isSignupPage) {
        console.log('signing up', password);
        try {
            setLoading(false);
            setEmail('');
            setPassword('');
            const { data, err } = use(supabase.auth.signUp({ email, password })); // uh should this be server side? lol
            console.log("SUCCESS!", data);
        } catch (err) {
            console.log('ERRRRR SIGNUP', err);
            setLoading(false);
            setErr(true);
        }
    }

    const handleSignXNavigation = () => {
        setIsSignupPage(!isSignupPage);
        setErr(false);
    }

    const handleLogin = (e) => {
        e.preventDefault(); // or actually let browser reload, prolly nextjs inte is better

        setLoading(true);
    }

    const handlePassword = (e) => {
        // console.log('handling pass', e.target.value);
        setPassword(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    return (
        <>
            <div>{isSignupPage ? 'Sign Up' : 'Sign In'}</div>
            <form onSubmit={handleLogin} className={`${styles.container} ${styles.loginForm}`}>
                <div>
                    <span>Email</span>
                    <input onChange={handleEmail} value={email} type='text' />
                </div>
                <div>
                    <span>Password</span>
                    <input onChange={handlePassword} value={password} type='password' />
                </div>
                <button className={styles.button}>{isSignupPage ? "Sign Up" : "Login"}</button>
                {err && <span style={{ color: 'red' }}>Invalid Input</span>}
            </form>
            <button onClick={handleSignXNavigation} style={{ marginTop: '20px' }} className={styles.button}>{isSignupPage ? 'Go to Sign In' : 'Go to Sign Up'}</button>
        </>
    );
}