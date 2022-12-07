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
        case 'CATEGORIES':
            return {
                ...state,
                rawCategories: payload.rawCategories,
                categories: new Set(payload.body)
            };
        case 'CONTENT_MD':
            return { ...state, contentMD: payload.body };
        case 'CONTENT_HTML':
            return { ...state, contentHTML: sanitize(marked.parse(payload.body)) };
        default:
            console.error('INTERNAL ERROR: @create/analysis reducer');
            return { ...state };
    }
}
export default function AnalysisBuilder({ auth, user, updateID = null, defaults = null, currentConvos = null }) {
    const [state, d] = useReducer(analysisFormReducer, defaults ?
        { ...defaults, categories: new Set(defaults.categories) }
        :
        {
            title: '',
            categories: new Set(),
            rawCategories: '',
            contentMD: '',
            contentHTML: ''
        }
    );
    const [err, setErr] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const router = useRouter();

    const createAnalysis = async () => {
        const { title, categories, contentMD: content_md, contentHTML: content_html } = state;
        const commentsData = !updateID &&
            (await supabase
                .from('convo')
                .insert({ title: `${title} General Comments`, is_comment_section: true })
                .select()).data[0]

        const { data: analysisData } = !updateID
            ? await supabase
                .from('analysis')
                .insert({
                    title, content_md, content_html,
                    convos: [],
                    comments: commentsData.id,
                    owner: user.id,
                    categories: [...categories]
                })
                .select()
            : await supabase
                .from('analysis')
                .update({
                    title, content_md, content_html,
                    categories: [...categories]
                })
                .eq('id', updateID)
                .select();

        if (analysisData) {
            router.push(`analysis/${analysisData[0].id}`);
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
        const { data } = await supabase
            .from('analysis')
            .delete()
            .eq('id', updateID)
            .select();

        await supabase
            .from('convo')
            .delete()
            .eq('id', data[0].comments);

        // this could be done more efficiently with Postgres, but alas, idc!
        await Promise.all(
            data[0].convos.map((id) =>
                supabase
                    .from('convo')
                    .delete()
                    .eq('id', id)
            )
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
                    <span>Categories</span> {/* TODO: LINK TO CATEGORY BROWSER AND RETAIN STATE VIA COOKIES OR SUM */}
                    <input
                        onChange={(e) => {
                            d({
                                type: 'CATEGORIES',
                                rawCategories: e.target.value,
                                body: new Set(
                                    e.target.value
                                        .replaceAll(/\s+/g, '')
                                        .replaceAll(/,$/g, '')
                                        .toLowerCase()
                                        .split(',')
                                )
                            })
                        }}
                        value={state.rawCategories}
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