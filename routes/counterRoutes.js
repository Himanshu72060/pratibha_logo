const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");


const {
    createCounter,
    getCounters,
    updateCounter,
    deleteCounter,
} = require("../controllers/counterController");

// Multer setup for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createCounter);
router.get("/", getCounters);
router.put("/:id", upload.single("image"), updateCounter);
router.delete("/:id", deleteCounter);

module.exports = router;
