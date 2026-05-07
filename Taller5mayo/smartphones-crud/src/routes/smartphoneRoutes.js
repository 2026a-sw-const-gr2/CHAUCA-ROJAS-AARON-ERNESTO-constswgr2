const express = require('express');
const smartphoneController = require('../controllers/smartphoneController');

const router = express.Router();

router.post('/', smartphoneController.createSmartphone);
router.get('/', smartphoneController.listSmartphones);
router.get('/:id', smartphoneController.getSmartphoneById);
router.put('/:id', smartphoneController.updateSmartphone);
router.delete('/:id', smartphoneController.deleteSmartphone);

module.exports = router;
