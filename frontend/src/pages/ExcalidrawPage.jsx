import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Toolbar from "../component/toolbar/Toolbar";
import SlidePanel from "../component/slidebar/slidePanel";
import CanvasApp from "../component/canvas/CanvasApp";
import { getDrawingById } from "../api/saveDrawing";

const ExcalidrawPage = () => {
    const { id } = useParams(); // <== get :id from URL
    const [tool, setTool] = useState(null);
    const [shapes, setShapes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(!!id);

    // load drawing data when route changes
    useEffect(() => {
        const fetchDrawing = async () => {
            if (!id) return; // new blank drawing case
            try {
                const res = await getDrawingById(id);
                console.log(res);
                
                if (res.success && res.drawing?.shapes) {
                    setShapes(res.drawing.shapes);
                    console.log("✅ Loaded drawing:", res.drawing);
                } else {
                    console.warn("⚠️ Drawing not found or missing shapes");
                }
            } catch (error) {
                console.error("❌ Error fetching drawing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrawing();
    }, [id]);

    if (loading) {
        return (
            <div
                style={{
                    color: "#555",
                    textAlign: "center",
                    marginTop: "2rem",
                }}
            >
                Loading drawing...
            </div>
        );
    }

    return (
        <>
            <Toolbar tool={tool} setTool={setTool} shapes={shapes} />
            <SlidePanel tool={tool} />
            <CanvasApp
                tool={tool}
                shapes={shapes}
                setShapes={setShapes}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
        </>
    );
};

export default ExcalidrawPage;
