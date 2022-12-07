import 'server-only';
import getCurrentUser from '../../../../utils/getCurrentUser';
import getCurrentConvo from '../../../../utils/getCurrentConvo';
import { ConvoBuilder } from "../../../../components/Creation";

export default async function ConvoEditPage({ params }) {
    const dataProps = await getCurrentUser();
    const { title, description, categories, analyses, id } = await getCurrentConvo(params.id) ?? {};
    return (
        <ConvoBuilder
            {...dataProps}
            updateID={id}
            defaults={{
                title, 
                description,
                rawCategories: categories ? categories.join(', ') : '',
                categories: categories ?? [],
                rawAnalyses: analyses ? analyses.join(', ') : '',
                analyses: analyses ?? []
            }}
        />
    )
}