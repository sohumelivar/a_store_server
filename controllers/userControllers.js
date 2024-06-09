const { User } = require('../models/models');
const userService = require('../service/user-service');
const { filterEmptyFields } = require('../utils/filterEmptyFields');
const ApiError = require('../exceptions/api-error');
const { registrationSchema } = require('../utils/validation');

const registration = async (req, res, next) => {
    try {
        const { error } = registrationSchema.validate(req.body);
        if (error) {
            throw ApiError.BadRequest('Validation error', error.details);
        }
        const filteredData = filterEmptyFields(req.body);
        if (req.file) {
            filteredData.avatar = req.file.filename;
        }
        const userData = await userService.registration(filteredData);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const userData = await userService.login(username, password);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res) => {
    try {
        const {refreshToken} = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    } catch (error) {
        console.log(error);
    }
}

const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
        next(error);
    }
}

const refresh = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

const users = async (req, res, next) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        next(error);
    }
}

const test = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("🚀 ~ UserController ~ test ~ { username, email, password }:", { username, email, password })
        const user = await User.findOne({where: {username}});
        console.log("🚀 ~ UserController ~ test ~ user:", user)
        const headers = req.get('Authorization');
        setTimeout(() => {
            return res.json({id:1, username: 'test'});
        }, 1000)
    } catch (error) {
    console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ test ☢ error:', error)
    }
}

module.exports = {
    registration,
    login,
    logout,
    activate,
    refresh,
    users,
    test,
}