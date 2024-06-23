const { Items, Favorite } = require("../models/models")

const createItem = async (newItem) => {
    const createdItem = await Items.create(newItem);
    return {newItem: createdItem};
}

const getItems = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        offset,
        limit: pageSize,
        order: [['createdAt', 'DESC']],
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
            }
        ]
    });

    const items = rows.map(item => ({
        ...item.get({ plain: true }),
        isFavorite: item.favorites && item.favorites.length > 0 
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

module.exports = {
    createItem,
    getItems,
    toggleFavorite,
    getUserItems,
}