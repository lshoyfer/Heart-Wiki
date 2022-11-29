import 'server-only';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../styles/Analysis.module.css';
import Link from 'next/link';
import formatTimeStr from '../../../utils/formatTimeStr';

// console.log(styles);

async function getAnalysisData(id) {
  const { data, error } = await supabase
    .from('analysis')
    .select()
    .eq('id', id);
  return data[0];
}

export default async function Analysis({ params, searchParams }) {
  const analysis = await getAnalysisData(params.id);
  const time = formatTimeStr(analysis.created_at);

  return (
    <div className={styles.mainContainer}>

      <div className={styles.infoBar}>
        <div className={styles.title}>{analysis.title}</div>
        <div className={styles.infoBarMisc}>
          <span>{analysis.owner ?? 'Public'}</span>
          <Link className={styles.convos} href='/'>Convos</Link>
          <span>{time}</span>
        </div>
      </div>

      <div className={styles.infoContainer} dangerouslySetInnerHTML={{ __html: analysis.content_html }}/>

      <div className={styles.comments}>
        Comments Placeholder
      </div>
    </div>
  );
}