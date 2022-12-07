import 'server-only';
import styles from '../../styles/Create.module.css';
import getCurrentUser from '../../utils/getCurrentUser';

export default async function CreateLayout({ children }) {
    const { auth } = await getCurrentUser();
    return (
        <div className={styles.navContainer}>
            {auth ?
                children
                :
                <div className={`${styles.innerContainer} ${styles.error}`}>
                    You must be logged in first!
                </div>
            }
        </div>
    );
}