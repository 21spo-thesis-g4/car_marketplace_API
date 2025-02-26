import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Hae käyttäjä tietokannasta
    const userResult = await pool.query(
      "SELECT userid, name, email, phone, passwordhash, role FROM users WHERE email = $1",
      [email]
    );


    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = userResult.rows[0]; // PostgreSQL käyttää `rows`

    // Tarkista salasana
    const passwordMatch = await bcrypt.compare(password, user.passwordhash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Luo JWT-token
    const token = jwt.sign(
      {
        userId: user.userid,
        role: user.role,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { id: user.userid, name: user.name, role: user.role, email: user.email }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
