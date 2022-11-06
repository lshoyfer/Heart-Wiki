import 'server-only';
import StatBox from './StatBox';
import styles from '../../styles/HomeStats.module.css';

export default function HomeStats() {
    return (
        <div className={styles.layout}>
            <StatBox type='topPages' />
            <StatBox type='topConvos' />
            <StatBox type='recentPages' />
            <StatBox type='recentConvos' />
        </div>
    );
}