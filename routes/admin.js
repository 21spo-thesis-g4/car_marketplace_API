import express from "express";
import pool from "../database.js"; // PostgreSQL-tietokantayhteys
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Admin Dashboard Route (Protected)
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Tarkistetaan, onko käyttäjä admin-tietokannassa
    const result = await pool.query(
      "SELECT role FROM users WHERE userid = $1",
      [req.user.userId]
    );

    if (result.rows.length === 0 || result.rows[0].role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    res.json({ message: "Welcome to the admin dashboard!" });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
