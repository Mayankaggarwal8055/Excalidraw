import { useState, useEffect, useRef, useContext } from "react";
import { ToolContext } from "../../context/ToolContext";
import {
    drawShape,
    drawSelectionHandles,
    drawGrid,
    drawSnapGuides,
} from "./drawUtils";
import {
    pointInShape,
    translateShape,
    findTopmostTextAt,
    getCursorIndexAtX,
    getBBox,
    getHandleAtPos,
    applyResize,
    applyRotation,
} from "./canvasHelpers";
import { snapToGridPoint, snapShape } from "../../utils/geometry";
import { useUndoRedo } from "../../hooks/useUndoRedo";

export const useCanvasLogic = (
    canvasRef,
    tool,
    shapes,
    setShapes,
    selectedId,
    setSelectedId
) => {
    const idRef = useRef(1);
    const {
        color,
        fillColor,
        lineWidth,
        isFilled,
        lineStyle,
        isRoughMode,
        snapToGrid,
        gridSize,
        showGrid,
    } = useContext(ToolContext);

    const [isDrawing, setIsDrawing] = useState(false);
    const [start, setStart] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);

    // Text editing state
    const [activeTextId, setActiveTextId] = useState(null);
    const [cursorPos, setCursorPos] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);

    const [dragId, setDragId] = useState(null);
    const [lastPos, setLastPos] = useState(null);

    const [resizingHandle, setResizingHandle] = useState(null);
    const [rotatingShapeId, setRotatingShapeId] = useState(null);

    const [showSnapGuides, setShowSnapGuides] = useState(false);
    const [snapGuidePoint, setSnapGuidePoint] = useState(null);

    const { pushState, undo, redo, canUndo, canRedo } = useUndoRedo(shapes);

    // Prevent pushing duplicate states by storing last pushed JSON
    const lastPushedRef = useRef("");

    const pushUniqueState = (newState) => {
        const newStateJson = JSON.stringify(newState);
        if (newStateJson !== lastPushedRef.current) {
            pushState(newState);
            lastPushedRef.current = newStateJson;
        }
    };

    // Blink cursor for text input
    useEffect(() => {
        if (!activeTextId) return;
        const interval = setInterval(() => {
            setCursorVisible((v) => !v);
        }, 500);
        return () => clearInterval(interval);
    }, [activeTextId]);

    // Drawing updated canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (showGrid) {
            drawGrid(ctx, gridSize);
        }

        shapes.forEach((s) =>
            drawShape(ctx, s, activeTextId, cursorPos, cursorVisible, lineStyle, isRoughMode)
        );

        if (showSnapGuides && snapGuidePoint) {
            drawSnapGuides(ctx, snapGuidePoint, gridSize, true);
        }

        if (dragId !== null) {
            const sel = shapes.find((s) => s.id === dragId);
            if (sel) {
                const { x, y, w, h } = getBBox(sel, ctx);
                ctx.save();
                ctx.setLineDash([6, 4]);
                ctx.strokeStyle = "#4c9aff";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
                ctx.restore();
            }
        }

        if (selectedId !== null && dragId !== selectedId) {
            const sel = shapes.find((s) => s.id === selectedId);
            if (sel) {
                const { x, y, w, h } = getBBox(sel, ctx);
                ctx.save();
                ctx.setLineDash([3, 3]);
                ctx.strokeStyle = "#ff9800";
                ctx.lineWidth = 2;
                ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
                ctx.restore();

                drawSelectionHandles(ctx, { x, y, w, h });
            }
        }
    }, [
        shapes,
        activeTextId,
        cursorPos,
        cursorVisible,
        dragId,
        selectedId,
        lineStyle,
        isRoughMode,
        showGrid,
        gridSize,
        showSnapGuides,
        snapGuidePoint,
    ]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        let pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (snapToGrid && gridSize > 0) {
            pos = snapToGridPoint(pos, gridSize);
            setShowSnapGuides(true);
            setSnapGuidePoint(pos);
        } else {
            setShowSnapGuides(false);
        }

        return pos;
    };

    const startDrawing = (e) => {
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext("2d");

        if (selectedId !== null && tool !== "text") {
            const selectedShape = shapes.find((s) => s.id === selectedId);
            if (selectedShape) {
                const bbox = getBBox(selectedShape, ctx);
                const hitHandle = getHandleAtPos(pos, bbox);

                if (hitHandle) {
                    if (hitHandle.type === "rotate") {
                        setRotatingShapeId(selectedId);
                        setLastPos(pos);
                        setShowSnapGuides(false);
                        return;
                    } else {
                        setResizingHandle({ shapeId: selectedId, handle: hitHandle });
                        setLastPos(pos);
                        setShowSnapGuides(false);
                        return;
                    }
                }
            }
        }

        if (tool === "text") {
            const hitText = findTopmostTextAt(ctx, pos, shapes);
            if (hitText) {
                if (e.detail >= 2) {
                    ctx.font = "18px Arial";
                    const caretPos = getCursorIndexAtX(ctx, hitText.text || "", hitText.x, pos.x);
                    setActiveTextId(hitText.id);
                    setCursorPos(caretPos);
                } else {
                    setActiveTextId(null);
                    setSelectedId(null);
                    setDragId(hitText.id);
                    setLastPos(pos);
                }
                setShowSnapGuides(false);
                return;
            }

            setActiveTextId(null);
            setSelectedId(null);
            const newId = idRef.current++;
            const newShape = {
                id: newId,
                type: "text",
                x: pos.x,
                y: pos.y,
                text: "",
                color,
                lineWidth,
            };
            setShapes([...shapes, newShape]);
            pushUniqueState([...shapes, newShape]);
            setActiveTextId(newId);
            setCursorPos(0);
            setShowSnapGuides(false);
            return;
        }

        setActiveTextId(null);

        for (let i = shapes.length - 1; i >= 0; i--) {
            if (pointInShape(ctx, shapes[i], pos)) {
                setSelectedId(shapes[i].id);
                setDragId(shapes[i].id);
                setLastPos(pos);
                setShowSnapGuides(false);
                return;
            }
        }

        setSelectedId(null);
        setIsDrawing(true);
        setStart(pos);

        if (tool === "pen") {
            setCurrentPath([pos]);
        } else if (tool) {
            const newShape = {
                id: idRef.current++,
                type: tool,
                start: pos,
                end: pos,
                color,
                fillColor,
                isFilled,
                lineWidth,
                lineStyle,
                isRoughMode,
            };
            const newShapes = [...shapes, newShape];
            setShapes(newShapes);
            pushUniqueState(newShapes);
        }
        setShowSnapGuides(false);
    };

    const draw = (e) => {
        const pos = getPos(e);

        if (resizingHandle && lastPos) {
            const newShapes = shapes.map((s) => {
                if (s.id !== resizingHandle.shapeId) return s;
                const bbox = getBBox(s, canvasRef.current.getContext("2d"));
                return applyResize(s, bbox, resizingHandle.handle, lastPos, pos);
            });
            setShapes(newShapes);
            setLastPos(pos);
            return;
        }

        if (rotatingShapeId !== null && lastPos) {
            const newShapes = shapes.map((s) => {
                if (s.id !== rotatingShapeId) return s;
                const bbox = getBBox(s, canvasRef.current.getContext("2d"));
                return applyRotation(s, bbox, lastPos, pos);
            });
            setShapes(newShapes);
            setLastPos(pos);
            return;
        }

        if (dragId !== null && lastPos) {
            const dx = pos.x - lastPos.x;
            const dy = pos.y - lastPos.y;
            setShapes((prev) =>
                prev.map((s) => (s.id === dragId ? translateShape(s, dx, dy) : s))
            );
            setLastPos(pos);
            return;
        }

        if (!isDrawing || tool === "text") return;

        if (tool === "pen") {
            setCurrentPath((prev) => [...prev, pos]);
            return;
        }

        setShapes((prev) => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, end: pos }];
        });
    };

    const stopDrawing = (e) => {
        if (resizingHandle) {
            const finalShapes = shapes.map((s) =>
                snapToGrid && gridSize > 0 ? snapShape(s, gridSize) : s
            );
            setShapes(finalShapes);
            pushUniqueState(finalShapes);
            setResizingHandle(null);
            setLastPos(null);
            setShowSnapGuides(false);
            return;
        }

        if (rotatingShapeId !== null) {
            pushUniqueState(shapes);
            setRotatingShapeId(null);
            setLastPos(null);
            setShowSnapGuides(false);
            return;
        }

        if (dragId !== null) {
            const finalShapes = shapes.map((s) =>
                snapToGrid && gridSize > 0 ? snapShape(s, gridSize) : s
            );
            setShapes(finalShapes);
            pushUniqueState(finalShapes);
            setDragId(null);
            setLastPos(null);
            setShowSnapGuides(false);
            return;
        }

        if (!isDrawing) return;

        const pos = getPos(e);

        if (tool === "pen") {
            let path = currentPath;
            if (snapToGrid && gridSize > 0) {
                path = path.map((p) => snapToGridPoint(p, gridSize));
            }

            const newShapes = [
                ...shapes,
                {
                    id: idRef.current++,
                    type: "pen",
                    path,
                    color,
                    fillColor,
                    isFilled,
                    lineWidth,
                    lineStyle,
                    isRoughMode,
                },
            ];
            setShapes(newShapes);
            pushUniqueState(newShapes);
            setCurrentPath([]);
        } else {
            setShapes((prev) => {
                if (prev.length === 0) return prev;
                let last = prev[prev.length - 1];

                if (snapToGrid && gridSize > 0) {
                    last = snapShape(last, gridSize);
                }

                const newShapes = [...prev.slice(0, -1), last];
                pushUniqueState(newShapes);
                return newShapes;
            });
        }

        setIsDrawing(false);
        setStart(null);
        setShowSnapGuides(false);

        console.log("✅ Final shapes data:", JSON.stringify(shapes, null, 2));
        // localStorage.setItem("drawingData", JSON.stringify(shapes));
    };

    // Keyboard event handler for undo/redo, text editing, delete, duplicate
    useEffect(() => {
        const onKey = (e) => {
            // Undo
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                if (canUndo()) {
                    setShapes(undo());
                    setActiveTextId(null);
                    setSelectedId(null);
                }
                return;
            }
            // Redo
            if (
                (e.ctrlKey || e.metaKey) &&
                ((e.key === "z" && e.shiftKey) || e.key === "y")
            ) {
                e.preventDefault();
                if (canRedo()) {
                    setShapes(redo());
                    setActiveTextId(null);
                    setSelectedId(null);
                }
                return;
            }
            // Delete shape
            if (e.key === "Delete" && selectedId !== null && !activeTextId) {
                e.preventDefault();
                const newShapes = shapes.filter((s) => s.id !== selectedId);
                setShapes(newShapes);
                pushUniqueState(newShapes);
                setSelectedId(null);
                return;
            }
            // Duplicate shape
            if ((e.ctrlKey || e.metaKey) && e.key === "d") {
                e.preventDefault();
                if (selectedId !== null && !activeTextId) {
                    const shapeToClone = shapes.find((s) => s.id === selectedId);
                    if (shapeToClone) {
                        const clonedShape = { ...shapeToClone, id: idRef.current++ };
                        if (shapeToClone.type === "text") {
                            clonedShape.x += 15;
                            clonedShape.y += 15;
                        } else if (
                            ["rect", "ellipse", "diamond", "line", "arrow"].includes(
                                shapeToClone.type
                            )
                        ) {
                            clonedShape.start = {
                                x: shapeToClone.start.x + 15,
                                y: shapeToClone.start.y + 15,
                            };
                            clonedShape.end = {
                                x: shapeToClone.end.x + 15,
                                y: shapeToClone.end.y + 15,
                            };
                        } else if (shapeToClone.type === "pen") {
                            clonedShape.path = shapeToClone.path.map((p) => ({
                                x: p.x + 15,
                                y: p.y + 15,
                            }));
                        }
                        const newShapes = [...shapes, clonedShape];
                        setShapes(newShapes);
                        pushUniqueState(newShapes);
                        setSelectedId(clonedShape.id);
                    }
                }
                return;
            }

            // Text editing keys
            if (!activeTextId) return;
            const idx = shapes.findIndex((s) => s.id === activeTextId);
            if (idx === -1) return;
            const textShape = shapes[idx];
            if (textShape.type !== "text") return;

            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                const before = textShape.text.slice(0, cursorPos);
                const after = textShape.text.slice(cursorPos);
                const updated = { ...textShape, text: before + e.key + after };
                const newShapes = [...shapes.slice(0, idx), updated, ...shapes.slice(idx + 1)];
                setShapes(newShapes);
                pushUniqueState(newShapes);
                setCursorPos(cursorPos + 1);
            } else if (e.key === "Backspace" && cursorPos > 0) {
                e.preventDefault();
                const before = textShape.text.slice(0, cursorPos - 1);
                const after = textShape.text.slice(cursorPos);
                const updated = { ...textShape, text: before + after };
                const newShapes = [...shapes.slice(0, idx), updated, ...shapes.slice(idx + 1)];
                setShapes(newShapes);
                pushUniqueState(newShapes);
                setCursorPos(cursorPos - 1);
            } else if (e.key === "Delete" && cursorPos < textShape.text.length) {
                e.preventDefault();
                const before = textShape.text.slice(0, cursorPos);
                const after = textShape.text.slice(cursorPos + 1);
                const updated = { ...textShape, text: before + after };
                const newShapes = [...shapes.slice(0, idx), updated, ...shapes.slice(idx + 1)];
                setShapes(newShapes);
                pushUniqueState(newShapes);
            } else if (e.key === "ArrowLeft" && cursorPos > 0) {
                setCursorPos(cursorPos - 1);
            } else if (e.key === "ArrowRight" && cursorPos < textShape.text.length) {
                setCursorPos(cursorPos + 1);
            } else if (e.key === "Enter") {
                setActiveTextId(null);
                setSelectedId(null);
            }
        };
        window.addEventListener("keydown", onKey);

        return () => window.removeEventListener("keydown", onKey);
    }, [
        shapes,
        activeTextId,
        cursorPos,
        pushState,
        undo,
        redo,
        canUndo,
        canRedo,
        selectedId,
    ]);

    return {
        startDrawing,
        draw,
        stopDrawing,
    };
};
