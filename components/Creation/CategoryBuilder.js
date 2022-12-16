'use client';
import 'client-only';
import { useEffect, useReducer, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Create.module.css';
import { form, submit } from '../../styles/Form.module.css';


const categoryFormReducer = (state, payload) => {
    switch (payload.type) {
        case 'NAME':
            return { ...state, name: payload.body };
        case 'DESCRIPTION':
            return { ...state, description: payload.body };
        default:
            console.err('INTERNAL ERROR: @create/category reducer');
            return { ...state };
    }
}

export default function CategoryBuilder({ auth, user, updateID = null, defaults = null }) {
    const [state, d] = useReducer(categoryFormReducer, defaults ?
        { ...defaults, creator: user.id }
        :
        {
            name: '',
            description: '',
            creator: user.id,
        }
    );
    const [err, setErr] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const router = useRouter();

    const createCategory = async (e) => {
        e.preventDefault();

        const stateCopy = { ...state };

        const { data } = !updateID
            ? await supabase
                .from('category')
                .insert(stateCopy)
                .select()
            : await supabase
                .from('category')
                .update(stateCopy)
                .eq('id', updateID)
                .select();

        if (data) {
            router.push(`category/${data[0].id}`);
            router.refresh();
        } else {
            setErr(true);
        }
    }

    useEffect(() => {
        setErr(false);
    }, [state]);


    const startDeleteCategory = () => {
        setIsConfirmingDelete(true);
    }

    const deleteCategory = async () => {
        await supabase
            .from('category')
            .delete()
            .eq('id', updateID);
        router.push('/');
        router.refresh();
    }

    return (
        <>
            <form
                onSubmit={createCategory}
                className={form}
            >
                <div>
                    <span>Name</span>
                    <input
                        onChange={(e) => { d({ type: 'NAME', body: e.target.value }) }}
                        value={state.name}
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
                {err &&
                    <div className={`${styles.innerContainer} ${styles.error}`}>
                        Error Processing. Try again
                    </div>
                }
                <button className={submit}>{updateID ? 'Update' : 'Create'}</button>
            </form>
            {updateID && !isConfirmingDelete &&
                <button onClick={startDeleteCategory} className={submit}>{'Delete'}</button>
            }
            {updateID && isConfirmingDelete &&
                <button onClick={deleteCategory} className={submit}>{'Confirm Delete'}</button>
            }
        </>
    );
}