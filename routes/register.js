import express from "express";
import bcrypt from "bcrypt";
import sql from "mssql";
//import { connectToDatabase } from "../database.js";

const router = express.Router();


// REGISTER NEW USER
router.post("/", async (req, res) => {
  
  const { name, email, phone, password, role = "user", adminKey } = req.body;

  
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const validRoles = ["user", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Prevent unauthorized "admin" account creation
  if (role === "admin" && adminKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Invalid admin key" });
  }

  try {
    const pool = await connectToDatabase();

    // Check if the email is already registered
    const existingUser = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool
      .request()
      .input("Name", sql.NVarChar, name)
      .input("Email", sql.NVarChar, email)
      .input("Phone", sql.NVarChar, phone)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .input("Role", sql.NVarChar, role)
      .query(
        "INSERT INTO Users (Name, Email, Phone, PasswordHash, Role) VALUES (@Name, @Email, @Phone, @PasswordHash, @Role)"
      );

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
