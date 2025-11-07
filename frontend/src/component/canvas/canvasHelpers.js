export const pointInShape = (ctx, s, pos) => {
    if (s.type === "text") {
        ctx.font = "18px Arial";
        const width = ctx.measureText(s.text || "").width;
        const height = 20;
        return (
            pos.x >= s.x &&
            pos.x <= s.x + width &&
            pos.y <= s.y &&
            pos.y >= s.y - height
        );
    }

    const path = buildPath(s);
    ctx.lineWidth = s.lineWidth || 2;

    if (s.type === "rect" || s.type === "ellipse" || s.type === "diamond") {
        return ctx.isPointInPath(path, pos.x, pos.y);
    }

    return ctx.isPointInStroke(path, pos.x, pos.y);
};

export const buildPath = (s) => {
    const p = new Path2D();
    switch (s.type) {
        case "rect":
            p.rect(s.start.x, s.start.y, s.end.x - s.start.x, s.end.y - s.start.y);
            break;

        case "ellipse": {
            const cx = (s.start.x + s.end.x) / 2;
            const cy = (s.start.y + s.end.y) / 2;
            const rx = Math.abs(s.end.x - s.start.x) / 2;
            const ry = Math.abs(s.end.y - s.start.y) / 2;
            p.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            break;
        }

        case "diamond": {
            const midX = (s.start.x + s.end.x) / 2;
            const midY = (s.start.y + s.end.y) / 2;
            p.moveTo(midX, s.start.y);
            p.lineTo(s.end.x, midY);
            p.lineTo(midX, s.end.y);
            p.lineTo(s.start.x, midY);
            p.closePath();
            break;
        }

        case "line":
        case "arrow":
            p.moveTo(s.start.x, s.start.y);
            p.lineTo(s.end.x, s.end.y);
            break;

        case "pen":
            if (s.path?.length) {
                p.moveTo(s.path[0].x, s.path[0].y);
                s.path.forEach((pt) => p.lineTo(pt.x, pt.y));
            }
            break;

        default:
            break;
    }
    return p;
};

export const translateShape = (s, dx, dy) => {
    switch (s.type) {
        case "rect":
        case "ellipse":
        case "diamond":
        case "line":
        case "arrow":
            return {
                ...s,
                start: { x: s.start.x + dx, y: s.start.y + dy },
                end: { x: s.end.x + dx, y: s.end.y + dy },
            };
        case "pen":
            return { ...s, path: s.path.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
        case "text":
            return { ...s, x: s.x + dx, y: s.y + dy };
        default:
            return s;
    }
};

export const findTopmostTextAt = (ctx, pos, shapes) => {
    ctx.font = "18px Arial";
    for (let i = shapes.length - 1; i >= 0; i--) {
        const s = shapes[i];
        if (s.type !== "text") continue;
        const width = ctx.measureText(s.text || "").width;
        const height = 20;
        const hit =
            pos.x >= s.x &&
            pos.x <= s.x + width &&
            pos.y <= s.y &&
            pos.y >= s.y - height;
        if (hit) return s;
    }
    return null;
};

export const getCursorIndexAtX = (ctx, text, xStart, clickX) => {
    const target = Math.max(0, clickX - xStart);
    let acc = 0;
    for (let i = 0; i < text.length; i++) {
        const w = ctx.measureText(text[i]).width;
        if (acc + w / 2 >= target) return i;
        acc += w;
    }
    return text.length;
};

export const getBBox = (s, ctx) => {
    if (s.type === "text") {
        ctx.font = "18px Arial";
        const width = ctx.measureText(s.text || "").width;
        return { x: s.x, y: s.y - 18, w: width, h: 20 };
    }
    if (s.type === "pen") {
        const xs = s.path.map((p) => p.x);
        const ys = s.path.map((p) => p.y);
        return {
            x: Math.min(...xs),
            y: Math.min(...ys),
            w: Math.max(...xs) - Math.min(...xs),
            h: Math.max(...ys) - Math.min(...ys),
        };
    }
    const minX = Math.min(s.start.x, s.end.x);
    const minY = Math.min(s.start.y, s.end.y);
    return {
        x: minX,
        y: minY,
        w: Math.abs(s.end.x - s.start.x),
        h: Math.abs(s.end.y - s.start.y),
    };
};

export const getResizeHandles = (bbox) => {
    const { x, y, w, h } = bbox;
    const handleSize = 8;

    return {
        topLeft: { x: x - handleSize / 2, y: y - handleSize / 2, type: "corner", dir: "TL" },
        topRight: { x: x + w + handleSize / 2, y: y - handleSize / 2, type: "corner", dir: "TR" },
        bottomLeft: { x: x - handleSize / 2, y: y + h + handleSize / 2, type: "corner", dir: "BL" },
        bottomRight: { x: x + w + handleSize / 2, y: y + h + handleSize / 2, type: "corner", dir: "BR" },
        top: { x: x + w / 2, y: y - handleSize / 2, type: "edge", dir: "T" },
        bottom: { x: x + w / 2, y: y + h + handleSize / 2, type: "edge", dir: "B" },
        left: { x: x - handleSize / 2, y: y + h / 2, type: "edge", dir: "L" },
        right: { x: x + w + handleSize / 2, y: y + h / 2, type: "edge", dir: "R" },
        rotate: { x: x + w / 2, y: y - 30, type: "rotate", dir: "ROT" },
    };
};

export const getHandleAtPos = (pos, bbox, handleSize = 10) => {
    const handles = getResizeHandles(bbox);

    for (const [key, handle] of Object.entries(handles)) {
        const dx = pos.x - handle.x;
        const dy = pos.y - handle.y;
        if (dx * dx + dy * dy <= handleSize * handleSize) {
            return { handle: key, ...handle };
        }
    }
    return null;
};

export const applyResize = (shape, bbox, handle, oldPos, newPos) => {
    const dx = newPos.x - oldPos.x;
    const dy = newPos.y - oldPos.y;

    let newStart = { ...shape.start };
    let newEnd = { ...shape.end };

    const minW = 20,
        minH = 20;

    switch (handle.dir) {
        case "TL":
            newStart = { x: newStart.x + dx, y: newStart.y + dy };
            break;
        case "TR":
            newStart.y += dy;
            newEnd.x += dx;
            break;
        case "BL":
            newStart.x += dx;
            newEnd.y += dy;
            break;
        case "BR":
            newEnd = { x: newEnd.x + dx, y: newEnd.y + dy };
            break;
        case "T":
            newStart.y += dy;
            break;
        case "B":
            newEnd.y += dy;
            break;
        case "L":
            newStart.x += dx;
            break;
        case "R":
            newEnd.x += dx;
            break;
    }

    if (
        Math.abs(newEnd.x - newStart.x) < minW ||
        Math.abs(newEnd.y - newStart.y) < minH
    ) {
        return shape;
    }

    return { ...shape, start: newStart, end: newEnd };
};

export const applyRotation = (shape, bbox, oldPos, newPos) => {
    const centerX = (shape.start.x + shape.end.x) / 2;
    const centerY = (shape.start.y + shape.end.y) / 2;

    const oldAngle = Math.atan2(oldPos.y - centerY, oldPos.x - centerX);
    const newAngle = Math.atan2(newPos.y - centerY, newPos.x - centerX);
    const deltaAngle = newAngle - oldAngle;

    return {
        ...shape,
        rotation: (shape.rotation || 0) + deltaAngle,
    };
};

export const rotatePoint = (point, center, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = point.x - center.x;
    const y = point.y - center.y;
    return {
        x: center.x + x * cos - y * sin,
        y: center.y + x * sin + y * cos,
    };
};
