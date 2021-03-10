const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const errorHandler = require('./middleware/errorHandler')
const app = express()

mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())
app.use(require('cors')({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST'
}))
app.use(require('helmet')())
app.use(require('morgan')('combined', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))
app.use('/api', require('./routes'))
app.use(errorHandler.notFound)
app.use(errorHandler)

module.exports = app
