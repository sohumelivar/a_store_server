const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

class UserController {
    async test (req, res) {
        try {
          const { username, password } = req.body;
          const user = await User.findOne({where: {username}});
          const headers = req.get('Authorization');
          setTimeout(() => {
              return res.json({id:1, username: 'test'});
          }, 1000)
        } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ test ☢ error:', error)
        }
    }

    async registrationForm (req, res) {
        try {
            const {username, firtsname, lastname, age, avatar} = req.body;
            console.log('avatar --- >>', avatar);
            res.json({status: 'acept'});
        } catch (error) {
            console.log('error reg form: ', error);
        }
    }
};

module.exports = new UserController();