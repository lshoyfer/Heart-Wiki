import 'server-only';
import { db } from '../../utils/db';
import styles from '../../styles/HomeStats.module.css';
import StatItem from './StatItem';

export default async function StatBox({ type }) {
    const items = db[type].slice(0, 3);
    return (
        <div className={styles.statbox}>
            <div style={{marginLeft: '10px', marginTop: '5px', overflow: 'hidden'}}>{type}</div> {/* TODO: make this a link */}
            <ul className={styles.statitemList}>
                {items.map((item) => 
                    <StatItem key={item.id} item={item} />
                )}
            </ul>
        </div>
    )
}