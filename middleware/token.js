module.exports = (req, res, next) => {
    req.token = req.cookies.refresh_token?.split(' ')[1]

    if (!req.token) {
        res.status(401)
        return next(new Error('Access Denied'))
    }

    next()
}

module.exports.clear = (req, res, next) => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')

    next()
}
