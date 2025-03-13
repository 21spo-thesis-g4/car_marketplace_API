import express from "express";
import multer from "multer";
import { put } from "@vercel/blob";
import pool from "../database.js"; // PostgreSQL connection

const router = express.Router();

// Configure multer to store multiple files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { carid } = req.body;
    if (!carid) {
      return res.status(400).json({ error: "carID is required" });
    }

    let uploadedImages = [];

    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = file.originalname;

      // Upload to Vercel Blob Storage
      const blob = await put(fileName, fileBuffer, { access: "public" });

      // Save to PostgreSQL
      const result = await pool.query(
        "INSERT INTO images (carid, url) VALUES ($1, $2) RETURNING *",
        [carid, blob.url]
      );

      uploadedImages.push(result.rows[0]); // Collect uploaded images
    }

    return res.json({ images: uploadedImages });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default router;
