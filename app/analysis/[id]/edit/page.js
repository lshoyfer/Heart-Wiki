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
        category,
    } = await getAnalysisData(params.id) ?? {};
    if (!title) return (<div>Page was deleted</div>);



    return (
        <div className={styles.editContainer}>
            <AnalysisBuilder
                {...dataProps}
                updateID={params.id}
                defaults={{
                    contentHTML,
                    contentMD,
                    title,
                    category
                }}
            />
        </div>
    );
}