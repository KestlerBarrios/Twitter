'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var FollowersSchema = Schema({
    userName: String,
    follower: [{
        followersUser: String
    }]
})

module.exports = mongoose.model('seguidores', FollowersSchema)