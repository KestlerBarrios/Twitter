'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var FollowedSchema = Schema({
    userName: {type: Schema.ObjectId, ref: 'usuario'},
    followed: {type: Schema.ObjectId, ref: 'usuario'}
})

module.exports = mongoose.model('seguidos', FollowedSchema)