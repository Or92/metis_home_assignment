const Sequelize = require('sequelize').Sequelize;

const { DB_HOST: host, DB_NAME, DB_USER, DB_PASSWORD } = process.env;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, { host, dialect: 'mysql' });

module.exports = sequelize;