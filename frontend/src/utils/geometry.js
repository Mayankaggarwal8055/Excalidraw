export const snapToGridPoint = (point, gridSize) =>
    !gridSize
        ? point
        : {
            x: Math.round(point.x / gridSize) * gridSize,
            y: Math.round(point.y / gridSize) * gridSize,
        };

export const snapShape = (shape, gridSize) => {
    if (!gridSize || gridSize <= 0) return shape;

    switch (shape.type) {
        case "text":
            return {
                ...shape,
                x: Math.round(shape.x / gridSize) * gridSize,
                y: Math.round(shape.y / gridSize) * gridSize,
            };

        case "pen":
            return {
                ...shape,
                path: shape.path.map((p) => snapToGridPoint(p, gridSize)),
            };

        case "rect":
        case "ellipse":
        case "diamond":
        case "line":
        case "arrow":
            return {
                ...shape,
                start: snapToGridPoint(shape.start, gridSize),
                end: snapToGridPoint(shape.end, gridSize),
            };

        default:
            return shape;
    }
};

export const getGridIntersections = (point, gridSize, tolerance = 8) => {
    if (!gridSize || gridSize <= 0) return null;

    const snappedX = Math.round(point.x / gridSize) * gridSize;
    const snappedY = Math.round(point.y / gridSize) * gridSize;

    const distX = Math.abs(point.x - snappedX);
    const distY = Math.abs(point.y - snappedY);

    const result = {
        snappedPoint: { x: snappedX, y: snappedY },
        isNearX: distX <= tolerance,
        isNearY: distY <= tolerance,
        distX,
        distY,
    };

    return result;
};

export const isNearGridLine = (point, gridSize, tolerance = 5) => {
    if (!gridSize || gridSize <= 0) return false;

    const remainder = {
        x: Math.abs(point.x % gridSize),
        y: Math.abs(point.y % gridSize),
    };

    return (
        remainder.x <= tolerance ||
        remainder.x >= gridSize - tolerance ||
        remainder.y <= tolerance ||
        remainder.y >= gridSize - tolerance
    );
};
