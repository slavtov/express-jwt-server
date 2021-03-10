const { Schema, model } = require('mongoose')

const schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    revoked: Date
}, {
    collection: 'refresh_tokens',
    toObject: { virtuals: true },
    toJSON: { virtuals: true, versionKey: false }
})

schema.virtual('isExpired').get(function() {
    return this.expires < Date.now()
})

module.exports = model('RefreshToken', schema)
