import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectExists } from '../../db/helpers/select.ts';

export const usernameExists = makeSelectExists('users');

export const insertUser = makeInsertReturn('users');

export const insertBuild = makeInsertReturn('builds');

export const insertBuildComment = makeInsertReturn('build_comments')