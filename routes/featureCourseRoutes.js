const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/featureCourseController');

router.post('/', upload.single('image'), ctrl.createFeatureCourse);
router.get('/', ctrl.getAllFeatureCourses);
router.get('/:id', ctrl.getFeatureCourseById);
router.put('/:id', upload.single('image'), ctrl.updateFeatureCourse);
router.delete('/:id', ctrl.deleteFeatureCourse);

module.exports = router;
