// "use client";

import { supabase } from '../../utils/supabaseClient';
import SignInUpOut from '../../components/SignInUpOut';
import AccountInfo from '../../components/AccountInfo';
import * as accountStyles from '../../styles/Account.module.css';
import * as loginSignupStyles from '../../styles/LoginSignup.module.css';
import getSession from '../../utils/getSession';

export default async function Account() {
    const data = await getSession();
    return (
        <>{
            data?.session
                ? (
                    <div className={accountStyles.container}>
                        <AccountInfo />
                    </div>
                )
                : (
                    <div className={loginSignupStyles.container}>
                        <SignInUpOut />
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