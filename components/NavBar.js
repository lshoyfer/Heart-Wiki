import 'server-only';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css';
import AccountBox from '/components/AccountBox';
import getSession from '../utils/getSession';
import getCurrentUser from '../utils/getCurrentUser';

export default async function NavBar() {
    const { user } = await getCurrentUser();
    return (
        <nav className={styles.navblock}>
            <Link href='/'>HeartWiki</Link>
            <Link href='/search'>Search</Link>
            <Link href='/create'>Create</Link>
            {/* <AccountBox /> */}
            <Link href='/account'>{user?.username ?? "Account"}</Link>
        </nav>
    );
}