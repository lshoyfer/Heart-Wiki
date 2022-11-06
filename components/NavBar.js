import 'server-only';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css';

export default function NavBar({}) {
    return (
        <nav className={styles.navblock}>
            <Link href='/'>HeartWiki</Link>
            <Link href='/about'>About</Link>
            <Link href='/search'>Search</Link>
        </nav>
    );
}