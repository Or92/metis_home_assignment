const router = require('express').Router();
const FactsController = require('../controllers/facts-controller');

router.get('/', FactsController.getFacts.bind(FactsController));

module.exports = router;