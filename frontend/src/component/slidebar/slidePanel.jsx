import ColorPicker from "../toolbar/ColorPicker";
import GridToggle from "../toolbar/GridToggle";
import PenSizeSelector from "../toolbar/PenSizeSelector";
import "./SlidePanel.css";


export default function SlidePanel({ tool }) {
    return (
        <aside className={`slidepanel-root${tool ? " visible" : ""}`}>
            <ColorPicker />
            <div className="slidepanel-divider" />
            <PenSizeSelector />
            <div className="slidepanel-divider" />
            <GridToggle />
        </aside>
    );
}
