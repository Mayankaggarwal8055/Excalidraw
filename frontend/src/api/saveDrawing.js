// src/api/drawApi.js

// ✅ Save Drawing
export const saveDrawing = async (userId, shapes) => {
    try {
        const res = await fetch(`http://localhost:4444/api/draw/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // for JWT cookies
            body: JSON.stringify({
                userId,
                shapes,
            }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to save drawing");
        }

        const data = await res.json();
        return data; // { success: true, drawing: {...} }
    } catch (error) {
        console.error("❌ Error in saveDrawing API:", error);
        throw error;
    }
};



// ✅ Get All Drawings for a User
export const getUserDrawings = async (userId) => {

    try {
        const res = await fetch(`http://localhost:4444/api/draw/user/${userId}`, {
            method: "GET",
            credentials: "include", // for JWT cookies
        });


        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to fetch user drawings");
        }

        const data = await res.json();

        return data; // { success: true, drawings: [...] }
    } catch (error) {
        console.error("❌ Error in getUserDrawings API:", error);
        throw error;
    }
};



// ✅ Delete Drawing by ID
export const deleteDrawing = async (drawingId) => {
    try {
        const res = await fetch(`http://localhost:4444/api/draw/${drawingId}`, {
            method: "DELETE",
            credentials: "include", // for JWT cookies
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to delete drawing");
        }

        const data = await res.json();
        return data; // { success: true, deleted: {...} }
    } catch (error) {
        console.error("❌ Error in deleteDrawing API:", error);
        throw error;
    }
};


// ✅ Get Single Drawing by ID
export const getDrawingById = async (drawingId) => {
    try {
        const res = await fetch(`http://localhost:4444/api/draw/${drawingId}`, {
            method: "put",
            credentials: "include", // include JWT cookie
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to fetch drawing by ID");
        }

        const data = await res.json();
        return data; // { success: true, drawing: {...} }
    } catch (error) {
        console.error("❌ Error in getDrawingById API:", error);
        throw error;
    }
};
