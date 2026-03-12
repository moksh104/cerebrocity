import express from "express";
import cors from "cors";
import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: [process.env.API_URL, "http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (_, res) => {
    res.json({ status: "online", message: "CerebroCity Server v1.0" });
});

// Initialize DB then start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n⚡ CerebroCity Server running on http://localhost:${PORT}`);
        console.log(`   POST /api/auth/signup`);
        console.log(`   POST /api/auth/login`);
        console.log(`   GET  /api/auth/me\n`);
    });
});
