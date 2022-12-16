'use client';
import 'client-only';
import { useLayoutEffect, useReducer, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Create.module.css';
import { form, submit } from '../../styles/Form.module.css';
import { sanitize } from 'dompurify';
import { marked } from 'marked';

const analysisFormReducer = (state, payload) => {
    switch (payload.type) {
        case 'TITLE':
            return { ...state, title: payload.body };
        case 'CATEGORY':
            return { ...state, category: payload.body };
        case 'CONTENT_MD':
            return { ...state, contentMD: payload.body };
        case 'CONTENT_HTML':
            return { ...state, contentHTML: sanitize(marked.parse(payload.body)) };
        default:
            console.error('INTERNAL ERROR: @create/analysis reducer');
            return { ...state };
    }
}
export default function AnalysisBuilder({ auth, user, updateID = null, defaults = null }) {
    const [state, d] = useReducer(analysisFormReducer, defaults ?
        { ...defaults }
        :
        {
            title: '',
            contentMD: '',
            contentHTML: '',
            category: ''
        }
    );
    const [err, setErr] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const router = useRouter();

    const createAnalysis = async () => {
        const { title, category, contentMD: content_md, contentHTML: content_html } = state;
        const commentsdata = !updateID ?
            (await supabase
                .from('convo')
                .insert({ title: `${title} General Comments`, is_comment_section: true })
                .select()).data[0]
            : null;

        const { data: analysisdata } = !updateID
            ? await supabase
                .from('analysis')
                .insert({
                    title, content_md, content_html, category,
                    comments: commentsdata.id,
                    owner: user.id,
                })
                .select()
            : await supabase
                .from('analysis')
                .update({
                    title, content_md, content_html, category
                })
                .eq('id', updateID)
                .select();

        if (analysisdata) {
            router.push(`analysis/${analysisdata[0].id}`);
            router.refresh();
        } else {
            setErr(true);
        }
    }

    useLayoutEffect(() => {
        d({ type: 'CONTENT_HTML', body: state.contentMD })
        setErr(false);
        setIsConfirmingDelete(false);
    }, [state.contentMD])


    const startDeleteAnalysis = () => {
        setIsConfirmingDelete(true);
    }

    const deleteAnalysis = async () => {
        // delete analysis
        const { data: deletedAnalysisData } = await supabase
            .from('analysis')
            .delete()
            .eq('id', updateID)
            .select();

        // delete its comments section
        const { data: deletedCommentsData } = await supabase
            .from('convo')
            .delete()
            .eq('id', deletedAnalysisData[0].comments);

        // delete all msgs in comments section
        supabase
            .from('msg')
            .delete()
            .eq('convo', deletedCommentsData[0].id)

        // delete all associated convos
        const { data: deletedConvosData } = await supabase
            .from('convo')
            .delete()
            .eq('analysis', deletedAnalysisData[0].id)

        // delete each of their associated msgs
        deletedConvosData?.forEach((deletedConvo) =>
            supabase
                .from('msg')
                .delete()
                .eq('analysis', deletedConvo.id)
        );

        router.push('/');
        router.refresh();
    }


    return (
        <div className={styles.invisAlignContainer}>
            <form
                className={form}
            >
                <div>
                    <span>Title</span>
                    <input
                        onChange={(e) => { d({ type: 'TITLE', body: e.target.value }) }}
                        value={state.title}
                        type='text'
                    />
                </div>
                <div>
                    <span>Category</span>
                    <input
                        onChange={(e) => { d({ type: 'CATEGORY', body: e.target.value }) }}
                        value={state.category}
                        type='text'
                    />
                </div>
                {err &&
                    <div className={`${styles.innerContainer} ${styles.error}`}>
                        Error Processing. Try again
                    </div>
                } {/* Twice for readibility */}
            </form>

            <div className={styles.invisAlignContainer}>
                <span>Content</span>
                <textarea
                    onChange={(e) => { d({ type: 'CONTENT_MD', body: e.target.value }) }}
                    value={state.contentMD}
                    type='text'
                    className={styles.inputMD}
                />
            </div>

            {state.contentHTML &&
                <div className={styles.invisAlignContainer}>
                    <span>Preview</span>
                    <div className={styles.previewHTML} dangerouslySetInnerHTML={{ __html: state.contentHTML }} />
                </div>
            }
            {err &&
                <div className={`${styles.innerContainer} ${styles.error}`}>
                    Error Processing. Try again
                </div>
            }
            <button onClick={createAnalysis} className={submit}>{updateID ? 'Update' : 'Create'}</button>
            {updateID && !isConfirmingDelete &&
                <button onClick={startDeleteAnalysis} className={submit}>{'Delete'}</button>
            }
            {updateID && isConfirmingDelete &&
                <button onClick={deleteAnalysis} className={submit}>{'Confirm Delete'}</button>
            }
        </div>
    )

}