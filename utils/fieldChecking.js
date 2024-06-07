const ApiError = require("../exceptions/api-error");
const { User } = require("../models/models");

const fieldChecking = async (userData) => {
        const { username, email } = userData;
        const checkUsername = await User.findOne({where: { username }});
        if (checkUsername) {
             throw ApiError.BadRequest(`Пользователь с таким username ${username} уже существует`)
        }
        const checkEmail = await User.findOne({ where: { email } });
        if (checkEmail) {
             throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
};

module.exports = fieldChecking;