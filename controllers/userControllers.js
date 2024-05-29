const { User } = require('../models/models');
const userService = require('../service/user-service');
const filterEmptyFields = require('../utils/filterEmptyFields');


const registrationForm = async (req, res, next) => {
    try {
        const filteredData = filterEmptyFields(req.body);
        if (!filteredData.filledData) return res.json({ error: true, emptyFields: filteredData.necessaryInputs })
        const userData = await userService.registration(filteredData.userData);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
    } catch (error) {
        console.log('error reg form: ', error);
    }
}

const login = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const logout = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
        console.log("🚀 ~ UserController ~ activate ~ error:", error)
    }
}

const refresh = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const users = async (req, res) => {
    try {
        
    } catch (error) {
        
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
    registrationForm,
    login,
    logout,
    activate,
    refresh,
    users,
    test,
}