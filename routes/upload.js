import express from "express";
import multer from "multer";
import { uploadImage } from "../upload.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const filename = `${Date.now()}-${req.file.originalname}`;
        const imageUrl = await uploadImage(fileBuffer, filename);
        res.json({ url: imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
