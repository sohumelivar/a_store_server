const Router = require('express');
const router = new Router();
const itemsController = require('../controllers/itemsController');
const uploadItemPhoto = require('../middlewares/upload-item-photos');
const multerErrorHandler = require('../middlewares/multer-error-middleware');

router.post('/addItem', uploadItemPhoto.array('photo', 5), multerErrorHandler, itemsController.addItem);
router.get('/items', itemsController.getItems);

module.exports = router;