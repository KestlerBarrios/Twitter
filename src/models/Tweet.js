'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var TweetSchema = Schema({
    userName: String,
    text: String,
    cantidadLikes: Number,
    cantidadComment: Number,
    likes: [{
        user: String
    }],
    comments: [{
        userNameComent: String,
        description: String
    }]
})

module.exports = mongoose.model('tweet', TweetSchema)