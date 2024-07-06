const { User } = require("../models/models");

const updateUserActivity = async (id) => {
    await User.update(
        { lastActivity: new Date() },
        { where: { id } }
    );
};

module.exports = {
    updateUserActivity,
}