const { addItemSchema, editItemSchema } = require('../utils/validation');
const ApiError = require('../exceptions/api-error');
const itemService = require('../service/item-service');
const jwt = require('jsonwebtoken');
const { Items, Category } = require("../models/models");
const fs = require('fs');
const path = require('path');

const getItems = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 2;
        const itemsData = await itemService.getItems(page, pageSize);
        return res.json(itemsData);
    } catch (error) {
        next(error);
    }
}

const getItemsWithUser = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 2;
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const itemsData = await itemService.getUserItems(page, pageSize, userData.id);
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
        if (req.files.length === 0) {
            throw ApiError.BadRequest('You must add a photo of the product')
        }
        if (req.files) {
            const photos = req.files.map(file => file.filename);
            newItem.photos = photos;
        }
        const createdItem = await itemService.createItem(newItem, userId);
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

const deleteItem = async (req, res, next) => {
    try {
        const { itemId, userId} = req.body;
        const deletedItem = await itemService.deleteItem(itemId, userId);
        res.json(deletedItem);
    } catch (error) {
        next(error)
    }
}

const getItemAuth = async (req, res, next) => {
    try {
        const { itemId, userId } = req.params;
        const item = await itemService.getItemAuth(itemId, userId);
        res.json(item);
    } catch (error) {
        next(error);
    }
};

const getItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const item = await itemService.getItem(itemId);
        res.json(item);
    } catch (error) {
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        if (typeof req.body.deletedPhotos === 'string') {
            req.body.deletedPhotos = JSON.parse(req.body.deletedPhotos);
        }

        const { error } = editItemSchema.validate(req.body);
        if (error) {
            throw ApiError.BadRequest('Validation error', error.details[0].message);
        }

        const { itemName, category, description, price, userId, deletedPhotos } = req.body;
        const itemId = req.params.id;

        const item = await Items.findByPk(itemId);
        if (!item) {
            throw ApiError.BadRequest('Item not found');
        }
        if (item.userId !== parseInt(userId, 10)) {
            throw ApiError.BadRequest('You do not have permission to update this item');
        }

        const categoryRecord = await Category.findOne({ where: { name: category } });
        if (!categoryRecord) {
            throw ApiError.BadRequest('Category not found');
        }

        item.itemName = itemName;
        item.categoryId = categoryRecord.id;
        item.description = description;
        item.price = price;

        if (item.photos.length === deletedPhotos.length && !req.files) {
            throw ApiError.BadRequest('Cant delete all photos');
        }

        if (item.photos.length === deletedPhotos.length && req.files.length < 1) {
            throw ApiError.BadRequest('Cant delete all photos');
        }
        
        if (deletedPhotos && Array.isArray(deletedPhotos)) {
            deletedPhotos.forEach(photo => {
                const photoPath = path.join(__dirname, 'itemsPhotos', photo);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
                item.photos = item.photos.filter(p => p !== photo);
            });
        }

        if (req.files.length > 0) {
            req.files.forEach(file => {
                item.photos.push(file.filename);
            });
        }
        
        const updatedItem = await Items.update({
            itemName,
            categoryId: categoryRecord.id,
            description,
            price,
            photos: item.photos
        }, {
            where: { id: itemId },
            returning: true
        });
        return res.json(updatedItem);
    } catch (error) {
        next(error);
    }

    
};

const getUserItems = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 2; 
        const itemsData = await itemService.getUserItemsProfile(page, pageSize, userId);
        return res.json(itemsData);
    } catch (error) {
        next(error);
    }
}

const getViewUserItems = async (req, res, next) => {
    try {
        const { viewUserId }  = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 2;
        const itemsData = await itemService.getViewUserItems(page, pageSize, viewUserId);
        return res.json(itemsData);
    } catch (error) {
        next(error);
    }
};

const getFavorites = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { userId } = req.params;
        const pageSize = 2;
        const favoritesData = await itemService.getFavorites(page, pageSize, userId);
        return res.json(favoritesData);
    } catch (error) {
        next(error);
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getItems,
    getItemsWithUser,
    addItem,
    toggleFavorite,
    deleteItem,
    getItemAuth,
    getItem,
    updateItem,
    getUserItems,
    getViewUserItems,
    getFavorites,
    getCategories,
}