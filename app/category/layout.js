import 'server-only';
import styles from '../../styles/Category.module.css';

export default async function CategoryLayout({ children }) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
}