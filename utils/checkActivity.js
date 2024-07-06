const cron = require('node-cron');
const { User } = require('../models/models');
const { checkActivityMail } = require('../service/mail-service');
const { Op } = require('sequelize');

const checkUserActivity = async () => {
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    const OneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const inactiveUsers = await User.findAll({
        where: {
            lastActivity: {
                [Op.lt]: oneMonthAgo
            }
        }
    });
    for (const user of inactiveUsers) {
        try {
            console.log("Sending email to:", user.email);
            await checkActivityMail(user.email);
            user.lastActivity = new Date();
            await user.save();
            console.log("Updated lastActivity for user:", user.email);
        } catch (error) {
            console.error("Error processing user:", user.email, error);
        }
    }
};

// cron.schedule('*/1 * * * *', checkUserActivity);
cron.schedule('0 9 * * *', checkUserActivity);