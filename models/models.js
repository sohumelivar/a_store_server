const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true},
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    first: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    avatar: { type: DataTypes.STRING}
});

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
})

const Items = sequelize.define('items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    itemName: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.STRING },
    photo: { type: DataTypes.STRING },
});

const Favorite = sequelize.define('favorite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const OnEdit = sequelize.define('onEdit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

User.hasMany(Items);
Items.belongsTo(User);
User.hasMany(Favorite);
Items.hasMany(Favorite);
Favorite.belongsTo(User);
Favorite.belongsTo(Items);
OnEdit.belongsTo(User);
OnEdit.belongsTo(Items);
User.hasMany(OnEdit);
Items.hasMany(OnEdit);
User.hasOne(Token, {
    foreignKey: 'userId',
});
Token.belongsTo(User, {
    foreignKey: 'userId',
});



module.exports = { User, Items, Favorite, OnEdit, Token };