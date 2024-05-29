const filterEmptyFields = (data) => {
    const userData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value));
    if (!userData.email || !userData.username || !userData.password) {
        return {
            filledData: false,
            necessaryInputs: {
                username: Boolean(!data.username),
                email: Boolean(!data.email),
                password: Boolean(!data.password),
            }
        };
    }
    return {
        filledData: true,
        userData
    };
};

module.exports = filterEmptyFields;