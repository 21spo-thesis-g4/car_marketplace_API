import express from "express";
import multer from "multer";
import { put } from "@vercel/blob";
import pool from "../database.js"; // Import the existing database connection

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
      console.log("Received body:", req.body);
      console.log("Received file:", req.file);

      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      const { carid, isprimary } = req.body;
      console.log("Extracted carId:", carid, "isPrimary:", isprimary);

      if (!carid) {
          return res.status(400).json({ error: "carId is required" });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      console.log("Uploading file:", fileName);

      // Upload to Vercel Blob Storage
      const blob = await put(fileName, fileBuffer, { access: "public" });
      console.log("Uploaded to blob:", blob.url);

      // Save to PostgreSQL
      const result = await pool.query(
          "INSERT INTO images (carid, url, isprimary) VALUES ($1, $2, $3) RETURNING *",
          [carid, blob.url, isprimary === "true"]
      );
      console.log("Saved to DB:", result.rows[0]);

      return res.json({ image: result.rows[0] });

  } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default router;
