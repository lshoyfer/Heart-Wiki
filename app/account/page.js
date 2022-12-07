// "use client";

import { supabase } from '../../utils/supabaseClient';
import { SignInUpOut, AccountInfo } from '../../components/Accounting';
import * as accountStyles from '../../styles/Account.module.css';
import * as loginSignupStyles from '../../styles/LoginSignup.module.css';
import getSession from '../../utils/getSession';

export default async function Account() {
    const data = await getSession();
    return (
        <>{
            (data?.user.aud === 'authenticated')
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