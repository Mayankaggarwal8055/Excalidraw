import { useRef, useCallback } from "react";

export function useUndoRedo(initialState) {
    const historyRef = useRef({
        past: [],
        present: initialState,
        future: [],
    });

    const pushState = useCallback((newState) => {
        const { present } = historyRef.current;
        if (newState === present) return; // avoid duplicate push
        // push state
        historyRef.current = {
            past: [...historyRef.current.past, present],
            present: newState,
            future: [],
        };
    }, []);


    const undo = useCallback(() => {
        const { past, present, future } = historyRef.current;
        if (past.length === 0) return present;
        const previous = past[past.length - 1];
        historyRef.current = {
            past: past.slice(0, past.length - 1),
            present: previous,
            future: [present, ...future],
        };
        return previous;
    }, []);

    const redo = useCallback(() => {
        const { past, present, future } = historyRef.current;
        if (future.length === 0) return present;
        const next = future[0];
        historyRef.current = {
            past: [...past, present],
            present: next,
            future: future.slice(1),
        };
        return next;
    }, []);

    const canUndo = useCallback(() => historyRef.current.past.length > 0, []);
    const canRedo = useCallback(() => historyRef.current.future.length > 0, []);

    return { pushState, undo, redo, canUndo, canRedo };
}
