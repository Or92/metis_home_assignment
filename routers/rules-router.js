const router = require('express').Router();
const RulesController = require('../controllers/rules-controller');

router.get('/', RulesController.getRules.bind(RulesController));

module.exports = router;