const { User } = require('../models/models');
const userService = require('../service/user-service');
const mailService = require('../service/mail-service');
const userActivity = require('../service/user-activity');
const { filterEmptyFields } = require('../utils/filterEmptyFields');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const { registrationSchema, profileSchema } = require('../utils/validation');

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
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json({user: userData.user, accessToken: userData.accessToken});
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

const updateUserActivity = (req, res, next) => {
    try {
        const userId = req.params.id;
        userActivity.updateUserActivity(userId);
        res.sendStatus(200).json({ message: 'Last activity updated successfully' });;
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userService.getProfile(userId);
        return res.json(user);
    } catch (error) {
        next(error);
    }
}

const viewUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userService.viewUserProfile(userId);
        return res.json(user);
    } catch (error) {
        next(error);
    }
}

const updateProfile = async ( req, res, next) => {
    try {
        const { error } = profileSchema.validate(req.body);
        if (error) {
        throw ApiError.BadRequest('Validation error', error.details[0].message);
        }
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        if (req.file) {
            user.avatar = req.file.filename;
        }
        const { username, email, firstname, lastname, age } = req.body;
        if (user.email !== email) {
            user.isActivated = false;
            user.email = email;
            const activationLink = uuid.v4();
            user.activationLink = activationLink;
            await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/api/user/activate/${activationLink}`);
        }
        user.username = username;
        user.email = email;
        user.firstname = firstname;
        user.lastname = lastname;
        user.age = age;
        await user.save();
        const userData = {
            username,
            email,
            firstname,
            lastname,
            age,
            avatar: req.file ? req.file.filename : user.avatar
        }
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registration,
    login,
    logout,
    activate,
    refresh,
    users,
    updateUserActivity,
    getProfile,
    updateProfile,
    viewUserProfile,
}