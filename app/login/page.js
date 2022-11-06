"use client";

import {useState, use, cache } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (e, email) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabaseClient.auth.signInWithOtp({ email });
            if (error) throw error;
            alert('Check email');
        } catch (error) {
            alert(error.error_description ?? error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    }

    return (
        <form onSubmit={(e) => handleLogin(e, email)}>
            <div>
                <label htmlFor='email'>Login by email:</label>
                <input type='email' id='email' value={email} onChange={(e) => handleEmailInput(e)} required/>
            </div>
            <div>
                <input type='submit' value={'Sign in'}/>
            </div>
        </form>
    )
}
