import 'server-only';
import styles from '../../styles/Category.module.css';

export default function CategoryTagItem({ name, color }) {
    return (
        <div className={styles.tagItem}>
            {name}
        </div>
    )
}