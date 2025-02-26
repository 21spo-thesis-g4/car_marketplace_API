import express from "express";
import multer from "multer";
import { uploadImage } from "../upload.js";

const router = express.Router();
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimikoko 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    }
});

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileBuffer = req.file.buffer;
        const filename = `${Date.now()}-${req.file.originalname}`;
        const imageUrl = await uploadImage(fileBuffer, filename);

        res.json({ url: imageUrl });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
