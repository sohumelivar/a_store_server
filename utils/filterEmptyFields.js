const filterEmptyFields = (data) => {
    const filteredData = {};
    for (const key in data) {
        if (data[key] !== null && data[key] !== '' && data[key] !== undefined) {
            filteredData[key] = data[key];
        }
    }
    return filteredData;
};

module.exports = { filterEmptyFields };