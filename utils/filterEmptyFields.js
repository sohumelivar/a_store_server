const filterEmptyFields = (data) => {
    const userData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value));
    if (!userData.email || !userData.username || !userData.password) {
        return false;
    }
    return userData;
};

module.exports = filterEmptyFields;