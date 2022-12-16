import 'server-only';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css';
import getSession from '../utils/getSession';
import getCurrentUser from '../utils/getCurrentUser';

export default async function NavBar() {
    const { user } = await getCurrentUser();
    return (
        <nav className={styles.navblock}>
            <Link href='/'>HeartWiki</Link>
            {/* <Link href='/search'>Search</Link> */}
            <Link href='/about'>About</Link>
            <Link href='/create'>Create</Link>
            <Link href='/account'>{user?.username ?? "Account"}</Link>
        </nav>
    );
}