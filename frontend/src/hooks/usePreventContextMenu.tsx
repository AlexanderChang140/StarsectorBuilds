import { useEffect, type RefObject } from 'react';

export default function usePreventContextMenu(
    ref: RefObject<HTMLElement | null>,
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const preventContextMenu = (e: MouseEvent) => e.preventDefault();
        el.addEventListener('contextmenu', preventContextMenu);

        return () => el.removeEventListener('contextmenu', preventContextMenu);
    }, [ref]);
}
