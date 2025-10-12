module.exports = (sequelize, DataTypes) => {
  const Subtask = sequelize.define("subtasks", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isChecked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Subtask;
};
