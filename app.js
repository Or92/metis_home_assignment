const express = require('express');
const app = express();
require('dotenv').config();
const DB = require('./config/db');
const RuleService = require('./services/rule-service');
const logger = require('./config/logger');
const generateOpId = require('./middlewares/generate-op-id');

globalThis['logger'] = logger;

(async () => {
    try {
        console.log('init db...');
        await DB.authenticate();

        app.get('/facts', generateOpId, async function factsController(req, res) {
            const method_name = 'factsController';
            const { op_id } = req;

            try {
                const table_name = req.query.tableName;

                if (!table_name) {
                    throw 'table name is not provided.';
                }
                const rule_service = new RuleService();
                logger.info(op_id, `${method_name} - calling rule_service/testRules with: `, { table_name });
                const data = await rule_service.testRules(op_id,table_name);
                res.json({ success: true, data });
                return;
            }
            catch (message) {
                logger.error(op_id, `${method_name} - error: `, { message });
                res.status(500).json({ success: false, message });
                return;
            }
        }
        );

        const { PORT } = process.env;
        app.listen(PORT || 3000);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
})();