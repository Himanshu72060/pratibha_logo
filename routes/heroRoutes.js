const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const heroController = require('../controllers/heroController');


// Create (multipart/form-data, field name: image)
router.post('/', upload.single('image'), heroController.createHero);


// Get all
router.get('/', heroController.getAllHeroes);


// Get by id
router.get('/:id', heroController.getHeroById);


// Update (can include new image)
router.put('/:id', upload.single('image'), heroController.updateHero);


// Delete
router.delete('/:id', heroController.deleteHero);


module.exports = router;