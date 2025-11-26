import type { Image, InsertedImage } from './types.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelect } from '../../db/helpers/select.ts';

export const getImageFromId = makeSelect<Image, Pick<Image, 'id'>>('images', [
    'file_path',
]);

export const insertImage = makeInsertReturn<InsertedImage, Image>('images', [
    'file_hash',
]);
