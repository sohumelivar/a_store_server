const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const itemsRouter = require('./itemsRouter');

router.use('/user', userRouter);
router.use('/items', itemsRouter);

module.exports = router;