// authapi.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export const signup = async (req, res) => {
    try {
        const { userData } = req.body;
        const { name, email, password } = userData || {};
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await prisma.userRecord.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);

        const userRecord = await prisma.userRecord.create({
            data: { name, email, password: hashed },
        });

        const token = jwt.sign({ userId: userRecord.id }, JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 86400000,
        });

        const user = await prisma.userRecord.findUnique({
            where: { id: userRecord.id },
            select: { id: true, name: true, email: true },
        });

        return res.status(201).json({ user, message: "Signup successful" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message || "Signup failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        const user = await prisma.userRecord.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User not registered. Please sign up first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 86400000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
};

export const me = async (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        const user = await prisma.userRecord.findUnique({
            where: { id: verified.userId },
            select: { id: true, name: true, email: true },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ user });
    } catch {
        return res.status(401).json({ error: "Invalid token or user not found" });
    }
};
