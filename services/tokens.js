const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/RefreshToken')

const accessToken = id => jwt.sign(
    { id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '5m' }
)

const refreshToken = id => new RefreshToken({
    user_id: id,
    token: crypto.randomBytes(64).toString('hex'),
    expires: expires()
})

const updateMany = async id => await RefreshToken.updateMany({
    user_id: id,
    revoked: null
}, {
    $set: { revoked: new Date(Date.now()) }
})

const verifyAccessToken = token => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
const getRefreshToken = async token => await RefreshToken.findOne({ token, revoked: null })
const expires = () => new Date(Date.now() + 1000 * 3600 * 24 * 14)

module.exports = {
    accessToken,
    refreshToken,
    verifyAccessToken,
    getRefreshToken,
    updateMany,
    expires
}
