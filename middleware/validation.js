module.exports = schema => (req, res, next) => {
    const { error } = schema.validate(req.body)

    if (error) {
        res.status(400)
        return next(new Error(error.details[0].message))
    }

    next()
}
