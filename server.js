import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import loginRoutes  from "./routes/login.js"; // Ensure the path is correct
import { authenticateToken } from "./middleware/auth.js"; // Import the auth middleware
import { connectToDatabase } from "./database.js"; // ✅ Import database connection

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

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });

// Simulated database
const users = []; // In-memory user storage

// Routes

app.get('/register', (req, res) => {
  res.send('Register endpoint is working. Use POST to create an account.');
});

// CREATE ACCOUNT (POST /register)
app.post('/register', async (req, res) => {
    const { email, password, role = "user", adminKey } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate role
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if the email is already registered
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    // Prevent arbitrary admin registration
    if (role === "admin" && adminKey !== process.env.ADMIN_SECRET) {
      console.log('Admin Secret:', process.env.ADMIN_SECRET);
        return res.status(403).json({ message: 'Invalid admin key' });
    }
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = { id: users.length + 1, email, password: hashedPassword, role };
        users.push(newUser);

        res.status(201).json({ message: 'Account created successfully', userId: newUser.id, role: newUser.role });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
