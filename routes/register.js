import express from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";

const router = express.Router();

// REGISTER NEW USER
router.post("/", async (req, res) => {
  const { name, email, phone, password, role = "user", adminkey } = req.body;

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const validRoles = ["user", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Prevent unauthorized "admin" account creation
  if (role === "admin" && adminkey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Invalid admin key" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query(
      "INSERT INTO users (name, email, phone, passwordhash, role) VALUES ($1, $2, $3, $4, $5)",
      [name, email, phone, hashedPassword, role]
    );

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
