'use strict'

const Tweet = require('../models/Tweet')
const User = require('../models/User')
const ReTweet = require('../models/Retweet')

exports.ADD_TWEET = function (req, res, arrayC) {
    var userName = req.user.userName
    var tweet = new Tweet()
    arrayC.shift()
    var textTweet = arrayC.join(' ')
    if (textTweet) {
        tweet.userName = userName
        tweet.text = textTweet
        tweet.cantidadLikes = 0
        tweet.cantidadComments = 0
        tweet.likes = []
        tweet.comments = []

        tweet.save((err, tweetSaved) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!tweetSaved) return res.status(404).send({ message: 'Error al guardar el Tweet' })
            if (tweetSaved) {
                User.findOneAndUpdate({ userName: userName }, { $inc: { "tweets": 1 } }, { new: true }, (err, userUpdated) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                    if (!userUpdated) return res.status(404).send({ message: 'Error al sumar el Tweet' })
                    if (userUpdated) return res.status(200).send({ tweet: tweetSaved })
                })
            }
        })

    } else {
        return res.status(500).send({ message: 'Por favor rellene los datos necesarios' })
    }
}

exports.DELETE_TWEET = function (req, res, arrayC) {

    var tweetId = arrayC[1]
    var userName = req.user.userName
    Tweet.findOneAndDelete({ userName: userName, _id: tweetId }, (err, tweetDeleted) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!tweetDeleted) return res.status(404).send({ message: 'Error al guardar el Tweet' })
        if (tweetDeleted) {
            User.findOneAndUpdate({ userName: userName }, { $inc: { "tweets": -1 } }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                if (!userUpdated) return res.status(404).send({ message: 'Error al sumar el Tweet' })
                if (userUpdated) return res.status(200).send({ message: 'Tweet eliminado', tweetEliminado: tweetDeleted })
            })

        }
    })


}

exports.EDIT_TWEET = function (req, res, arrayC) {
    var userName = req.user.userName
    var tweetId = arrayC[1]
    arrayC.shift()
    arrayC.shift()
    var newTweet = arrayC.join(" ")
    if (newTweet) {
        Tweet.findByIdAndUpdate({ usernName: userName, _id: tweetId }, { text: newTweet }, { new: true }, (err, tweetUpdated) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!tweetUpdated) return res.status(404).send({ message: 'No se ha podido editar el Tweet' })
            return res.status(200).send({ tweetNuevo: tweetUpdated })
        })

    }
}

exports.VIEW_TWEETS = function (req, res, arrayC) {
    var userName = arrayC[1]

    if (userName) {
        Tweet.find({ userName: userName }, (err, tweets) => { 
            if (err) return res.status(500).send({message: 'Error en la peticion'})

            if (tweets) {
                ReTweet.find((err, reTweets)=>{
                    if (err) return res.status(500).send({message: 'Error en la peticion'})
                    if (!reTweets) return res.status(404).send({tweets: tweets})
                    if (reTweets) return res.status(200).send({TweetOriginal: tweets, ReTweet:reTweets})
                })
                
                
            }
        })

    }else{
        return res.status(500).send({message: 'Rellene los datos necesarios'})
    }
}