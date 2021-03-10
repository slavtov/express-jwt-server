const bcrypt = require('bcryptjs')
const User = require('../models/User')

const getAnyOne = async params => {
    const obj = Object.entries(params).map(param => ({ [param[0]]: param[1] }))
    return await User.findOne({ $or: obj })
}

const hashPassword = async password => await bcrypt.hash(password, await salt(10))
const verifyPassword = async (...passwords) => await bcrypt.compare(passwords[0], passwords[1])
const salt = async num => await bcrypt.genSalt(num)

module.exports = {
    getAnyOne,
    hashPassword,
    verifyPassword
}
