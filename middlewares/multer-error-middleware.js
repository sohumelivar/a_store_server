const multer = require('multer');
const ApiError = require('../exceptions/api-error');

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError || err instanceof ApiError) {
        return next(err);
    }
    next();
};

module.exports = multerErrorHandler;