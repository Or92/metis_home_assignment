const RulesService = require('../services/rule-service');

class RulesController {
    className = 'RulesController';

    constructor() {
        this.rulesService = new RulesService();
    }

    async getRules(req, res) {
        const methodName = `${this.className}/getRules`;

        const { op_id } = req;

        try {
            logger.info(op_id, `${methodName} - start`);

            const tableName = req.query.tableName;

            if (!tableName) {
                throw 'table name is not provided.';
            }

            const rulesToTest = [
                this.rulesService.rulesEnum['Number-of-rows'],
                this.rulesService.rulesEnum['has-primary-key'],
                this.rulesService.rulesEnum['primary-key-count-columns']
            ];
            logger.verbose(op_id, `${methodName} - calling rulesService/testRules with: `, { tableName });
            const data = await this.rulesService.testRules(op_id, tableName, rulesToTest);
            const manipulatedData = data.reduce((acc, el) => {
                return { ...acc, ...el }
            }, {});
            logger.verbose(op_id, `${methodName} - calling rulesService/analyseRules with: `, { manipulatedData });
            const results = await this.rulesService.analyseRules(op_id, manipulatedData);

            res.json({ success: true, data: results });
            logger.info(op_id, `${methodName} - end`);
            return;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            res.status(500).json({ success: false, message });
            return;
        }
    }
}

const rulesService = new RulesController();

module.exports = rulesService;