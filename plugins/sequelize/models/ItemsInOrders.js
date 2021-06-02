const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ItemsInOrders.init(sequelize, DataTypes);
}

class ItemsInOrders extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Items',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    cost: {
      type: DataTypes.REAL,
      allowNull: false,
      defaultValue: 0
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'ItemsInOrders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "itemsinorders_pk",
        unique: true,
        fields: [
          { name: "itemId" },
          { name: "orderId" },
        ]
      },
    ]
  });
  return ItemsInOrders;
  }
}
