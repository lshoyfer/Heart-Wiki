import 'server-only'
import getCurrentUser from '../../../utils/getCurrentUser';
import { ConvoBuilder } from '../../../components/Creation';

export default async function ConvoBuilderPage() {
    const dataProps = await getCurrentUser();
    return (
        <ConvoBuilder {...dataProps} />
    )
}