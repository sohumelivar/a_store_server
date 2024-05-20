const { User } = require("../models/models");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration (username, email, password) {
        const candidate = await User.findOne({where: {email}});
        console.log("🚀 ~ UserService ~ registration ~ candidate:", candidate)
        if (candidate) {
            throw new Error(`Ползователь с почтовым адресом ${email} уже существует` );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        console.log("🚀 ~ UserService ~ registration ~ activationLink:", activationLink)
        const user = await User.create({username, email, password: hashPassword, activationLink});
        await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/api/user/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async activate(activationLink) {
        try {
            const user = await User.findOne({where: {activationLink}});
            console.log("🚀 ~ UserService ~ activate ~ user:", user)
            console.log("🚀 ~ UserService ~ activate ~ user:", user.isActivated)
            if (!user) {
                throw new Error('Некоректная ссылка активации');
            }
            user.isActivated = true;
            console.log("🚀 ~ UserService ~ activate ~ user finaly:", user.isActivated)

            await user.save();           
        } catch (error) {
            console.log("🚀 ~ UserService ~ activate ~ error:", error)
        }
    }
}

module.exports = new UserService();