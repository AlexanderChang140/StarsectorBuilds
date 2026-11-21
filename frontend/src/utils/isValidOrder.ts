import type { Order } from '@/api/types';

export function isValidOrder(sort: string | null): sort is Order {
    return sort !== null && ['DESC', 'ASC'].includes(sort);
}
