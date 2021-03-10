const router = require('express').Router()
const Post = require('../models/Post')
const checkID = require('../middleware/checkID')
const verifyToken = require('../middleware/verifyToken')
const validation = require('../middleware/validation')
const { postSchema } = require('../config/schemas')

router.get('/', async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
})

router.post('/create', [verifyToken, validation(postSchema)], async (req, res, next) => {
    const { title, body } = req.body
    const post = new Post({
        title,
        body,
        user_id: req.userId
    })

    try {
        const savedPost = await post.save()
        res.status(201).json(savedPost)
    } catch (err) {
        res.status(500)
        next(err)
    }
})

router.put('/:id', [verifyToken, checkID, validation(postSchema)], async (req, res, next) => {
    const { title, body } = req.body
    const post = await Post.findById(req.params.id)

    if (!post)
        return next()

    try {
        const updatedPost = await Post.updateOne({ _id: req.params.id }, {
            $set: {
                title,
                body,
                updated: new Date(Date.now())
            }
        })

        res.json({ status: Boolean(updatedPost.ok) })
    } catch (err) {
        res.status(500)
        next(err)
    }
})

router.delete('/:id', [verifyToken, checkID], async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (!post)
        return next()

    try {
        const deletedPost = await Post.deleteOne({ _id: req.params.id })
        res.json({ status: Boolean(deletedPost.ok) })
    } catch (err) {
        res.status(500)
        next(err)
    }
})

router.get('/:alias', async (req, res, next) => {
    const post = await Post.findOne({ title: req.params.alias })

    if (!post)
        return next()

    res.json(post)
})

module.exports = router
