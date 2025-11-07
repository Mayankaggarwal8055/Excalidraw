import { useEffect, useRef } from "react";
import { useCanvasLogic } from "./useCanvasLogic";

export default function CanvasApp({
    tool,
    shapes,
    setShapes,
    selectedId,
    setSelectedId,
}) {
    const canvasRef = useRef(null);

    // Focusable wrapper to receive keyboard events
    const wrapperRef = useRef(null);

    const {
        startDrawing,
        draw,
        stopDrawing,
        onKeyDown,        // new: scoped key handler
        isEditingText,    // new: to drive focus
    } = useCanvasLogic(
        canvasRef,
        tool,
        shapes,
        setShapes,
        selectedId,
        setSelectedId
    );

    // Keep focus on the wrapper when entering text edit so keydown fires
    useEffect(() => {
        if (isEditingText && wrapperRef.current) {
            wrapperRef.current.focus();
        }
    }, [isEditingText]);

    // Optional: keep focus when tool switches to "text"
    useEffect(() => {
        if (tool === "text" && wrapperRef.current) {
            wrapperRef.current.focus();
        }
    }, [tool]);

    return (
        <div
            ref={wrapperRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            style={{ position: "relative", flex: 1, overflow: "hidden", outline: "none" }}
        >
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#fff",
                    display: "block",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
        </div>
    );
}
