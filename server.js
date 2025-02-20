import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import { authenticateToken } from "./middleware/auth.js";
import { connectToDatabase } from "./database.js";
import adminRoutes from "./routes/admin.js";
import optionsRoutes from "./routes/options.js";
import carsRoutes from "./routes/cars.js";
import uploadRoutes from "./routes/upload.js";
import carTechnicalDetailsRoutes from "./routes/carTechnicalDetails.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Test database connection at startup
connectToDatabase()
  .then(() => console.log("Database ready!"))
  .catch((err) => console.error("Database connection error:", err));

const allowedOrigins = [
  "http://localhost:3000",  // Kehitysympäristö
  "http://128.251.126.103", // Backendin julkinen IP
  "http://20.166.243.194",  // Production Frontend URL
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`CORS Request from Origin: ${origin}`);

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    console.warn(`Origin not allowed: ${origin}`);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");

  // Jos tämä on OPTIONS-pyyntö, vastataan tyhjällä 200 OK
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

// Health check endpoint for Kubernetes probes
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
