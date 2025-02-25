import express from "express";
import bcrypt from "bcrypt";
//import sql from "mssql";
import jwt from "jsonwebtoken";
//import { connectToDatabase } from "../database.js";
import pool from "../database.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    //const pool = await connectToDatabase();

    const userResult = await pool.query(
      "SELECT userid, name, email, phone, passwordhash, role FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = userResult.recordset[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.UserID, 
        role: user.Role, 
        email: user.Email,
        name: user.Name  
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: { id: user.UserID, name: user.Name, role: user.Role, email: user.Email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
