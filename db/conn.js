const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
    sequelize.authenticate();
    console.log('Conectado com sucesso ao banco de dados!');
} catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
}

module.exports = sequelize;