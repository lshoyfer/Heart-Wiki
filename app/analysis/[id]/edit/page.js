import 'server-only';
import { AnalysisBuilder } from '../../../../components/Creation';
import getCurrentUser from '../../../../utils/getCurrentUser';
import getAnalysisData from '../../../../utils/getAnalysisData';
import styles from '../../../../styles/Analysis.module.css';

export default async function AnalysisEditorPage({ params }) {
    const dataProps = await getCurrentUser();
    const {
        content_html: contentHTML,
        content_md: contentMD,
        title,
        categories,
        convos
    } = await getAnalysisData(params.id);


    return (
        <div className={styles.editContainer}>
            <AnalysisBuilder
                {...dataProps}
                updateID={params.id}
                defaults={{
                    contentHTML,
                    contentMD,
                    title,
                    categories: categories,
                    rawCategories: categories?.join(', ')
                }}
                currentConvos={convos}
            />
        </div>
    );
}