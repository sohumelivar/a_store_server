const { Items } = require("../models/models")

const createItem = async (newItem) => {
    const createdItem = await Items.create(newItem);
    return {newItem: createdItem};
}

const getItems = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Items.findAndCountAll({
        offset,
        limit: pageSize,
    });

    return {
        items: rows,
        totalPages: Math.ceil(count / pageSize),
    };
};

module.exports = {
    createItem,
    getItems,
}