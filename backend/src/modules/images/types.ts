import type { WithId } from "../../types/generic.ts";

export type Image = WithId<InsertedImage>;
export interface InsertedImage {
    file_path: string;
    file_hash: string;
}
export interface PreparedImage {
    copy_path: string;
    file_hash: string;
}