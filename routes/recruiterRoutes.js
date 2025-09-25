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

// Multer setup for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });


// Routes
router.post("/", upload.single("image"), createRecruiter);
router.get("/", getRecruiters);
router.get("/:id", getRecruiterById);
router.put("/:id", upload.single("image"), updateRecruiter);
router.delete("/:id", deleteRecruiter);

module.exports = router;
