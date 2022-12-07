import 'server-only';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../styles/Analysis.module.css';
import Link from 'next/link';
import formatTimeStr from '../../../utils/formatTimeStr';
import getAnalysisData from '../../../utils/getAnalysisData';

export default async function Analysis({ params }) {
  const analysis = await getAnalysisData(params.id);

  return (
    <div className={styles.mainContainer}>

      <div className={styles.infoBar}>
        <div className={styles.title}>{analysis.title}</div>
        <div className={styles.infoBarMisc}>
          <span>{analysis.owner.username}</span>
          <Link className={styles.convos} href='/'>Convos</Link>
          <span>{formatTimeStr(analysis.created_at)}</span>
        </div>
      </div>

      <Link href={`/analysis/${params.id}/edit`} id={styles.edit}>
        Edit
      </Link>

      <div className={styles.infoContainer} dangerouslySetInnerHTML={{ __html: analysis.content_html }} />

      <div className={styles.comments}>
        Comments Placeholder
      </div>
    </div>
  );
}