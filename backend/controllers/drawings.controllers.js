// drawings.controller.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Create
export const drawings = async (req, res) => {
    try {
        const { userId, shapes, title } = req.body || {};
        if (!userId || !uuidRe.test(userId)) {
            return res.status(400).json({ message: "Invalid or missing userId (uuid required)" });
        }
        if (!Array.isArray(shapes) || shapes.length === 0) {
            return res.status(400).json({ message: "Shapes array required" });
        }

        const drawing = await prisma.drawing.create({
            data: {
                userId, // keep as string uuid
                title: title || `Drawing - ${new Date().toLocaleString()}`,
                shapes, // Json column accepts arrays/objects
            },
        });

        return res.status(201).json({ success: true, drawing });
    } catch (error) {
        console.error("Error saving drawing:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// List for a user
export const getUserDrawings = async (req, res) => {


    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid or missing userId (uuid required)" });
        }

        const drawings = await prisma.drawing.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
        });

        return res.status(200).json({ success: true, drawings });
    } catch (error) {
        console.error("Error fetching drawings:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete by id
export const deleteDrawing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !uuidRe.test(id)) {
            return res.status(400).json({ message: "Invalid or missing drawing id (uuid required)" });
        }

        const deleted = await prisma.drawing.delete({ where: { id } });
        return res.status(200).json({ success: true, deleted });
    } catch (error) {
        console.error("Error deleting drawing:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update shapes/title
export const updateDrawing = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !uuidRe.test(id)) {
            return res.status(400).json({ message: "Invalid or missing drawing id (UUID required)" });
        }

        const drawing = await prisma.drawing.findUnique({
            where: { id },
        });

        if (!drawing) {
            return res.status(404).json({ message: "Drawing not found" });
        }

        // Ensure shapes are parsed correctly if stored as JSON string
        let parsedShapes = [];
        try {
            parsedShapes = typeof drawing.shapes === "string" ? JSON.parse(drawing.shapes) : drawing.shapes;
        } catch (err) {
            console.warn("⚠️ Could not parse shapes JSON for drawing:", id);
        }

        return res.status(200).json({
            success: true,
            drawing: {
                id: drawing.id,
                title: drawing.title,
                shapes: parsedShapes || [],
                userId: drawing.userId,
                updatedAt: drawing.updatedAt,
                createdAt: drawing.createdAt,
            },
        });
    } catch (error) {
        console.error("❌ Error fetching drawing:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};