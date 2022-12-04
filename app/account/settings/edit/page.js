import 'server-only';
import { AccountEditor, AboutEditor } from '../../../../components/Accounting';
import getCurrentUser from '../../../../utils/getCurrentUser';
import styles from '../../../../styles/Account.module.css';
// import * as borrowedLoginSignUpCSS from '../../styles/LoginSignup.module.css';


export default async function EditPage() {
    const { auth, user } = await getCurrentUser();

    const {
        username,
        name,
        location,
        discord,
        about_md: aboutMD,
        about_html: aboutHTML,
        id
    } = user ?? {};
    const accountEditorProps = {
        username,
        name,
        location,
        discord,
        id
    };
    const aboutEditorProps = { aboutMD, aboutHTML, id };
    return (
        <div className={styles.container}>
            {user ?
                <>
                    <AccountEditor {...accountEditorProps} />
                    <AboutEditor {...aboutEditorProps} />
                </>
                :
                <>
                    <div className={`${styles.container} ${styles.red}`}>You must be logged in first!</div>
                </>
            }
        </div>
    )
}