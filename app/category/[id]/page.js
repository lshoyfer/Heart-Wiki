import 'server-only';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../styles/Category.module.css';
import formatTimeStr from '../../../utils/formatTimeStr';
import Link from 'next/link';
import getCategoryData from '../../../utils/getCategoryData';
import getCurrentUser from '../../../utils/getCurrentUser';

export default async function CategoryViewer({ params }) {
    const data = await getCategoryData(params.id) ?? {};
    const userData = await getCurrentUser();
    return (
        <>
            <div className={styles.title}>
                {data.name}
            </div>
            <div className={styles.infoBar}>
                <div>
                    <span>Created by</span>
                    <span>{data.creator.username}</span>
                </div>
                <div>
                    <span>Created at</span>
                    <span>{formatTimeStr(data.created_at)}</span>
                </div>
            </div>
            {data.description &&
                <div className={styles.description}>
                    {data.description}
                </div>
            }
            {(userData.user.username === data.creator.username) &&
                <Link href={`category/${params.id}/edit`} id={styles.edit}>
                    Edit
                </Link>
            }
            <div className={styles.splitPanel}> {/* TODO: Name once analysis creation in place */}
                <div>
                    <div>Analyses</div>
                    <ol>
                        {data.analyses?.map((id, index) =>
                            <Link key={index} href={`/analysis/${id}`}>
                                Placeholder
                            </Link>)}
                    </ol>
                </div>
                <div>
                    <div>Convos</div>
                    <ol>
                        {data.analyses?.map((id, index) =>
                            <Link key={index} href={`/convo/${id}`}>
                                Placeholder
                            </Link>)}
                    </ol>
                </div>
            </div>
        </>
    )
}