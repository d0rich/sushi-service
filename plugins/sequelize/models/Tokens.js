const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Tokens.init(sequelize, DataTypes);
}

class Tokens extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    expireAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "(now() + ((30)"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Tokens',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tokens_pk",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
      {
        name: "tokens_token_uindex",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  return Tokens;
  }
}
