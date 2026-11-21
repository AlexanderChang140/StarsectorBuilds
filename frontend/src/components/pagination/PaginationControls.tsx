import { clsx } from 'clsx';

import { clamp } from '@/utils/math';
import { parseIntOrNaN } from '@/utils/parse';

import defaultStyles from './PaginationControls.module.css';

interface PaginationControlsProps {
    totalPages: number;
    siblingCount: number;
    currPageIndex: number;
    onPageChange: (pageIndex: number) => void;
    parentStyles?: Record<string, string>;
}

export default function PaginationControls({
    totalPages,
    siblingCount,
    currPageIndex,
    onPageChange: onPageIndexChange,
    parentStyles = {},
}: PaginationControlsProps) {
    const styles = { ...defaultStyles, ...parentStyles };
    const maxPageIndex = totalPages - 1;

    const goToPageIndex = (newPageIndex: number) => {
        const clamped = clamp(newPageIndex, 0, maxPageIndex);
        onPageIndexChange(clamped);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const newPage = parseIntOrNaN(data.get('page')?.toString());
        const newPageIndex = Number.isNaN(newPage) ? 0 : newPage - 1;
        goToPageIndex(newPageIndex);
    };

    const pageIndexSet = new Set<number>([0, maxPageIndex]);

    const start = currPageIndex - siblingCount;
    const end = currPageIndex + siblingCount;
    for (let i = start; i <= end; i++) {
        pageIndexSet.add(clamp(i, 0, maxPageIndex));
    }

    const elements = [];
    const sortedPages = Array.from(pageIndexSet).sort();

    for (let i = 0; i < sortedPages.length; i++) {
        const page = sortedPages[i];
        const prevPage = sortedPages[i - 1];

        if (prevPage !== undefined && page - prevPage > 1) {
            if (page - prevPage === 2) {
                const missingPage = prevPage + 1;
                elements.push(
                    <button
                        key={missingPage}
                        className={styles.pageButton}
                        onClick={() => goToPageIndex(missingPage)}
                    >
                        {missingPage + 1}
                    </button>,
                );
            } else {
                elements.push(
                    <span key={`e${prevPage}`} className={styles.ellipsis}>
                        ...
                    </span>,
                );
            }
        }
        if (page == currPageIndex) {
            elements.push(<span key={`page-${page}`}>{page + 1}</span>);
        } else {
            elements.push(
                <button
                    key={`page-${page}`}
                    className={styles.pageButton}
                    onClick={() => goToPageIndex(page)}
                >
                    {page + 1}
                </button>,
            );
        }
    }
    return (
        <div className={clsx(styles.pagination)}>
            <div className={styles.controls}>
                <button
                    className={styles.navButton}
                    onClick={() => goToPageIndex(currPageIndex - 1)}
                    disabled={currPageIndex === 0}
                >
                    Prev
                </button>
                {elements}
                <button
                    className={styles.navButton}
                    onClick={() => goToPageIndex(currPageIndex + 1)}
                    disabled={currPageIndex === maxPageIndex}
                >
                    Next
                </button>
            </div>
            <form className={styles.goToPage} onSubmit={handleSubmit}>
                <input className={styles.pageInput} name="page" />
                <button className={styles.goButton}>Go</button>
            </form>
        </div>
    );
}
