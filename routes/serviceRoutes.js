const express = require('express');
const router = express.Router();
const multer = require('multer');
const serviceController = require('../controllers/serviceController');

// Multer setup for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// CRUD Routes
router.post('/', upload.single('image'), serviceController.createService);
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);
router.put('/:id', upload.single('image'), serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
