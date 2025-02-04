import express from "express";
import { authorizeRole } from "../middleware/authorize.js";
import { authenticateToken } from "../middleware/auth.js"; // Ensure user is logged in

const router = express.Router();

// Admin Dashboard Route (Protected)
router.get("/dashboard", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  res.json({ message: "Welcome to the admin dashboard!" });
});

export default router;