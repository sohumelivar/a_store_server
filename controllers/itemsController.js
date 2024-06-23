const { addItemSchema } = require('../utils/validation');
const ApiError = require('../exceptions/api-error');
const itemService = require('../service/item-service');
const jwt = require('jsonwebtoken');

const getItems = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 2;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            const itemsData = await itemService.getUserItems(page, pageSize, userData.id);
            return res.json(itemsData);
        }
        const itemsData = await itemService.getItems(page, pageSize);
        return res.json(itemsData);
    } catch (error) {
        next(error);
    }
};

const addItem = async (req, res, next) => {
    try {
        const { error } = addItemSchema.validate(req.body);
        if (error) {
            throw ApiError.BadRequest('Validation error', error.details);
        }
        const { itemName, category, description, price, userId } = req.body;
        const newItem = {
            itemName,
            category,
            description,
            price: Number(price),
            userId: Number(userId),
        };
        if (req.files) {
            const photos = req.files.map(file => file.filename);
            newItem.photos = photos;
        }
        const createdItem = await itemService.createItem(newItem);
        setTimeout(() => {
            res.status(201).json(createdItem);
        }, 1000);
    } catch (error) {
        next(error);
    }
}

const toggleFavorite = async (req, res, next ) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            throw ApiError.BadRequest('User ID and Item ID are required');
        }
        const result = itemService.toggleFavorite(userId, itemId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getItems,
    addItem,
    toggleFavorite,
}