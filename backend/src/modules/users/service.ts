import { makeInsertReturn } from '../../db/helpers/insert.ts';

export function createBuild() {
    
}

export const insertBuild = makeInsertReturn('builds');

export const insertBuildComment = makeInsertReturn('build_comments');
