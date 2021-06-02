const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Items.init(sequelize, DataTypes);
}

class Items extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cost: {
      type: DataTypes.REAL,
      allowNull: false,
      defaultValue: 0
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    itemTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ItemTypes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Items',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "items_name_uindex",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "items_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Items;
  }
}
