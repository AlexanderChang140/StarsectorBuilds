import type { Image, InsertedImage } from './types.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';

export const insertImage = makeInsertReturn<InsertedImage, Image>('images', [
    'file_hash',
]);
