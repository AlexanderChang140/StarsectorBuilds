import { useState, useRef, useCallback } from 'react';

interface UseHoverOpenOptions {
    openDelay?: number;
    closeDelay?: number;
}

export function useHoverOpen({
    openDelay = 0,
    closeDelay = 0,
}: UseHoverOpenOptions = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const clearTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleMouseEnter = useCallback(() => {
        clearTimer();
        if (openDelay > 0) {
            timeoutRef.current = setTimeout(() => setIsOpen(true), openDelay);
        } else {
            setIsOpen(true);
        }
    }, [openDelay]);

    const handleMouseLeave = useCallback(() => {
        clearTimer();
        if (closeDelay > 0) {
            timeoutRef.current = setTimeout(() => setIsOpen(false), closeDelay);
        } else {
            setIsOpen(false);
        }
    }, [closeDelay]);

    const close = useCallback(() => {
        clearTimer();
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        setIsOpen,
        close,
        hoverProps: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
        },
    };
}
