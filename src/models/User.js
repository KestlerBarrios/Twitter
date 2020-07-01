'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    userName: String,
    password: String,
})

module.exports = mongoose.model('usuario', UserSchema)