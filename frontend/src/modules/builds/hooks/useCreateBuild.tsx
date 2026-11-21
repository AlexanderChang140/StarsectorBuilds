import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { buildApiRequest } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

import type { BuildState } from './useBuildState';
import { serializeBuild } from '../utils/serialize';

export function useCreateBuild() {
    const navigate = useNavigate();
    const request = buildApiRequest({ endpoint: '/api/builds' });
    return useMutation({
        mutationFn: (newBuild: BuildState) =>
            fetchSafe<{ buildId: number }>(request, {
                method: 'POST',
                body: JSON.stringify(serializeBuild(newBuild)),
            }),
        //onSuccess: (data) => navigate(`/builds/${data.buildId}`),
    });
}
