const { User } = require("../models/models");

const fieldChecking = async (userData) => {
    try {
        const { username, email, password } = userData;
        const checkUsername = await User.findOne({where: { username }});
        if (checkUsername) {
            return {error: true, errorMessage: `Пользователь с таким username ${username} уже существует`}
        }
        const checkEmail = await User.findOne({ where: { email } });
        if (checkEmail) {
            return {error: true, errorMessage: `Пользователь с почтовым адресом ${email} уже существует`};
        }
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ fieldChecking ☢ error:', error)
    }
};

module.exports = fieldChecking;