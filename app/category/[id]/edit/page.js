import 'server-only';
import getCurrentUser from '../../../../utils/getCurrentUser';
import styles from '../../../../styles/Category.module.css';
import getCategoryData from '../../../../utils/getCategoryData';
import { form, submit } from '../../../../styles/Form.module.css';
import { CategoryBuilder } from '../../../../components/Creation';

export default async function CategoryEditPage({ params }) {
    const userData = await getCurrentUser();
    const { name, description, tags, creator } = await getCategoryData(params.id);

    if (!userData.auth) {
        return (
            <div className={styles.authErr}>
                You must be logged in first!
            </div>
        );
    } else if (userData.user.username !== creator.username) { // weak check but alas, it doesn't matter
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
                description,
                tags,
                rawTags: tags.join(', ')
            }}
        />
    );
}