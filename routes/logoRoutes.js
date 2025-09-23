const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    createLogo,
    getLogos,
    updateLogo,
    deleteLogo,
} = require("../controllers/logoController");

router.post("/", upload.single("image"), createLogo);
router.get("/", getLogos);
router.put("/:id", upload.single("image"), updateLogo);
router.delete("/:id", deleteLogo);

module.exports = router;
