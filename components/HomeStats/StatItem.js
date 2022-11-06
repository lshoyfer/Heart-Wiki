import 'server-only';
import styles from '../../styles/HomeStats.module.css';
import Image from 'next/image';
import sasukeIMG from '../../utils/sasuketest.jpeg';

export default function StatItem({
    item,
}) {
    return (
        <div className={styles.statitem}>
            <Image 
                src={sasukeIMG} // TODO: no pic edge case
                width={32}
                height={32}
                alt={item.title} // temp
            />
            <span>{item.title}</span>
            <span>{item.likes ?? 101}</span> {/* todo */}
        </div>
    )
}