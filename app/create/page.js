import 'server-only';
import styles from '../../styles/Create.module.css';
import Link from 'next/link';

export default async function Create({ }) {
    return (
        <>
            <Link className={styles.innerContainer} href='/create/category'>Category</Link>
            <Link className={styles.innerContainer} href='/create/analysis'>Analysis</Link>
            <Link className={styles.innerContainer} href='/create/convo'>Convo</Link>
        </>
    );
}