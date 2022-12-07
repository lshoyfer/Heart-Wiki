import 'server-only'
import getCurrentUser from '../../../utils/getCurrentUser';
import { AnalysisBuilder } from '../../../components/Creation';

export default async function AnalysisBuilderPage() {
    const dataProps = await getCurrentUser();
    return (
        <AnalysisBuilder {...dataProps} />
    )
}