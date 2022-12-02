const factsRouter = require('./facts-router');
const rulesRouter = require('./rules-router');
const generateOpId = require('../middlewares/generate-op-id');

module.exports = (app) => {
    app.use('/facts', generateOpId, factsRouter);
    app.use('/rules', generateOpId, rulesRouter);
}