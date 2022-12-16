'use client';
import 'client-only';
import { useEffect, useReducer, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Create.module.css';
import { form, submit } from '../../styles/Form.module.css';

const convoFormReducer = (state, payload) => {
    switch (payload.type) {
        case 'TITLE':
            return { ...state, title: payload.body };
        case 'CATEGORIES':
            return {
                ...state,
                rawCategories: payload.rawCategories,
                categories: new Set(payload.body)
            };
        case 'ANALYSES':
            return {
                ...state,
                rawAnalyses: payload.rawAnalyses,
                analyses: new Set(payload.body)
            };
        case 'DESCRIPTION':
            return { ...state, description: payload.body };
        default:
            console.error('INTERNAL ERROR: @create/convo reducer');
            return { ...state };
    }
}
export default function ConvoBuilder({ auth, user, updateID = null, defaults = null }) {
    const [state, d] = useReducer(convoFormReducer, defaults ?
        {
            ...defaults,
            categories: new Set(defaults.categories),
            analyses: new Set(defaults.analyses)
        }
        :
        {
            title: '',
            description: '',
            categories: new Set(),
            rawCategories: '',
            analyses: new Set(),
            rawAnalyses: ''
        }
    );
    const [err, setErr] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const router = useRouter();

    const createConvo = async () => {
        const { title, description, categories, analyses } = state;

        const { data: convoData } = !updateID
            ? await supabase
                .from('convo')
                .insert({
                    title, description,
                    creator: user.id,
                    categories: [...categories],
                    analyses: [...analyses]
                })
                .select()
            : await supabase
                .from('convo')
                .update({
                    title, description,
                    categories: [...categories],
                    analyses: [...analyses]
                })
                .eq('id', updateID)
                .select();

        if (convoData) {
            router.push(`convo/${convoData[0].id}`);
            router.refresh();
        } else {
            setErr(true);
        }
    }

    useEffect(() => {
        setErr(false);
        setIsConfirmingDelete(false);
    }, [state])


    const startDeleteConvo = () => {
        setIsConfirmingDelete(true);
    }

    const deleteConvo = async () => {
        await supabase
            .from('msg')
            .delete()
            .eq('convo', updateID);

        await supabase
            .from('convo')
            .delete()
            .eq('id', updateID);

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
                    <span>Description</span>
                    <input
                        onChange={(e) => { d({ type: 'DESCRIPTION', body: e.target.value }) }}
                        value={state.description}
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
                <div>
                    <span>Analyses</span> {/* TODO: LINK TO ANALYSES BROWSER AND RETAIN STATE VIA COOKIES OR SUM */}
                    <input
                        onChange={(e) => {
                            d({
                                type: 'ANALYSES',
                                rawAnalyses: e.target.value,
                                body: new Set(
                                    e.target.value
                                        .replaceAll(/\s+/g, '')
                                        .replaceAll(/,$/g, '')
                                        .toLowerCase()
                                        .split(',')
                                )
                            })
                        }}
                        value={state.rawAnalyses}
                        type='text'
                    />
                </div>
                {err &&
                    <div className={`${styles.innerContainer} ${styles.error}`}>
                        Error Processing. Try again
                    </div>
                } {/* Twice for readibility */}
            </form>
            {err &&
                <div className={`${styles.innerContainer} ${styles.error}`}>
                    Error Processing. Try again
                </div>
            }
            <button onClick={createConvo} className={submit}>{updateID ? 'Update' : 'Create'}</button>
            {updateID && !isConfirmingDelete &&
                <button onClick={startDeleteConvo} className={submit}>{'Delete'}</button>
            }
            {updateID && isConfirmingDelete &&
                <button onClick={deleteConvo} className={submit}>{'Confirm Delete'}</button>
            }
        </div>
    )

}