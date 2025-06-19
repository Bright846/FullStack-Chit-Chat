import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/lib/dbConfig.js";
import authRoutes from "./src/routes/authentication.routes.js";
import msgRoutes from "./src/routes/msgRoute.routes.js";
import cookieParser from 'cookie-parser';
import { app, server } from "./src/lib/socket.js";
import path from "path";
// Load environment variables from .env file
dotenv.config();

// Check for required environment variables
if (!process.env.PORT) {
    throw new Error("PORT environment variable is not set.");
}
if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not set.");
}

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

app.use("/api", authRoutes);
app.use("/api/message", msgRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    app.get("/*any", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    })
}

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
