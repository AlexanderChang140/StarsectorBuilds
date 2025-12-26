import './PaginationControls.css';
import { clamp } from '../../../utils/math';
import { parseIntOrNaN } from '../../../utils/parse';

interface PaginationControlsProps {
    totalPages: number;
    currPageIndex: number;
    onPageChange: (pageIndex: number) => void;
}

export default function PaginationControls({
    totalPages,
    currPageIndex,
    onPageChange,
}: PaginationControlsProps) {
    const goToPageIndex = (newPageIndex: number) => {
        const clamped = clamp(newPageIndex, 0, totalPages - 1);
        onPageChange(clamped);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const newPage = parseIntOrNaN(data.get('page')?.toString());
        const newPageIndex = Number.isNaN(newPage) ? 1 : newPage - 1;
        goToPageIndex(newPageIndex);
    };

    const indexElements = Array.from({ length: totalPages }, (_, i) => {
        if (i === currPageIndex) {
            return (
                <span key={i + 1} className="current-page-index">
                    {i + 1}
                </span>
            );
        } else {
            return (
                <span key={i + 1} className="button">
                    {i + 1}
                </span>
            );
        }
    });

    return (
        <>
            <div className="controls">
                <button
                    onClick={() => goToPageIndex(0)}
                    disabled={currPageIndex === 0}
                >
                    First
                </button>
                <button
                    onClick={() => goToPageIndex(currPageIndex - 1)}
                    disabled={currPageIndex === 0}
                >
                    Prev
                </button>
                {indexElements}
                <button
                    onClick={() => goToPageIndex(currPageIndex + 1)}
                    disabled={currPageIndex === totalPages - 1}
                >
                    Next
                </button>
                <button
                    onClick={() => goToPageIndex(totalPages - 1)}
                    disabled={currPageIndex === totalPages - 1}
                >
                    Last
                </button>
            </div>
            <form className="go-to-page" onSubmit={handleSubmit}>
                <input name="page" />
                <button>Go</button>
            </form>
        </>
    );
}
