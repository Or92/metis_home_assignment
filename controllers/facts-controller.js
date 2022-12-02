const RuleService = require('../services/rule-service');

class FactsController {
    className = 'FactsController';

    constructor() {
        this.ruleService = new RuleService();
    }

    async getFacts(req, res) {
        const methodName = `${this.className}/getFacts`;
        
        const { op_id } = req;
        
        try {
            logger.info(op_id, `${methodName} - start`);

            const tableName = req.query.tableName;

            if (!tableName) {
                throw 'table name is not provided.';
            }

            const rulesToTest = [
                this.ruleService.rulesEnum['Number-of-rows'],
                this.ruleService.rulesEnum['Number-of-indexes'],
                this.ruleService.rulesEnum['has-primary-key'],
                this.ruleService.rulesEnum['primary-key-count-columns']
            ];
            
            logger.verbose(op_id, `${methodName} - calling ruleService/testRules with: `, { tableName });
            const data = await this.ruleService.testRules(op_id, tableName, rulesToTest);
            res.json({ success: true, data });
            logger.info(op_id, `${methodName} - end`);
            return;
        }
        catch (message) {
            logger.error(op_id, `${methodName} - error: `, { message });
            res.status(500).json({ success: false, message });
            return;
        }
    }
}

const factsController = new FactsController();

module.exports = factsController;