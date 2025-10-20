const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
  }
);
// const sequelize = new Sequelize("toughts2", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });
console.log("process: ", process.env);

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso ao banco de dados!");
} catch (error) {
  console.error("Não foi possível conectar ao banco de dados:", error);
}

module.exports = sequelize;
