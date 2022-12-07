import 'server-only'
import getCurrentUser from '../../../utils/getCurrentUser';
import { CategoryBuilder } from '../../../components/Creation';

export default async function CategoryBuilderPage() {
    const dataProps = await getCurrentUser();
    return (
        <CategoryBuilder {...dataProps} />
    )
}