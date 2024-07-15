const Router = require('express');
const router = new Router();
const userController = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../middlewares/upload-avatar');

router.post('/registration', upload.single('avatar'), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.users);
router.put('/updateUserActivity/:id', authMiddleware, userController.updateUserActivity);
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.put('/updateProfile/:id', authMiddleware, upload.single('avatar'), userController.updateProfile);

module.exports = router;