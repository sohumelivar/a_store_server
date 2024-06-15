const { Items } = require("../models/models")

const createItem = async (newItem) => {
    const createdItem = await Items.create(newItem);
    return {newItem: createdItem};
}

module.exports = {
    createItem,
}