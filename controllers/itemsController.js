const getItems = async (req, res) => {
    try {
        const headers = req.get('Authorization');
        const itemsArray = [];
        for (let i = 1; i <= 20; i++) {
            itemsArray.push({
                id: i,
                photo: ['https://iatkv.tmgrup.com.tr/eb155a/375/375/844/0/1920/1074?u=https%3A%2F%2Fitkv.tmgrup.com.tr%2F2023%2F09%2F11%2Fiphone-15-ne-zaman-cikacak-iphone-15-fiyati-ve-ozellikleri-iste-turkiye-fiyati-1694440213004.jpg', 
                'https://primetel.com.cy/image/original/2/iphone-14-pro-primetel-1.jpg',
                'https://ict.xabar.uz/static/crop/1/0/736_736_95_1076882936.jpg'],
                itemName: `Example Item ${i}`,
                description: `Description for item ${i}`,
                price: Math.floor(Math.random() * 100),
                category: i % 2 === 0 ? "Electronics" : "Books",
                onEdit: i % 2 === 0,
            });
        }
        res.json(itemsArray);
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ getItem ☢ error:', error)
    }
}

const getItemWithId = async (req, res) => {
    try {
        const { id } = req.body;           

        res.json({id: 1,
            photo: ['https://iatkv.tmgrup.com.tr/eb155a/375/375/844/0/1920/1074?u=https%3A%2F%2Fitkv.tmgrup.com.tr%2F2023%2F09%2F11%2Fiphone-15-ne-zaman-cikacak-iphone-15-fiyati-ve-ozellikleri-iste-turkiye-fiyati-1694440213004.jpg', 
            'https://primetel.com.cy/image/original/2/iphone-14-pro-primetel-1.jpg',
            'https://ict.xabar.uz/static/crop/1/0/736_736_95_1076882936.jpg'],
            itemName: `Example Item ${1}`,
            description: `Description for item ${1}`,
            price: Math.floor(Math.random() * 100),
            category: 1 % 2 === 0 ? "Electronics" : "Books",
            onEdit: 1 % 2 === 0,}); 
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ getItems ☢ error:', error)
    }
}

const toggleStateFavorite = async (req, res) => {
    try {
        const { itemId, userId } = req.body;
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ toggleStateFavorite ☢ userId:', userId)

        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ toggleStateFavorite ☢ itemId:', itemId)

        res.json({response: 'toggleStateFavorite'});
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ UserController ☢ toggleStateFavorite ☢ error:', error)
    }
}

const addItem = async (req, res) => {
    try {
        const {
            itemName, 
            category, 
            description, 
            price, 
            photo 
        } = req.body;
        console.log('itemname --- >>> ', itemName);
        res.json({status: "add item success"})
    } catch (error) {
        console.log("add item error", error);
    }
}

module.exports = {
    getItems,
    getItemWithId,
    toggleStateFavorite,
    addItem,
}