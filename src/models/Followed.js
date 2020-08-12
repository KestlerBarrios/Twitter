'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var FollowedSchema = Schema({
    userName: String,
    followed: [{
        userName: String
    }]
})

module.exports = mongoose.model('seguidos', FollowedSchema)