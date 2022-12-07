import 'server-only';
import styles from '../../styles/HomeStats.module.css';
import Image from 'next/image';

export default function StatItem({
    item,
}) {
    return (
        <div className={styles.statitem}>
            <Image 
                src={'https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/avatar/sb_test1.jpg'} // TODO: no pic edge case
                width={32}
                height={32}
                alt={item.title} // temp
            />
            <span>{item.title}</span>
            <span>{item.likes ?? 101}</span> {/* todo */}
        </div>
    )
}