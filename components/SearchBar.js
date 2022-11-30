"use client";
import 'client-only';
import { useState } from 'react';
import styles from '../styles/Search.module.css';

export default function SearchBar({ requestSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        requestSearch(searchTerm);
        setSearchTerm('');
    }

    return (
        <form className={styles.container} onSubmit={handleSearch}>
            <input 
                value={searchTerm} 
                onChange={handleInputChange} 
                type='text' 
            />
            <button className={styles.button}>Search</button>
        </form>
    )
}