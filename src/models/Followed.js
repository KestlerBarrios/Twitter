'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FollowedSchema = Schema({
    userName: String,
    followed: [{
        followedUser: String
    }]
})

module.exports = mongoose.model('followed', FollowedSchema)