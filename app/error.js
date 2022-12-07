'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {

    useEffect(() => {
        console.log('remove this before prod. ERROR:', error);
    }, [error]);

    return (
        <div>
            Oops! An error occurred.
            <button onClick={() => reset()}>Try again?</button>
        </div>
    )

}