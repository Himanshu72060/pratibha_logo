const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const partnerController = require('../controllers/partnerController');

router.post('/', upload.single('image'), partnerController.createPartner);
router.get('/', partnerController.getPartners);
router.get('/:id', partnerController.getPartner);
router.put('/:id', upload.single('image'), partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
