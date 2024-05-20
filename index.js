require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const router = require('./routes/index');
const sequelize = require('./db');

const PORT = process.env.PORT || 6000;

const app = express();

app.use(express.json({extended: true}));
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', router);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`));
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ start ☢ error:', error)        
    }
};

start();