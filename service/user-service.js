const { User } = require("../models/models");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

const registration = async (userData) => {
    try {
        const { email, password } = userData;
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await User.create({ ...userData, password: hashPassword, activationLink });
        await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/api/user/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ registration ☢ error:', error)
    }
};

const activate = async (activationLink) => {
    try {
        const user = await User.findOne({where: {activationLink}});
        if (!user) {
            throw new Error('Некоректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();           
    } catch (error) {
        console.log("🚀 ~ UserService ~ activate ~ error:", error)
    }
}

module.exports = {
    registration,
    activate,
}

