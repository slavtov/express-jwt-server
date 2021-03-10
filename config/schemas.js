const Joi = require('joi')

module.exports.registerSchema = Joi.object({
    username: Joi.string()
        .min(6)
        .required(),
    email: Joi.string()
        .min(6)
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
})

module.exports.loginSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
})

module.exports.postSchema = Joi.object({
    title: Joi.string()
        .min(6)
        .required(),
    body: Joi.string()
        .required()
})
