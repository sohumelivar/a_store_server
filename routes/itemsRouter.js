const Router = require('express');
const router = new Router();
const itemsController = require('../controllers/itemsController');
const uploadItemPhoto = require('../middlewares/upload-item-photos');
const multerErrorHandler = require('../middlewares/multer-error-middleware');

router.get('/getItems', itemsController.getItems);
router.post('/toggleStateFavorite', itemsController.toggleStateFavorite);
router.post('/getItemWithId', itemsController.getItemWithId);
router.post('/addItem', uploadItemPhoto.array('photo', 5), multerErrorHandler, itemsController.addItem);

module.exports = router;