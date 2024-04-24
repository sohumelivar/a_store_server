const Router = require('express');
const router = new Router();
const userController = require('../controllers/userControllers');

router.post('/test', userController.test);
router.post('/registrationForm', userController.registrationForm);

module.exports = router;