const { User } = require('../models/models');
const userService = require('../service/user-service');


class UserController {
    async registrationForm (req, res, next) {
        try {
            const {username, firtsname, email, password, lastname, age, avatar} = req.body;
            const userData = await userService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            console.log('error reg form: ', error);
        }
    }

    async login (req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    async logout (req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    async activate (req, res) {
        try {
            console.log('tut --------------------- >>>>>>>>>>>>');
            const activationLink = req.params.link;
            console.log("🚀 ~ UserController ~ activate ~ activationLink:", activationLink)
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            console.log("🚀 ~ UserController ~ activate ~ error:", error)
        }
    }

    async refresh (req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    async users (req, res) {
        try {
            
        } catch (error) {
            
        }
    }

        async test (req, res) {
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
    
};

module.exports = new UserController();