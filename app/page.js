import 'server-only';
import styles from '../styles/Home.module.css';
import getHomeInfo from '../utils/getHomeInfo';
import HomeItem from '../components/HomeItem';

export default async function Home() {
    const { categories, analyses, convos } = await getHomeInfo();
    // console.log(convos, analyses, categories);
    return (
        <div className={styles.threePanelContainer}>
            <div className={styles.panel}>
                <div className={styles.title}>
                    Categories
                </div>
                {categories.map(category => (
                    <HomeItem item={category} key={category.id} type='category' />
                ))}
            </div>
            <div className={styles.panel}>
                <div className={styles.title}>
                    Analysis
                </div>
                {analyses.map(analysis => (
                    <HomeItem item={analysis} key={analysis.id} type='analysis' />
                ))}
            </div>
            <div className={styles.panel}>
                <div className={styles.title}>
                    Convos
                </div>
                {convos.map(convo => (
                    <HomeItem item={convo} key={convo.id} type='convo' />
                ))}
            </div>
        </div>
    );
}