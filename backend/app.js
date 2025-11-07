import express from "express";
import cors from 'cors';
const app = express();
const PORT = 4444;
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes.js";
import drawingRoutes from './routes/drawing.routes.js';

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://excalidraw-eight-mu.vercel.app/"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use('/api/draw', drawingRoutes)



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})