import { useContext } from "react";
import { ToolContext } from "../../context/ToolContext";
import "./GridToggle.css";

export default function GridToggle() {
    const { showGrid, setShowGrid, snapToGrid, setSnapToGrid, gridSize, setGridSize } =
        useContext(ToolContext);

    return (
        <div className="grid-toggle">
            <label className="toolbar-label">Grid</label>
            <button
                onClick={() => setShowGrid(!showGrid)}
                className={`grid-button ${showGrid ? "active" : ""}`}
                title="Grid"
            >
                {showGrid ? "On" : "Off"}
            </button>
            <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`snap-button ${snapToGrid ? "active" : ""}`}
                title="Snap"
            >
                {snapToGrid ? "Snap" : "Free"}
            </button>
            {(showGrid || snapToGrid) && (
                <div className="grid-size-control">
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={gridSize}
                        onChange={(e) => setGridSize(Number(e.target.value))}
                        className="grid-size-slider"
                    />
                    <span className="grid-size-value">{gridSize}px</span>
                </div>
            )}
        </div>
    );
}
