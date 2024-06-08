const Router = require('express');
const router = new Router();
const userController = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../middlewares/upload-avatar');

router.post('/test', userController.test);
router.post('/registration', upload.single('avatar'), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.users);
// router.get('/users', userController.users);


module.exports = router;