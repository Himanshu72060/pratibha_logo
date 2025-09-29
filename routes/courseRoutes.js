// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
// const upload = require('../middleware/upload');
const courseController = require('../controllers/courseController');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fields: imageCategory and image (both optional)
const cpUpload = upload.fields([
    { name: 'imageCategory', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

// ✅ Router: Create a new course
router.post('/', cpUpload, courseController.createCourse);
// router.post(
//     "/",
//     upload.fields([
//         { name: "image", maxCount: 1 },
//         { name: "imageCategory", maxCount: 1 },
//     ]),
//     courseController.createCourse
// ); 
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', cpUpload, courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);


module.exports = router;