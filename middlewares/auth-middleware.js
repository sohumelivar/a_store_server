const tokenService = require('../service/token-service');
const ApiError = require("../exceptions/api-error")

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log('authorizationHeader --- >>> ', authorizationHeader);
        if (!authorizationHeader) {
            console.log('tut 0 -------- >>>');
            return res.sendStatus(401);
            // throw ApiError.BadRequest('No access')
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            console.log('tut 1 -------- >>>');
            return res.sendStatus(401);
            // throw ApiError.BadRequest('No access')
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            console.log('tut 2 -------- >>>');
            return res.sendStatus(401);
            // throw ApiError.BadRequest('No access')
        }
        req.user = userData;
        next();
    } catch (error) {
        // console.log('⚛ --- ⚛ --- ⚛ --- ⚛ ---  >>> ☢ error:', error)
        next(error);
    }
}