const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        select: false,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        select: false,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret, options) => {
            delete ret.password
            return ret
        }
    }
})

module.exports = mongoose.model('User', schema)
