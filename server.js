import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import loginRoutes from "./routes/login.js"; // Ensure the path is correct
import registerRoutes from "./routes/register.js"; // Import register route
import { authenticateToken } from "./middleware/auth.js"; // Import the auth middleware
import { connectToDatabase } from "./database.js"; //  Import database connection
import adminRoutes from "./routes/admin.js";
import optionsRoutes from "./routes/options.js";
import carsRoutes from "./routes/cars.js"
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


// Test database connection at startup
connectToDatabase()
  .then(() => console.log(" Database ready!"))
  .catch((err) => console.error(" Database connection error:", err));

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Use the login route (this will handle /login)
app.use('/auth', loginRoutes)

app.use("/register", registerRoutes); // Mount register routes

app.use("/admin", adminRoutes);

app.use("/api/options", optionsRoutes)

app.use("/cars", carsRoutes);

app.use("/upload", uploadRoutes);

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
  const { email, name, role } = req.user; // Retrieve user info from the token

  res.json({
    message: "Welcome to your dashboard",
    user: { email, name, role }
  });
});

// Health check endpoint for Kubernetes probes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start Server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});