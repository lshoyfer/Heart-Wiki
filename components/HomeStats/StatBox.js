import 'server-only';
import styles from '../../styles/HomeStats.module.css';
import StatItem from './StatItem';

export default async function StatBox({ type }) {
    
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