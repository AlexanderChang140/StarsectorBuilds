import { useEffect } from 'react';

interface UseURLBuildDataProps {
    buildData: unknown;
    searchParams: URLSearchParams;
}

export default function useURLBuildData({
    buildData,
    searchParams,
}: UseURLBuildDataProps) {
    useEffect(() => {}, [buildData, searchParams]);
}
