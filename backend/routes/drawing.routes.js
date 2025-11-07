import express from "express";
import { deleteDrawing, drawings, getUserDrawings, updateDrawing } from "../controllers/drawings.controllers.js";
const router = express.Router();


router.post('/save', drawings)
router.get("/user/:userId", getUserDrawings);
router.delete("/:id", deleteDrawing);
router.put("/:id", updateDrawing);


export default router;