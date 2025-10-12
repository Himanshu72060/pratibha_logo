const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/coursesController');

// Category endpoints
router.post('/categories', upload.single('image'), ctrl.createCategory);
router.get('/categories', ctrl.getAllCategories);
router.get('/categories/:id', ctrl.getCategoryById);
router.put('/categories/:id', upload.single('image'), ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// Course endpoints (nested under category id)
router.post('/categories/:id/courses', upload.single('image'), ctrl.addCourse);
router.put('/categories/:id/courses/:courseId', upload.single('image'), ctrl.updateCourse);
router.delete('/categories/:id/courses/:courseId', ctrl.deleteCourse);

module.exports = router;