import { makeInsertReturn } from '../../db/helpers/insert.ts';

export const insertImage = makeInsertReturn('images', ['file_hash']);
