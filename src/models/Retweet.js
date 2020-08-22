'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReTweetSchema = Schema({

    userName: String,
    textRetweet: String,
    tweet: {
        tweetId: { type: Schema.ObjectId, ref: 'tweet' },
        userTweet: String,
        textTweet: String
    }
})

module.exports = mongoose.model('retweet', ReTweetSchema)