const { Types: { ObjectId } } = require('mongoose')

module.exports = (req, res, next) => {
    if (ObjectId.isValid(req.params.id))
        return next()

    res.status(400)
    next(new Error('Invalid ID'))
}
