'use client';
import 'client-only';
import { useEffect, useRef, useState } from 'react';

import SearchBar from "../../components/SearchBar";
import { supabase } from '../../utils/supabaseClient';

export default function Search({ }) {
    const [isGettingData, setIsGettingData] = useState(false);
    const [existsData, setExistsData] = useState(false);
    const searchTerm = useRef('');
    const searchResults = useRef([]);

    const getSearchTerm = (term) => {
        searchTerm.current = term;
        setIsGettingData(true);
    }

    const requestSearch = async () => {
        const baseTerm = searchTerm.current;
        const patternTerm = `%${searchTerm.current.replace(' ', '_')}%`;
        const { data, err } = await supabase
            .from('analysis')
            .select('*, user ( username )')
            .or(
                `
                    ${Number(baseTerm)
                        ? `id.eq.${baseTerm},`
                        : ''}
                    title.ilike.${patternTerm},
                    content_md.ilike.${patternTerm}
                `.replaceAll(/(\s)/g, '')
            );

        searchResults.current = data;
        // .or(`username.ilike${patternTerm}`.replaceAll(/(\s)/g, ''), {foreignTable: 'user'});

        // user.username.ilike${patternTerm}

        console.log('\ngot search data:\n', data);
    }

    useEffect(() => {
        if (isGettingData) {
            requestSearch()
            setExistsData(true);
            setIsGettingData(false);
        } else if (existsData) {
            console.log('existsData babyyyy');
        } else console.log('serious useEffect errors');
    }, [isGettingData, existsData, searchTerm]);

    return (
        <>
            <SearchBar requestSearch={getSearchTerm} />
            {existsData &&
                <ul>
                    {searchResults.current.map((result) => (
                        <div key={result.id}>{result.title}</div>
                    ))}
                </ul>
            }
        </>
    )
}