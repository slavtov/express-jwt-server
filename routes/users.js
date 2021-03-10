const router = require('express').Router()
const User = require('../models/User')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, async (req, res) => {
    const users = await User.find().select('+date')
    res.json(users)
})

router.get('/me', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        res.json({ user })
    } catch (err) {
        next()
    }
})

module.exports = router
