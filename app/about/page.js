import 'server-only';
import styles from '../../styles/About.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default async function AboutPage() {
    return (
        <div className={styles.mainContainer}>
            <span>Welcome</span>
            <Image
                className={styles.img}
                src='https://ogqlzchzftdqgeolrbzc.supabase.co/storage/v1/object/public/image/public/may_my_heart_be_my_guiding_hey.jpeg'
                alt='Kingdom Hearts fanart -- The heart is everything'
                width={500}
                height={500}
            />
            <Link target='_blank' rel='noreferrer noopener' href='https://www.youtube.com/watch?v=HTUq3Ik1GHM'>Rec1</Link>
            <Link target='_blank' rel='noreferrer noopener' href='https://www.youtube.com/watch?v=yauFhOqoXRc'>Rec2</Link>
            <Link target='_blank' rel='noreferrer noopener' href='https://www.youtube.com/watch?v=-5pIEDvec0g'>Rec3</Link>
            <Link target='_blank' rel='noreferrer noopener' href='https://www.youtube.com/watch?v=wp7l9oolXS0'>Rec4</Link>
            <Link target='_blank' rel='noreferrer noopener' href='https://plato.stanford.edu/entries/kierkegaard/'>Rec5</Link>

        </div>
    );
}