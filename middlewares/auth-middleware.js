const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log('authorizationHeader --- >>> ', authorizationHeader);
        if (!authorizationHeader) {
            console.log('tut 0 -------- >>>');
            return res.sendStatus(401);
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            console.log('tut 1 -------- >>>');
            return res.sendStatus(401);
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            console.log('tut 2 -------- >>>');
            return res.sendStatus(401);
        }
        req.user = userData;
        next();
    } catch (error) {
        console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ error:', error)
    }
}