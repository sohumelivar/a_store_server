const Router = require('express');
const router = new Router();
const itemsController = require('../controllers/itemsController');
const uploadItemPhoto = require('../middlewares/upload-item-photos');
const multerErrorHandler = require('../middlewares/multer-error-middleware');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/addItem', authMiddleware, uploadItemPhoto.array('photo', 5), multerErrorHandler, itemsController.addItem);
router.get('/items', itemsController.getItems);
router.post('/toggleFavorite', authMiddleware, itemsController.toggleFavorite);
router.post('/deleteItem', authMiddleware, itemsController.deleteItem);

module.exports = router;