import 'server-only';
import getCurrentUser from '../../../../utils/getCurrentUser';
import styles from '../../../../styles/Category.module.css';
import getCategoryData from '../../../../utils/getCategoryData';
import { form, submit } from '../../../../styles/Form.module.css';
import { CategoryBuilder } from '../../../../components/Creation';

export default async function CategoryEditPage({ params }) {
    const userData = await getCurrentUser();
    const { name, description, creator } = await getCategoryData(params.id);

    if (!userData.auth) {
        return (
            <div className={styles.authErr}>
                You must be logged in first!
            </div>
        );
    } else if (userData.user.id !== creator.id) {
        return (
            <div className={styles.authErr}>
                You are not the creator!
            </div>
        )
    }
    return (
        <CategoryBuilder
            {...userData}
            updateID={params.id} 
            defaults={{
                name,
                description
            }}
        />
    );
}