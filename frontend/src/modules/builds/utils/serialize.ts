import type { PreparedBuild } from '@starsector-builds/shared/builds/types';

import type { BuildState } from '../hooks/useBuildState';

export function serializeBuild(build: BuildState): PreparedBuild {
    return {
        ...build,
        modVersions: Array.from(build.modVersions),
    };
}
