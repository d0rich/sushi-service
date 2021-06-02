const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Users.init(sequelize, DataTypes);
}

class Users extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secondName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_id_uindex",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_login_uindex",
        unique: true,
        fields: [
          { name: "login" },
        ]
      },
      {
        name: "users_phone_uindex",
        unique: true,
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "users_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_usertype_index",
        fields: [
          { name: "userType" },
        ]
      },
    ]
  });
  return Users;
  }
}
