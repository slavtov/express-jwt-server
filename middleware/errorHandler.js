module.exports = (err, req, res, next) => {
    res.json({ message: err.message })
}

module.exports.notFound = (req, res) => {
    res.status(404).json({ message: 'Not Found' })
}
