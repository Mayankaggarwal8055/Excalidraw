import { createContext, useState } from "react";

export const ToolContext = createContext();

export const ToolContextProvider = ({ children }) => {
    const [color, setColor] = useState("#000000");
    const [fillColor, setFillColor] = useState("#ffffff");
    const [lineWidth, setLineWidth] = useState(2);
    const [tool, setTool] = useState("pen");
    const [isFilled, setIsFilled] = useState(false);
    const [lineStyle, setLineStyle] = useState("solid");
    const [isRoughMode, setIsRoughMode] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [gridSize, setGridSize] = useState(20);

    return (
        <ToolContext.Provider
            value={{
                color,
                setColor,
                fillColor,
                setFillColor,
                lineWidth,
                setLineWidth,
                tool,
                setTool,
                isFilled,
                setIsFilled,
                lineStyle,
                setLineStyle,
                isRoughMode,
                setIsRoughMode,
                showGrid,
                setShowGrid,
                snapToGrid,
                setSnapToGrid,
                gridSize,
                setGridSize,
            }}
        >
            {children}
        </ToolContext.Provider>
    );
};
