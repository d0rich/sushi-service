const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ItemTypes.init(sequelize, DataTypes);
}

class ItemTypes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ItemTypes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "itemtypes_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "itemtypes_type_uindex",
        unique: true,
        fields: [
          { name: "type" },
        ]
      },
    ]
  });
  return ItemTypes;
  }
}
