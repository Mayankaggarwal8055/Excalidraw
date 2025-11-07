import { useContext } from "react";
import { ToolContext } from "../../context/ToolContext";

export default function PenSizeSelector() {
    const { lineWidth, setLineWidth } = useContext(ToolContext);

    const sizes = [1, 2, 4, 6, 8, 10, 12];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>
                Stroke Width
            </label>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    title="Adjust line width"
                    style={{ flex: 1, cursor: "pointer" }}
                />
                <span
                    style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        minWidth: "30px",
                        textAlign: "center",
                    }}
                >
                    {lineWidth}px
                </span>
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => setLineWidth(size)}
                        title={`Set width to ${size}px`}
                        style={{
                            width: "32px",
                            height: "32px",
                            border:
                                lineWidth === size ? "2px solid #2196F3" : "1px solid #ccc",
                            borderRadius: "4px",
                            background: lineWidth === size ? "#E3F2FD" : "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: lineWidth === size ? "bold" : "normal",
                            color: lineWidth === size ? "#2196F3" : "#666",
                        }}
                    >
                        <div
                            style={{
                                width: `${Math.min(size, 12)}px`,
                                height: `${Math.min(size, 12)}px`,
                                borderRadius: "2px",
                                background: "#333",
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
