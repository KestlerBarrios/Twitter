'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TweetSchema = Schema({
    userName: {type: Schema.ObjectId, ref: 'usuario'},
    text: String,
})

module.exports = mongoose.model('tweet', TweetSchema)