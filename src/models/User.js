'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var UserSchema = Schema({
    userName: String,
    password: String,
    tweets: Number,
    following: Number,
    followers: Number
})

module.exports = mongoose.model('usuario', UserSchema)