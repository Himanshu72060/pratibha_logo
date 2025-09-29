// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const courseController = require('../controllers/courseController');


// fields: imageCategory and image (both optional)
const cpUpload = upload.fields([
    { name: 'imageCategory', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);


router.post('/', cpUpload, courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', cpUpload, courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);


module.exports = router;