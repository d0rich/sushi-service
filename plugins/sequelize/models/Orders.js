const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Orders.init(sequelize, DataTypes);
}

class Orders extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Orders',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "orders_id_uindex",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "orders_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Orders;
  }
}
