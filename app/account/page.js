// "use client";

// import { useState, use, cache } from 'react';
import { supabase } from '../../utils/supabaseClient';
import SignIn from '../../components/SignIn';
import styles from '../../styles/Account.module.css';

export default async function Account() {
    const { data, err } = await supabase.auth.getSession();
    console.log(data, err);

    return (
        <>{
            data.session
                ? (
                    <div>
                        logged in
                    </div>
                )
                : (
                    <div className={styles.container}>
                        <SignIn />
                    </div>
                )
        }</>
    )
}



// const [loading, setLoading] = useState(false);
// const [email, setEmail] = useState('');

// const handleLogin = async (e, email) => {
//     e.preventDefault();
//     try {
//         setLoading(true);
//         const { error } = await supabase.auth.signInWithOtp({ email });
//         if (error) throw error;
//         alert('Check email');
//     } catch (error) {
//         alert(error.error_description ?? error.message);
//     } finally {
//         setLoading(false);
//     }
// }

// const handleEmailInput = (e) => {
//     setEmail(e.target.value);
// }

// return (
//     <form onSubmit={(e) => handleLogin(e, email)}>
//         <div>
//             <label htmlFor='email'>Login by email:</label>
//             <input type='email' id='email' value={email} onChange={(e) => handleEmailInput(e)} required/>
//         </div>
//         <div>
//             <input type='submit' value={'Sign in'}/>
//         </div>
//     </form>
// )