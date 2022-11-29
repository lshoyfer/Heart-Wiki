import 'server-only';
import styles from '../styles/Account.module.css';
import getCurrentUser from '../utils/getCurrentUser';
import getSession from '../utils/getSession';
import formatTimeStr from '../utils/formatTimeStr';
import Image from 'next/image';
import Link from 'next/link';
import SignInUpOut from './SignInUpOut';


export default async function AccountInfo() {
    const { auth, user } = await getCurrentUser();

    return (
        <>
            <div className={styles.container}>
                <Image
                    src={user.profile_picture} // TODO: no pic edge case
                    width={100}
                    height={100}
                    alt={`${user.username}'s profile picture`}
                />
                <span>{user.username}</span>
            </div>
            <div className={styles.container} id={styles.info}>
                {/* TO BE IMPL / ADD ON IF I CARE  | acc convos? dms --> maybe extra addition for memes at end?*/}
                <div>
                    <span>Name</span>
                    <span>Larry</span> 
                </div>
                <div>
                    <span>Origin</span>
                    <span>New York</span>
                </div>
                <div>
                    <span>Status</span>
                    <span>Online</span> {/* TODO */}
                </div>
                <div>
                    <span>Created</span>
                    <span>{formatTimeStr(user.created_at)}</span>
                </div>
                <div>
                    <span>Discord</span>
                    <span>Chocofuzz#4902</span>
                </div>
            </div>
            {user.about_html && 
            <div className={styles.container} id={styles.about}>
                <div>
                    About
                </div>
                <div dangerouslySetInnerHTML={{ __html: user.about_html }}/>
            </div>
            }

            <div className={styles.container}>
                <SignInUpOut isSignOut />
            </div>
        </>
    )
}