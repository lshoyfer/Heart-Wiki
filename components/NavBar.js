import 'server-only';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css';
import AccountBox from '/components/AccountBox';

export default function NavBar() {
    return (
        <nav className={styles.navblock}>
            <Link href='/'>HeartWiki</Link>
            <Link href='/search'>Search</Link>
            <Link href='/about'>About</Link>
            {/* <AccountBox /> */}
            <Link href='/account'>Account</Link>
        </nav>
    );
}