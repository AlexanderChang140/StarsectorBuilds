export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type SortOrder = 'ASC' | 'DESC' | '';

export type Entries<T> = [keyof T, T[keyof T]][];