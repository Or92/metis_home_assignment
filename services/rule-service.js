const sequelize = require('../config/db');

class RuleService {
    constructor() {
        this.className = 'RuleService';
        this.sequelize = sequelize;
    }

    #mapper = {
        'Number-of-rows': this.#numberOfRows,
        'Number-of-indexes': this.#numberOfIndexes,
        'has-primary-key': this.#hasPrimaryKey,
        'primary-key-count-columns': this.#primaryKeyCountColumns,
    };

    async #numberOfRows(op_id, tableName) {
        const method_name = `${this.className}/numberOfRows`;

        try {
            const query = `SELECT count(*) FROM ${tableName}`;
            const [results, metadata] = await sequelize.query(query);
            return results;
        }
        catch (e) {
            logger.error(op_id, `${method_name} - error: `, e);
            throw e;
        }
    }

    async #numberOfIndexes(op_id, tableName) {
        const method_name = `${this.className}/numberOfIndexes`;
        try {
            const query = `SELECT count(*) 
FROM  sys.indexes AS IND
WHERE object_id = object_ID('${tableName}')
AND index_id != 0`;
            const [results, metadata] = await sequelize.query(query);
            return results;
        }
        catch (e) {
            logger.error(op_id, `${method_name} - error: `, e);
            throw e;
        }
    }

    async #hasPrimaryKey(op_id, tableName) {
        const method_name = `${this.className}/hasPrimaryKey`;
        try {
            const query = `SELECT CASE
WHEN Count(index_id) = 1 THEN 'true'
	ELSE 'false'
	END
FROM sys.indexes 
WHERE object_id = object_id('${tableName}') 
AND is_primary_key = 1;`;
            const [results, metadata] = await sequelize.query(query);
            return results;
        }
        catch (e) {
            logger.error(op_id, `${method_name} - error: `, e);
            throw e;
        }
    }

    async #primaryKeyCountColumns(op_id, tableName) {
        const method_name = `${this.className}/primaryKeyCountColumns`;
        try {
            const query = `SELECT COUNT(INC.column_id)
FROM sys.indexes as IND
		INNER JOIN sys.index_columns as INC
			ON IND.object_id = INC.object_id
			AND IND.index_id = INC.index_id
WHERE IND.object_id = object_id('${tableName}') 
	AND IND.is_primary_key = 1;
`;
            const [results, metadata] = await sequelize.query(query);
            return results;
        }
        catch (e) {
            logger.error(op_id, `${method_name} - error: `, e);
            throw e;
        }
    }

    async testRules(op_id, tableName) {
        const method_name = `${this.className}/testRules`;

        try {
            const promises = [];
            const response = [];
            Object.keys(this.#mapper).map(rule => {
                promises.push(this.#mapper[rule](op_id, tableName));
                response.push(rule);
            });
            const data = await Promise.all(promises);
            return response.map((rule, ind) => ({ [rule]: data[ind] }));
        }
        catch (e) {
            logger.error(op_id, `${method_name} - error: `, e);
            throw e;
        }
    }

}

module.exports = RuleService;