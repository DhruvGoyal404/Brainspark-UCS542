import { useState, useEffect } from 'react';

/**
 * Debounce a rapidly-changing value.
 * The returned value only updates after `delay` ms of silence.
 *
 * @param {*}      value  - the value to debounce (usually a search string)
 * @param {number} delay  - ms to wait before accepting the new value (default 350)
 * @returns debounced value
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 350);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 350) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
