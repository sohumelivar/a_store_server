const Router = require('express');
const router = new Router();
const itemsController = require('../controllers/itemsController');

router.get('/getItems', itemsController.getItems);
router.post('/toggleStateFavorite', itemsController.toggleStateFavorite);
router.post('/getItemWithId', itemsController.getItemWithId);

module.exports = router;