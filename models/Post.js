const { Schema, model } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: true,
        min: 6
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comments: [{ body: String, date: Date }],
    date: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true, versionKey: false }
})

module.exports = model('Post', schema)
