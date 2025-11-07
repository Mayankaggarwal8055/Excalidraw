import { useContext } from "react";
import { ToolContext } from "../../context/ToolContext";

export default function ColorPicker() {
    const { color, setColor, fillColor, setFillColor, isFilled, setIsFilled } =
        useContext(ToolContext);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>
                    Stroke
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        title="Stroke color"
                        style={{
                            width: "40px",
                            height: "40px",
                            border: "2px solid #ddd",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    />
                    <span style={{ fontSize: "12px", color: "#666" }}>{color}</span>
                </div>
            </div>

            <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>
                    Fill
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                    <input
                        type="checkbox"
                        checked={isFilled}
                        onChange={(e) => setIsFilled(e.target.checked)}
                        title="Enable fill"
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <input
                        type="color"
                        value={fillColor}
                        onChange={(e) => setFillColor(e.target.value)}
                        disabled={!isFilled}
                        title="Fill color"
                        style={{
                            width: "40px",
                            height: "40px",
                            border: isFilled ? "2px solid #ddd" : "2px solid #eee",
                            borderRadius: "6px",
                            cursor: isFilled ? "pointer" : "not-allowed",
                            opacity: isFilled ? 1 : 0.5,
                        }}
                    />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                        {isFilled ? fillColor : "Off"}
                    </span>
                </div>
            </div>
        </div>
    );
}
