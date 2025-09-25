const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
    createRecruiter,
    getRecruiters,
    getRecruiterById,
    updateRecruiter,
    deleteRecruiter,
} = require("../controllers/recruiterController");

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createRecruiter);
router.get("/", getRecruiters);
router.get("/:id", getRecruiterById);
router.put("/:id", upload.single("image"), updateRecruiter);
router.delete("/:id", deleteRecruiter);

module.exports = router;
