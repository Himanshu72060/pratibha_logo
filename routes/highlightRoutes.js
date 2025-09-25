const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/highlightController');


// Create (multipart/form-data, field name: image)
router.post('/', upload.single('image'), controller.createHighlight);


// Get all
router.get('/', controller.getAllHighlights);


// Get by id
router.get('/:id', controller.getHighlightById);


// Update (if updating file, use multipart/form-data with field 'image')
router.put('/:id', upload.single('image'), controller.updateHighlight);


// Delete
router.delete('/:id', controller.deleteHighlight);


module.exports = router;