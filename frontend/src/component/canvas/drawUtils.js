export const drawGrid = (ctx, gridSize, color = "#e0e0e0", opacity = 0.5) => {
    if (!gridSize || gridSize <= 0) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;

    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.restore();
};

export const drawSnapGuides = (ctx, point, gridSize, isSnapped) => {
    if (!isSnapped || !gridSize || gridSize <= 0) return;

    ctx.save();
    ctx.strokeStyle = "#FF6B6B";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.6;

    const canvas = ctx.canvas;

    ctx.beginPath();
    ctx.moveTo(point.x, 0);
    ctx.lineTo(point.x, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, point.y);
    ctx.lineTo(canvas.width, point.y);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
};

export const drawShape = (
    ctx,
    s,
    activeTextId,
    cursorPos,
    cursorVisible,
    lineStyle,
    isRoughMode
) => {
    ctx.beginPath();
    ctx.strokeStyle = s.color || "#000000";
    ctx.lineWidth = s.lineWidth || 2;

    applyLineStyle(ctx, lineStyle);

    if (s.fillColor && s.isFilled) {
        ctx.fillStyle = s.fillColor;
    }

    if (s.rotation) {
        const centerX = (s.start.x + s.end.x) / 2;
        const centerY = (s.start.y + s.end.y) / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(s.rotation);
        ctx.translate(-centerX, -centerY);
    }

    if (isRoughMode) {
        ctx.globalAlpha = 0.95;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }

    switch (s.type) {
        case "line":
            if (isRoughMode) {
                drawRoughLine(ctx, s.start, s.end);
            } else {
                ctx.moveTo(s.start.x, s.start.y);
                ctx.lineTo(s.end.x, s.end.y);
                ctx.stroke();
            }
            break;

        case "rect":
            if (isRoughMode) {
                drawRoughRect(ctx, s.start, s.end, s.isFilled);
            } else {
                if (s.isFilled)
                    ctx.fillRect(s.start.x, s.start.y, s.end.x - s.start.x, s.end.y - s.start.y);
                ctx.strokeRect(s.start.x, s.start.y, s.end.x - s.start.x, s.end.y - s.start.y);
            }
            break;

        case "ellipse": {
            const cx = (s.start.x + s.end.x) / 2;
            const cy = (s.start.y + s.end.y) / 2;
            const rx = Math.abs(s.end.x - s.start.x) / 2;
            const ry = Math.abs(s.end.y - s.start.y) / 2;

            if (isRoughMode) {
                drawRoughEllipse(ctx, cx, cy, rx, ry, s.isFilled);
            } else {
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
                if (s.isFilled) ctx.fill();
                ctx.stroke();
            }
            break;
        }

        case "diamond": {
            const midX = (s.start.x + s.end.x) / 2;
            const midY = (s.start.y + s.end.y) / 2;

            if (isRoughMode) {
                drawRoughDiamond(ctx, s.start, s.end, s.isFilled);
            } else {
                ctx.beginPath();
                ctx.moveTo(midX, s.start.y);
                ctx.lineTo(s.end.x, midY);
                ctx.lineTo(midX, s.end.y);
                ctx.lineTo(s.start.x, midY);
                ctx.closePath();
                if (s.isFilled) ctx.fill();
                ctx.stroke();
            }
            break;
        }

        case "arrow":
            drawArrow(ctx, s.start, s.end, s.color, isRoughMode);
            break;

        case "pen":
            if (s.path?.length) {
                if (isRoughMode) {
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                }
                ctx.moveTo(s.path[0].x, s.path[0].y);
                s.path.forEach((p) => ctx.lineTo(p.x, p.y));
                ctx.stroke();
            }
            break;

        case "text":
            drawText(ctx, s, activeTextId, cursorPos, cursorVisible);
            break;

        default:
            break;
    }

    if (s.rotation) {
        ctx.restore();
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.closePath();
};

const applyLineStyle = (ctx, lineStyle) => {
    switch (lineStyle) {
        case "solid":
            ctx.setLineDash([]);
            break;
        case "dashed":
            ctx.setLineDash([8, 4]);
            break;
        case "dotted":
            ctx.setLineDash([2, 3]);
            break;
        default:
            ctx.setLineDash([]);
    }
};

const drawRoughLine = (ctx, start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / 5);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = start.x + dx * t + (Math.random() - 0.5) * 2;
        const y = start.y + dy * t + (Math.random() - 0.5) * 2;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
};

const drawRoughRect = (ctx, start, end, isFilled) => {
    const offset = 1;

    ctx.beginPath();
    ctx.moveTo(start.x + (Math.random() - 0.5) * offset, start.y + (Math.random() - 0.5) * offset);
    ctx.lineTo(end.x + (Math.random() - 0.5) * offset, start.y + (Math.random() - 0.5) * offset);
    ctx.lineTo(end.x + (Math.random() - 0.5) * offset, end.y + (Math.random() - 0.5) * offset);
    ctx.lineTo(start.x + (Math.random() - 0.5) * offset, end.y + (Math.random() - 0.5) * offset);
    ctx.closePath();

    if (isFilled) ctx.fill();
    ctx.stroke();
};

const drawRoughEllipse = (ctx, cx, cy, rx, ry, isFilled) => {
    ctx.beginPath();
    const steps = Math.ceil((rx + ry) / 2);

    for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const nextAngle = ((i + 1) / steps) * Math.PI * 2;

        const x1 = cx + rx * Math.cos(angle) + (Math.random() - 0.5) * 1;
        const y1 = cy + ry * Math.sin(angle) + (Math.random() - 0.5) * 1;
        const x2 = cx + rx * Math.cos(nextAngle) + (Math.random() - 0.5) * 1;
        const y2 = cy + ry * Math.sin(nextAngle) + (Math.random() - 0.5) * 1;

        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
    ctx.closePath();

    if (isFilled) ctx.fill();
    ctx.stroke();
};

const drawRoughDiamond = (ctx, start, end, isFilled) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offset = 1;

    ctx.beginPath();
    ctx.moveTo(midX + (Math.random() - 0.5) * offset, start.y + (Math.random() - 0.5) * offset);
    ctx.lineTo(end.x + (Math.random() - 0.5) * offset, midY + (Math.random() - 0.5) * offset);
    ctx.lineTo(midX + (Math.random() - 0.5) * offset, end.y + (Math.random() - 0.5) * offset);
    ctx.lineTo(start.x + (Math.random() - 0.5) * offset, midY + (Math.random() - 0.5) * offset);
    ctx.closePath();

    if (isFilled) ctx.fill();
    ctx.stroke();
};

export const drawText = (ctx, t, activeTextId, cursorPos, cursorVisible) => {
    ctx.font = "18px Arial";
    ctx.fillStyle = t.color || "#000000";
    ctx.fillText(t.text, t.x, t.y);

    if (t.id === activeTextId && cursorVisible) {
        const width = ctx.measureText(t.text.slice(0, cursorPos)).width;
        ctx.beginPath();
        ctx.moveTo(t.x + width + 2, t.y - 16);
        ctx.lineTo(t.x + width + 2, t.y + 4);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }
};

export const drawArrow = (ctx, start, end, strokeColor = "#000000", isRoughMode = false) => {
    const headlen = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = strokeColor;

    if (isRoughMode) {
        drawRoughLine(ctx, start, end);
    } else {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    ctx.lineTo(
        end.x - headlen * Math.cos(angle - Math.PI / 6),
        end.y - headlen * Math.sin(angle - Math.PI / 6)
    );

    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
        end.x - headlen * Math.cos(angle + Math.PI / 6),
        end.y - headlen * Math.sin(angle + Math.PI / 6)
    );

    ctx.stroke();
};

export const drawSelectionHandles = (ctx, bbox) => {
    const { x, y, w, h } = bbox;
    const handleSize = 8;

    const handles = [
        { x: x, y: y },
        { x: x + w / 2, y: y },
        { x: x + w, y: y },
        { x: x, y: y + h / 2 },
        { x: x + w, y: y + h / 2 },
        { x: x, y: y + h },
        { x: x + w / 2, y: y + h },
        { x: x + w, y: y + h },
    ];

    ctx.fillStyle = "#4c9aff";
    handles.forEach((handle) => {
        ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
    });

    ctx.fillStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.arc(x + w / 2, y - 30, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#FF6B6B";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y - 30);
    ctx.stroke();
    ctx.setLineDash([]);
};
