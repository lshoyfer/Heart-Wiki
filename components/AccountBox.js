import 'server-only';
import styles from '../styles/AccountBox.module.css';


export default function AccountBox() {
    return (
        <div id={styles.accountBox}>
            {undefined ?? "Account"}
        </div>
    );
}