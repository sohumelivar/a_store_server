const { User } = require("../models/models");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const fieldChecking = require('../utils/fieldChecking');
const ApiError = require("../exceptions/api-error");

const registration = async (userData) => {
        await fieldChecking(userData);
        const hashPassword = await bcrypt.hash(userData.password, 3);
        const activationLink = uuid.v4();
        const user = await User.create({ ...userData, password: hashPassword, activationLink });
        await mailService.sendActivationMail(userData.email, `${process.env.SERVER_URL}/api/user/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
};

const activate = async (activationLink) => {
        const user = await User.findOne({where: {activationLink}});
        if (!user) {
            throw ApiError.BadRequest('Некоректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();           
        console.log("🚀 ~ UserService ~ activate ~ error:", error)
}

const login = async (username, password) => {
        const user = await User.findOne({where: {username}});
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким именем не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('wrong password');   
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
}

const logout = async (refreshToken) => {
        const token = await tokenService.removeToken(refreshToken);
        return token;
}

const refresh = async (refreshToken) => {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenDB) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findOne({where: {id: userData.id}})
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
}

module.exports = {
    registration,
    activate,
    login,
    logout,
    refresh,
}

