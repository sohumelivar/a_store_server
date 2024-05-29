const Router = require('express');
const router = new Router();
const userController = require('../controllers/userControllers');

router.post('/test', userController.test);
router.post('/registrationForm', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.users);

module.exports = router;