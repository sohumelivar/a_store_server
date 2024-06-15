const { addItemSchema } = require('../utils/validation');
const ApiError = require('../exceptions/api-error');
const itemService = require('../service/item-service');

const getItems = async (req, res) => {
    try {
        res.json('getItem');
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ getItem ☢ error:', error)
    }
}

const getItemWithId = async (req, res) => {
    try {
        res.json('ok'); 
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ getItems ☢ error:', error)
    }
}

const toggleStateFavorite = async (req, res) => {
    try {
        res.json('ok');
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ toggleStateFavorite ☢ error:', error)
    }
}

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
        }, 5000);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getItems,
    getItemWithId,
    toggleStateFavorite,
    addItem,
}