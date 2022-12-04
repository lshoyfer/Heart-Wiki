import 'server-only';
import styles from '../../styles/Account.module.css';
import * as borrowedLoginSignUpCSS from '../../styles/LoginSignup.module.css';
import getCurrentUser from '../../utils/getCurrentUser';
import getSession from '../../utils/getSession';
import formatTimeStr from '../../utils/formatTimeStr';
import Image from 'next/image';
import Link from 'next/link';
import SignInUpOut from './SignInUpOut';


export default async function AccountInfo() {
    const { auth, user } = await getCurrentUser();
    return (
        <>
            <div className={styles.container}>
                <Image
                    src={user.profile_picture ?? 'https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/avatar/sb_test1.jpg'} // TODO: no pic edge case
                    width={100}
                    height={100}
                    alt={`${user.username}'s profile picture`}
                    priority
                // placeholder='blur'
                />
                <span>{user.username}</span>
            </div>
            <div className={styles.container} id={styles.info}>
                {/* TO BE IMPL / ADD ON IF I CARE  | acc convos? dms --> maybe extra addition for memes at end?*/}
                {user.name && <div>
                    <span>Name</span>
                    <span>{user.name}</span>
                </div>}
                {user.location && <div>
                    <span>Location</span>
                    <span>{user.location}</span>
                </div>}
                <div>
                    <span>Status</span>
                    <span>Online</span> {/* TODO */}
                </div>
                <div>
                    <span>Created</span>
                    <span>{formatTimeStr(auth.created_at)}</span>
                </div>
                {user.discord && <div>
                    <span>Discord</span>
                    <span>{user.discord}</span>
                </div>}
            </div>
            {user.about_html &&
                <div className={styles.container} id={styles.about}>
                    <div>
                        About
                    </div>
                    <div style={{ borderStyle: 'dotted' }} className={styles.container} dangerouslySetInnerHTML={{ __html: user.about_html }} />
                </div>
            }

            <Link
                style={{ marginTop: '10px' }}
                className={borrowedLoginSignUpCSS.button}
                href='/account/settings'
            >
                Settings
            </Link>
        </>
    )
}