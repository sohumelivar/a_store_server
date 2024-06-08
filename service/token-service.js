const jwt = require('jsonwebtoken');
const { Token } = require('../models/models');

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {
        accessToken,
        refreshToken
    }
}

const validateAccessToken = (accessToken) => {
    try {
        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        return userData;
    } catch (error) {
        return null;
    }
}

const validateRefreshToken = (refreshToken) => {
    try {
        const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (error) {
        return null;
    }
}

const saveToken = async (userId, refreshToken) => {
    const tokenData = await Token.findOne({where:{userId}});
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await Token.create({userId, refreshToken});
    return token;
}

const removeToken = async (refreshToken) => {
        const tokenData = await Token.destroy({where: {refreshToken}});
        return tokenData;
}

const findToken = async (refreshToken) => {
        const tokenData = await Token.findOne({where: {refreshToken}});
        return tokenData;
}

module.exports = {
    generateTokens,
    validateAccessToken,
    validateRefreshToken,
    saveToken,
    removeToken,
    findToken,
}