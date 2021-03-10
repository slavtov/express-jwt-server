const router = require('express').Router()
const User = require('../models/User')
const validation = require('../middleware/validation')
const token = require('../middleware/token')
const UserService = require('../services/users')
const TokenService = require('../services/tokens')
const { registerSchema, loginSchema } = require('../config/schemas')

router.post('/register', validation(registerSchema), async (req, res, next) => {
    const { username, email, password } = req.body
    const exists = await UserService.getAnyOne({ username, email })

    if (exists) {
        const error = exists.email === email ? 'Email' : 'Username'
        res.status(403)

        return next(new Error(`${error} already exists`))
    }

    const hashedPassword = await UserService.hashPassword(password)
    const user = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        const accessToken = TokenService.accessToken(savedUser._id)
        const refreshToken = TokenService.refreshToken(savedUser._id)
        await refreshToken.save()

        res.status(201).cookie('refresh_token', `Bearer ${refreshToken.token}`, {
            maxAge: 1000 * 3600 * 24 * 10,
            httpOnly: true,
            sameSite: true,
            // secure: true
        }).json({
            user: savedUser,
            access_token: accessToken,
            refresh_token: refreshToken.token
        })
    } catch (err) {
        res.status(500)
        next(err)
    }
})

router.post('/login', validation(loginSchema), async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        res.status(403)
        return next(new Error('Invalid email or password'))
    }

    const verifyPassword = await UserService.verifyPassword(password, user.password)

    if (!verifyPassword) {
        res.status(403)
        return next(new Error('Invalid password'))
    }

    const accessToken = TokenService.accessToken(user._id)
    const refreshToken = TokenService.refreshToken(user._id)

    try {
        await refreshToken.save()

        res.cookie('refresh_token', `Bearer ${refreshToken.token}`, {
            maxAge: 1000 * 3600 * 24 * 10,
            httpOnly: true,
            sameSite: true,
            // secure: true
        }).json({
            user,
            access_token: accessToken,
            refresh_token: refreshToken.token
        })
    } catch (err) {
        res.status(500)
        next(err)
    }
})

router.get('/refresh', token, async (req, res, next) => {
    const refreshToken = await TokenService.getRefreshToken(req.token)

    if (!refreshToken)
        return next()

    if (refreshToken.isExpired) {
        refreshToken.revoked = new Date(Date.now())

        try {
            await refreshToken.save()
            res.status(403)

            return next(new Error('Refresh Token has expired'))
        } catch (err) {
            res.status(500)
            next(err)
        }
    }

    const user = await User.findById(refreshToken.user_id)

    if (!user)
        return next()

    const accessToken = TokenService.accessToken(user._id)
    refreshToken.expires = TokenService.expires()

    try {
        await refreshToken.save()

        res.json({
            user,
            access_token: accessToken,
            refresh_token: refreshToken.token
        })
    } catch (err) {
        res.status(500)
        next(err)
    }
})

router.get('/logout', [token, token.clear], async (req, res, next) => {
    const refreshToken = await TokenService.getRefreshToken(req.token)

    if (!refreshToken)
        return next()

    try {
        await TokenService.updateMany(refreshToken.user_id)
        res.status(204).send()
    } catch (err) {
        res.status(500)
        next(err)
    }
})

module.exports = router
