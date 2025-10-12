const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch((err) => console.error("❌ Error: " + err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model")(sequelize, Sequelize);
db.Task = require("./tasks.model")(sequelize, Sequelize);
db.Subtask = require("./subtasks.model")(sequelize, Sequelize);

db.User.hasMany(db.Task, { onDelete: "CASCADE" });
db.Task.belongsTo(db.User);

db.Task.hasMany(db.Subtask, { onDelete: "CASCADE" });
db.Subtask.belongsTo(db.Task);

db.User.hasMany(db.Subtask, { onDelete: "CASCADE" });
db.Subtask.belongsTo(db.User);
module.exports = db;
