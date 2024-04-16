const Router = require('express');
const router = new Router();
const userController = require('../controllers/userControllers');

router.post('/test', userController.test);

module.exports = router;