'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var TweetSchema = Schema({
    userName: String,
    tweet: [{
        text: String,
    }]
})

module.exports = mongoose.model('tweet', TweetSchema)