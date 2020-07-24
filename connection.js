const Sequelize = require('sequelize')

// const connection = new Sequelize('FxDeal', 'postgres', '123456', {   //flux is user name of aws
//     host: 'localhost',
//     dialect: 'postgres',
//     freezeTableName: true
// });
const connection = new Sequelize('postgres://postgres:123456@localhost:5432/FxDeal')
module.exports = connection

