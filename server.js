import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./database.js"; // PostgreSQL-yhteys
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import { authenticateToken } from "./middleware/auth.js";
import adminRoutes from "./routes/admin.js";
import optionsRoutes from "./routes/options.js";
import carsRoutes from "./routes/cars.js";
import uploadRoutes from "./routes/upload.js";
import carTechnicalDetailsRoutes from "./routes/carTechnicalDetails.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Sallitut frontend-alkuperät
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-production-frontend.com"
];

// CORS-middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    console.warn(`🚨 Origin not allowed: ${origin}`);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// API Routes
app.use("/auth", loginRoutes);
app.use("/register", registerRoutes);
app.use("/admin", adminRoutes);
app.use("/api/options", optionsRoutes);
app.use("/cars", carsRoutes);
app.use("/upload", uploadRoutes);
app.use("/carTechnicalDetails", carTechnicalDetailsRoutes);

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  const { email, name, role } = req.user;
  res.json({
    message: "Welcome to your dashboard",
    user: { email, name, role },
  });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.status(200).send("OK - Database Connected");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).send("Database Connection Error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
