import { useEffect } from 'react';

export default function useLogMount() {
    useEffect(() => {
        console.log('mounted');
        return () => console.log('unmounted');
    }, []);
}
