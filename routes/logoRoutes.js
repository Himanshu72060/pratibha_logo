const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/upload");


const {
    createLogo,
    getLogos,
    updateLogo,
    deleteLogo,
} = require("../controllers/logoController");


// ✅ Multer config (disk storage, temporary file path)
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("image"), createLogo);
router.get("/", getLogos);
router.put("/:id", upload.single("image"), updateLogo);
router.delete("/:id", deleteLogo);

module.exports = router;