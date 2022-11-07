'use client';
import 'client-only';
import { useState } from 'react';

// maybe unnecessary
export default function EntryLayout({ children }) {
    return (
        <section>
            {children}
        </section>
    );
}