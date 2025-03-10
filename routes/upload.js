import express from "express";
import multer from "multer";
import { put } from "@vercel/blob";

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Upload the image to Vercel Blob Storage
    const blob = await put(fileName, fileBuffer, {
      access: "public",
    });

    return res.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
