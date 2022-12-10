import 'server-only';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function HomeItem({ item, type }) {
    let titleKey, hrefStart;
    switch (type) {
        case 'category':
            titleKey = 'name';
            hrefStart = '/category/';
            break;
        case 'analysis':
            titleKey = 'title';
            hrefStart = '/analysis/';
            break;
        case 'convo':
            titleKey = 'title';
            hrefStart = '/convo/';
            break;
    }
    return (
        <div className={styles.homeItem}>
            <Link href={`${hrefStart}${item.id}`}>{item[titleKey]}</Link>
        </div>
    );
}