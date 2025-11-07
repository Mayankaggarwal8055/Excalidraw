import express from "express";
const router = express.Router();
import { signup, login, me } from "../controllers/auth.controllers.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);


export default router;