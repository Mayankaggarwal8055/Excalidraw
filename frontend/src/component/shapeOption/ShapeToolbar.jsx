import { useContext } from "react";
import { ToolContext } from "../../context/ToolContext";
import './ShapeToolbar.css'
export default function ShapeToolbar() {
    const { lineStyle, setLineStyle, isRoughMode, setIsRoughMode, isFilled, setIsFilled } = useContext(ToolContext);
    return (
        <div className="shape-toolbar">
            <div className="toolbar-section">
                <label>Style</label>
                <button className={lineStyle === "solid" ? "active" : ""} onClick={() => setLineStyle("solid")}>─</button>
                <button className={lineStyle === "dashed" ? "active" : ""} onClick={() => setLineStyle("dashed")}>- - -</button>
                <button className={lineStyle === "dotted" ? "active" : ""} onClick={() => setLineStyle("dotted")}>· · ·</button>
            </div>
            <div className="toolbar-section">
                <label>Drawing Mode</label>
                <button className={!isRoughMode ? "active" : ""} onClick={() => setIsRoughMode(false)}>Smooth</button>
                <button className={isRoughMode ? "active" : ""} onClick={() => setIsRoughMode(true)}>Rough</button>
            </div>
            <div className="toolbar-section">
                <label>Fill</label>
                <button className={isFilled ? "active" : ""} onClick={() => setIsFilled(!isFilled)}>
                    {isFilled ? "Fill ON" : "Fill OFF"}
                </button>
            </div>
        </div>
    );
}
