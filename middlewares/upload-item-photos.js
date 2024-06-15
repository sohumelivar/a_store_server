const multer = require('multer');
const path = require('path');
const ApiError = require('../exceptions/api-error');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'itemsPhotos/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
    }
};

const uploadItemPhoto = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: fileFilter
});

module.exports = uploadItemPhoto;
