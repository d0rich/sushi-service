var DataTypes = require("sequelize").DataTypes;
var _ItemTypes = require("./ItemTypes");
var _Items = require("./Items");
var _ItemsInOrders = require("./ItemsInOrders");
var _Orders = require("./Orders");
var _Tokens = require("./Tokens");
var _Users = require("./Users");

function initModels(sequelize) {
  var ItemTypes = _ItemTypes(sequelize, DataTypes);
  var Items = _Items(sequelize, DataTypes);
  var ItemsInOrders = _ItemsInOrders(sequelize, DataTypes);
  var Orders = _Orders(sequelize, DataTypes);
  var Tokens = _Tokens(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Items.belongsToMany(Orders, { as: 'orderId_Orders', through: ItemsInOrders, foreignKey: "itemId", otherKey: "orderId" });
  Orders.belongsToMany(Items, { as: 'itemId_Items', through: ItemsInOrders, foreignKey: "orderId", otherKey: "itemId" });
  Items.belongsTo(ItemTypes, { as: "itemType", foreignKey: "itemTypeId"});
  ItemTypes.hasMany(Items, { as: "Items", foreignKey: "itemTypeId"});
  ItemsInOrders.belongsTo(Items, { as: "item", foreignKey: "itemId"});
  Items.hasMany(ItemsInOrders, { as: "ItemsInOrders", foreignKey: "itemId"});
  ItemsInOrders.belongsTo(Orders, { as: "order", foreignKey: "orderId"});
  Orders.hasMany(ItemsInOrders, { as: "ItemsInOrders", foreignKey: "orderId"});
  Orders.belongsTo(Users, { as: "client", foreignKey: "clientId"});
  Users.hasMany(Orders, { as: "Orders", foreignKey: "clientId"});
  Tokens.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Tokens, { as: "Tokens", foreignKey: "userId"});

  return {
    ItemTypes,
    Items,
    ItemsInOrders,
    Orders,
    Tokens,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
