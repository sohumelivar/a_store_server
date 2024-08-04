const { Items, Favorite, OnEdit, User, Category } = require("../models/models");
const ApiError = require("../exceptions/api-error");
const sequelize = require('../db');

const createItem = async (newItem, userId) => {
    const transaction = await sequelize.transaction();
    try {
        const category = await Category.findOne({ where: { name: newItem.category }, transaction });
        if (!category) {
            throw new Error('Категория не найдена');
        }
        const createdItem = await Items.create({
            ...newItem,
            categoryId: category.id,
        }, { transaction });
        await OnEdit.create({ userId, itemId: createdItem.id }, { transaction });
        await transaction.commit();
        return { newItem: createdItem };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


const getItems = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        offset,
        limit: pageSize,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ]
    });

    return {
        items: rows,
        totalPages: Math.ceil(count / pageSize),
    };
};

const getUserItems = async (page, pageSize, userId) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        offset,
        limit: pageSize,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Favorite,
                attributes: ['userId'],
                required: false,
                where: { userId: userId }
            },
            {
                model: OnEdit,
                attributes: ['userId'],
                required: false,
                where: { userId: userId }
            },
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ]
    });

    const items = rows.map(item => ({
        ...item.get({ plain: true }),
        isFavorite: item.favorites && item.favorites.length > 0,
        onEdit: item.onEdits && item.onEdits.length > 0
    }));

    return {
        items: items,
        totalPages: Math.ceil(count / pageSize),
    };
};

const toggleFavorite = async (userId, itemId) => {
    const favorite = await Favorite.findOne({ where: { userId, itemId } });
    if (favorite) {
        await Favorite.destroy({ where: { userId, itemId } });
        return itemId;
    } else {
        await Favorite.create({ userId, itemId });
        return itemId;
    }
}

const deleteItem = async (itemId, userId) => {
    const deleteItem = await Items.findOne({where: {id: itemId, userId}});
    if (!deleteItem) {
        throw ApiError.BadRequest('Нет прав для выполнения данной операции');
    }
    await Items.destroy({ where: { id: itemId } });
    return deleteItem;
}

const getItemAuth = async (itemId, userId) => {
    const item = await Items.findOne({
        where: { id: itemId },
        include: [
            {
                model: OnEdit,
                attributes: ['userId'],
                required: false,
                where: { userId: userId }
            },
            {
                model: Favorite,
                attributes: ['userId'],
                required: false, 
                where: { userId: userId }
            },
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ]
    });
    
    if (!item) {
        throw ApiError.BadRequest('Item not found');
    }

    const plainItem = item.get({ plain: true });
    plainItem.isFavorite = item.favorites && item.favorites.length > 0;
    plainItem.onEdit = item.onEdits && item.onEdits.length > 0;

    return plainItem;
};


const getItem = async (itemId, userId) => {
    const item = await Items.findOne({ 
        where: { id: itemId },
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ]
    });
    if (!item) {
        throw ApiError.BadRequest('Item not found');
    }
    return item;
};

const getUserItemsProfile = async (page, pageSize, userId) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        where: { userId: userId },
        offset,
        limit: pageSize,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Favorite,
                attributes: ['userId'],
                required: false,
                where: { userId: userId }
            },
            {
                model: OnEdit,
                attributes: ['userId'],
                required: false,
                where: { userId: userId }
            },
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ]
    });

    const items = rows.map(item => ({
        ...item.get({ plain: true }),
        isFavorite: item.favorites && item.favorites.length > 0,
        onEdit: item.onEdits && item.onEdits.length > 0
    }));

    return {
        items: items,
        totalPages: Math.ceil(count / pageSize),
    };
};

const getViewUserItems = async (page, pageSize, viewUserId) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        where: { userId: viewUserId },
        offset,
        limit: pageSize,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            }
        ]
    });

    return {
        items: rows,
        totalPages: Math.ceil(count / pageSize),
    };
}

const getFavorites = async (page, pageSize, userId) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        offset,
        limit: pageSize,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Favorite,
                attributes: ['userId'],
                required: true,
                where: { userId: userId }
            },
            {
                model: OnEdit,
                attributes: ['userId'],
                required: false,
                where: { userId: userId }
            },
            {
                model: User,
                attributes: ['id', 'username', 'avatar'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ]
    });

    const items = rows.map(item => ({
        ...item.get({ plain: true }),
        isFavorite: item.favorites && item.favorites.length > 0,
        onEdit: item.onEdits && item.onEdits.length > 0
    }));

    return {
        items: items,
        totalPages: Math.ceil(count / pageSize),
    };
};

module.exports = {
    createItem,
    getItems,
    toggleFavorite,
    getUserItems,
    deleteItem,
    getItemAuth,
    getItem,
    getUserItemsProfile,
    getViewUserItems,
    getFavorites,
}