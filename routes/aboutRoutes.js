// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/aboutController');


// NOTE: for POST and PUT use form-data with `image` file field
router.post('/', upload.single('image'), controller.createAbout);
router.get('/', controller.getAllAbout);
router.get('/:id', controller.getAbout);
router.put('/:id', upload.single('image'), controller.updateAbout);
router.delete('/:id', controller.deleteAbout);


module.exports = router;