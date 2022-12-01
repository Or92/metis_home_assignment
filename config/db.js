const Sequelize = require('sequelize').Sequelize;

const { DB_PORT: port, DB_HOST: host, DB_NAME, DB_USER, DB_PASSWORD } = process.env;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, { host, dialect: 'mssql', port, logging: false });

module.exports = sequelize;