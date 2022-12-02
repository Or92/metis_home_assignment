const sequelize = require('../config/db');

class RuleService {
    className = 'RuleService';

    constructor() {
        this.sequelize = sequelize;
    }

    rulesEnum = {
        'Number-of-rows': 'Number-of-rows',
        'Number-of-indexes': 'Number-of-indexes',
        'has-primary-key': 'has-primary-key',
        'primary-key-count-columns': 'primary-key-count-columns',
    }

    #mapper = {
        'Number-of-rows': this.#numberOfRows,
        'Number-of-indexes': this.#numberOfIndexes,
        'has-primary-key': this.#hasPrimaryKey,
        'primary-key-count-columns': this.#primaryKeyCountColumns,
    };

    async #numberOfRows(op_id, tableName) {
        const methodName = `${this.className}/numberOfRows`;

        try {
            logger.info(op_id, `${methodName} - start`);
            const query = `SELECT count(*) AS count FROM ${tableName}`;
            const [[{ count }], _] = await sequelize.query(query);
            logger.info(op_id, `${methodName} - end`);
            return count;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            throw e;
        }
    }

    async #numberOfIndexes(op_id, tableName) {
        const methodName = `${this.className}/numberOfIndexes`;
        try {
            logger.info(op_id, `${methodName} - start`);
            const query = `SELECT count(*) AS count
                            FROM  sys.indexes AS IND
                            WHERE object_id = object_ID('${tableName}')
                            AND index_id != 0`;
            const [[{ count }], _] = await sequelize.query(query);
            logger.info(op_id, `${methodName} - end`);
            return count;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            throw e;
        }
    }

    async #hasPrimaryKey(op_id, tableName) {
        const methodName = `${this.className}/hasPrimaryKey`;
        try {
            logger.info(op_id, `${methodName} - start`);
            const query = `SELECT CASE
                            WHEN Count(index_id) = 1 THEN 'true'
	                        ELSE 'false'
	                        END AS count
                            FROM sys.indexes 
                            WHERE object_id = object_id('${tableName}') 
                            AND is_primary_key = 1;`;
            const [[{ count }], _] = await sequelize.query(query);
            logger.info(op_id, `${methodName} - end`);
            return count;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            throw e;
        }
    }

    async #primaryKeyCountColumns(op_id, tableName) {
        const methodName = `${this.className}/primaryKeyCountColumns`;
        try {
            logger.info(op_id, `${methodName} - start`);
            const query = `SELECT COUNT(INC.column_id) AS count
                            FROM sys.indexes as IND
		                    INNER JOIN sys.index_columns as INC
			                ON IND.object_id = INC.object_id
			                AND IND.index_id = INC.index_id
                            WHERE IND.object_id = object_id('${tableName}') 
	                        AND IND.is_primary_key = 1;`;
            const [[{ count }], _] = await sequelize.query(query);
            logger.info(op_id, `${methodName} - end`);
            return count;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            throw e;
        }
    }

    async testRules(op_id, tableName, rules) {
        const methodName = `${this.className}/testRules`;

        try {
            logger.info(op_id, `${methodName} - start`);
            const promises = [], response = [];

            rules.map(rule => {
                promises.push(this.#mapper[rule](op_id, tableName));
                response.push(rule);
            });
            const data = await Promise.all(promises);
            const results = response.map((rule, ind) => ({ [rule]: data[ind] }));
            logger.info(op_id, `${methodName} - end`);
            return results;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            throw e;
        }
    }

    async analyseRules(op_id, facts) {
        const methodName = `${this.className}/analyseRules`;

        try {
            const results = {};

            Object.keys(facts).map(rule => {
                if (rule === this.rulesEnum['Number-of-rows']) {
                    if (facts[rule] > 10_000_000) {
                        results[rule] = `Warning! Large table. the number of rows is ${facts[rule]}.`;
                    }
                    else {
                        results[rule] = 'pass';
                    }
                }
                else if (rule === this.rulesEnum['has-primary-key']) {
                    if (!facts[rule]) {
                        results[rule] = `Warning! the table doesnt have PK.`;
                    }
                    else {
                        results[rule] = 'pass';
                    }
                }
                else if (rule === this.rulesEnum['primary-key-count-columns']) {
                    if (facts[rule] >= 4) {
                        results[rule] = `High number of columns in the PK. ${facts[rule]}.`;
                    }
                    else {
                        results[rule] = 'pass';
                    }
                }
                else {
                    results[rule] = 'pass';
                }
            });
            return results;
        }
        catch (e) {
            logger.error(op_id, `${methodName} - error: `, e);
            throw e;
        }
    }

}

module.exports = RuleService;