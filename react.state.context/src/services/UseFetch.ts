import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

/**
 * @description Fetch API: Makes the HTTP request.
 * @param {string} url 
 * @param {RequestInit} [options] 
 * @returns {UseFetchResult<T>}
 */
const useFetch = <T,>(url: string, options?: RequestInit): UseFetchResult<T> => {

    // Generics (<T>): We use TypeScript generics to make the hook reusable for different types of data.

    // define states 
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect: Executes the API call when the component mounts or when the url or options change.
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [url, options]);

    return { data, error, loading };
};

export default useFetch;
