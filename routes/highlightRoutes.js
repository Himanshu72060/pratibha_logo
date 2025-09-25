const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/highlightController');

// Create
router.post('/', upload.single('image'), controller.createHighlight);

// Get all
router.get('/', controller.getAllHighlights);

// Get one
router.get('/:id', controller.getHighlightById);

// Update
router.put('/:id', upload.single('image'), controller.updateHighlight);

// Delete
router.delete('/:id', controller.deleteHighlight);

module.exports = router;
