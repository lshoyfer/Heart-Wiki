'use client';
import 'client-only';
import styles from '../../styles/Account.module.css';
import * as borrowedLoginSignUpCSS from '../../styles/LoginSignup.module.css';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function AccountDelete({ pubID, authID }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isConfirmingCreds, setIsConfirmingCreds] = useState(false);
    const [err, setErr] = useState(false);
    const handleDeleteAccount = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        // console.log('\nIN HANDLE\n', data, '\nEND HANDLE\n');
        if (data.user) {
            const info = await fetch(`${window.location.href.replace(/(?<!\/)\/(?!\/).*/, '')}/api/delete`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pubID, authID })
            });
            // console.log(
            //     'sucessful POST/DELETION:', info
            // );
            setEmail(''); // will tinker later
            setPassword('');
        } else {
            setErr(true);
        }
    }

    const handleCreds = () => {
        setIsConfirmingCreds(true);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    if (isConfirmingCreds) return (
        <form style={{ marginTop: 0 }} onSubmit={handleDeleteAccount} className={`${borrowedLoginSignUpCSS.container} ${borrowedLoginSignUpCSS.loginForm}`}>
            <div>
                <span>Email</span>
                <input onChange={handleEmail} value={email} type='text' />
            </div>
            <div>
                <span>Password</span>
                <input onChange={handlePassword} value={password} type='password' />
            </div>
            <button style={{ borderColor: 'red' }} className={`${borrowedLoginSignUpCSS.button}`}>Delete Account</button>
            {err && <span style={{ color: 'red' }}>Invalid Input</span>}
        </form>
    ); else return (
        <button onClick={handleCreds} className={borrowedLoginSignUpCSS.button}>Delete Account</button>
    );
}