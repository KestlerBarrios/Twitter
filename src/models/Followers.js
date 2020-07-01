'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var FollowersSchema = Schema({
    userName: {type: Schema.ObjectId, ref: 'usuario'},
})

module.exports = mongoose.model('seguidores', FollowersSchema)