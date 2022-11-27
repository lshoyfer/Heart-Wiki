// 'use client'
// import 'client-only';
import 'server-only';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../styles/Convo.module.css';
import Message from '../../../components/Message';
import ChatBox from '../../../components/ChatBox';

async function getConvo(id) {
  const { data, err } = await supabase
    .from('convo')
    .select()
    .eq('id', id);

  return data[0];
}

export default async function ConvoPage({ params, searchParams }) {
  const convo = await getConvo(params.id);
  // console.log('here', convo.msgs);
  return (
    <>
      <div className={styles.convoContainer}>
        {convo.msgs.map((mid) => (<Message key={mid} id={mid} />))}
        {convo.msgs.map((mid) => (<Message key={mid} id={mid} />))}
      </div>
      <ChatBox />
    </>
  );
}