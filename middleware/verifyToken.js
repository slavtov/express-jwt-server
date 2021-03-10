const jwt = require('jsonwebtoken')
const { verifyAccessToken } = require('../services/tokens')

module.exports = (req, res, next) => {
    const token = req.headers.authorization || req.cookies.access_token
    const accessToken = token?.split(' ')[0] === 'Bearer' && token?.split(' ')[1]

    if (!accessToken) {
        res.status(401)
        return next(new Error('Access Denied'))
    }

    try {
        const decoded = verifyAccessToken(accessToken)
        req.userId = decoded.id

        next()
    } catch (err) {
        res.status(403)
        next(new Error('Invalid Access Token'))
    }
}
