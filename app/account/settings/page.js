import 'server-only';
import { SignInUpOut, AccountDelete, AccountEdit } from '../../../components/Accounting';
import styles from '../../../styles/Account.module.css';
import * as borrowedLoginSignUpCSS from '../../../styles/LoginSignup.module.css';
import deleteUser from '../../../utils/deleteUser';
import getCurrentUser from '../../../utils/getCurrentUser';
import Link from 'next/link';


export default async function Settings() {
    const { auth, user } = await getCurrentUser();
    // console.log('\n\nsettings\n\n', auth, user, '\n\nendsettings\n\n');
    return (
        <div className={styles.container}>
            {(auth && user)
                ?
                <>
                    <div className={styles.container}>
                        <Link
                            className={borrowedLoginSignUpCSS.button}
                            href='/account/settings/edit'
                        >
                            Account Editor
                        </Link>
                    </div>
                    <div className={styles.container}>
                        <SignInUpOut isSignOut />
                    </div>
                    <div className={`${styles.container} ${styles.red}`}>
                        <AccountDelete pubID={user.id} authID={auth.id} />
                    </div>
                </>
                :
                <>
                    <div className={`${styles.container} ${styles.red}`}>
                        You must be logged in first!
                    </div>
                </>
            }
        </div>

    )
}