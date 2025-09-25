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

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createCounter);
router.get("/", getCounters);
router.put("/:id", upload.single("image"), updateCounter);
router.delete("/:id", deleteCounter);

module.exports = router;
