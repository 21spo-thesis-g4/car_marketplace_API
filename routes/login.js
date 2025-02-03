import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router(); // Correct way to create a router

// Example users array (replace with actual database)
let users = [
  {
    id: 1,
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10), // Hashing the password for security
    role: "user",
  },
  {
    id: 2,
    email: "admin@example.com",
    password: bcrypt.hashSync("adminpassword", 10),
    role: "admin",
  },
];

//  Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find the user by email
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Validate password
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET, // Ensure JWT_SECRET is in .env
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

export default router; // Correct export syntax for ES Modules
