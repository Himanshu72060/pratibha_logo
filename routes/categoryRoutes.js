const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/categoryController');


// Categories
router.post('/', upload.single('image'), controller.createCategory);
router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategoryById);
router.put('/:id', upload.single('image'), controller.updateCategory);
router.delete('/:id', controller.deleteCategory);


// Courses inside category
router.post('/:id/courses', upload.single('image'), controller.addCourse);
router.put('/:id/courses/:courseId', upload.single('image'), controller.updateCourse);
router.delete('/:id/courses/:courseId', controller.deleteCourse);


module.exports = router;