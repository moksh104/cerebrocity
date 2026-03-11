import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB, save } from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "cerebrocity_secret_key_change_in_production";

function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function rowToObject(columns, values) {
    if (!values || values.length === 0) return null;
    const row = values[0];
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
}

function safeUser(user) {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
}

// ──────────────────────────────────────────────
// POST /api/auth/signup
// ──────────────────────────────────────────────
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (username.length < 3) {
            return res.status(400).json({ error: "Username must be at least 3 characters" });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const db = getDB();

        // Check duplicate email
        const existing = db.exec("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
        if (existing.length > 0 && existing[0].values.length > 0) {
            return res.status(409).json({ error: "Email already registered. Try logging in." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user
        db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email.toLowerCase(), hashedPassword]);
        save();

        // Fetch created user
        const result = db.exec("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
        const user = rowToObject(result[0].columns, result[0].values);
        const token = generateToken(user);

        res.status(201).json({
            message: "Welcome to CerebroCity, Commander!",
            token,
            user: safeUser(user),
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const db = getDB();
        const result = db.exec("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = rowToObject(result[0].columns, result[0].values);
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user);

        res.json({
            message: "Welcome back, Commander!",
            token,
            user: safeUser(user),
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error during login" });
    }
});

// ──────────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────────
router.get("/me", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const db = getDB();
        const result = db.exec("SELECT * FROM users WHERE id = ?", [decoded.id]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rowToObject(result[0].columns, result[0].values);
        res.json({ user: safeUser(user) });
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        console.error("Auth check error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
