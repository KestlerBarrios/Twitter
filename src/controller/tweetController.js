'use strict '

const Tweet = require('../models/Tweet')
const User = require('../models/User')
const Followed = require('../models/Followed')
const Followers = require('../models/Followers')
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
            if (err) return res.status(500).send({ message: 'Error en la peticion' })

            if (tweets) {
                ReTweet.find((err, reTweets) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                    if (!reTweets) return res.status(404).send({ tweets: tweets })
                    if (reTweets) return res.status(200).send({ TweetOriginal: tweets, ReTweet: reTweets })
                })


            }
        })

    } else {
        return res.status(500).send({ message: 'Rellene los datos necesarios' })
    }
}

exports.LIKE_TWEET = function (req, res, arrayC) {

    var userName = req.user.userName
    var idTweet = arrayC[1]

    if (idTweet) {
        Tweet.findById(idTweet, (err, tweet) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!tweet) return res.status(404).send({ message: 'Tweet no encontrado' })
            if (tweet) {
                Followed.findOne({ userName: userName, "followed.followedUser": tweet.userName }, (err, user) => {
                    console.log(user);
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                    if (user) {
                        Tweet.findOne({ _id: idTweet, 'likes.user': userName }, (err, like) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' })
                            if (like) return res.status(200).send({ message: "Ya tiene tu like a este tweet" })
                            if (!like) {
                                Tweet.findOneAndUpdate(idTweet, { $push: { likes: { user: userName } } }, (err, tweetLiked) => {
                                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                    if (tweetLiked) return res.status(200).send({ like: tweetLiked })
                                    if (!tweetLiked) return res.status(404).send({ message: 'Tweet no encontrado' })

                                })
                            }



                        })
                    }
                })
            }
        })

    }

}

exports.DISLIKE_TWEET = function (req, res, arrayC) {

    var userName = req.user.userName
    var idTweet = arrayC[1]

    if (idTweet) {
        Tweet.findById(idTweet, (err, tweet) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!tweet) return res.status(404).send({ message: 'Tweet no encontrado' })
            if (tweet) {
                Followed.findOne({ userName: userName, "followed.followedUser": tweet.userName }, (err, user) => {
                    console.log(user);
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                    if (user) {
                        Tweet.findOne({ _id: idTweet, 'likes.user': userName }, (err, like) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' })
                            if (like) return res.status(200).send({ message: "Ya tiene tu like a este tweet" })
                            if (!like) {
                                Tweet.findOneAndUpdate(idTweet, { $pull: { likes: { user: userName } } }, (err, tweetLiked) => {
                                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                    if (tweetLiked) return res.status(200).send({ like: tweetLiked })
                                    if (!tweetLiked) return res.status(404).send({ message: 'Tweet no encontrado' })

                                })
                            }



                        })
                    }
                })
            }
        })

    }

}

exports.REPLY_TWEET = function (req, res, arrayC) {

}

exports.RETWEET = function (req, res, arrayC) {
    var retweet = new Retweet()
    var userName = req.user.username
    var tweetId = arrayC[1]
    arrayC.shift()
    arrayC.shift()
    var textoRetweet = arrayC.join(" ")

    if (tweetId) {
        Tweet.findById(tweetId, (err, tweet) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (tweet) {
                Followed.findOne({ username: userName, 'followed.followedUser': tweet.username }, (err, user) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                    if (user) {
                        ReTweet.findOne({ username: userName, 'tweet.tweetId': tweetId }, (err, reTweet) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' })
                            if (!reTweet) {
                                retweet.username = userName
                                retweet.retweetComment = textoRetweet
                                retweet.tweet = {
                                    idTweet: tweetId,
                                    userTweet: tweet.userName,
                                    textTweet: tweet.description
                                }

                                retweet.save((err,saved)=>{
                                    if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                    if (!saved) return res.status(404).send({ message: "No se ha podido crear el retweet" });
                                    if (saved) return res.status(200).send({ retweet: saved })
                                })
                            } else {
                                ReTweet.findByIdAndDelete(reTweet._id, (err, retweetDeleted) => {

                                    if (err) return res.status(500).send({ error: 'Error la petición' })
                                    if (!retweetDeleted) return res.status(404).send({ message: 'No se ha podido eliminar el tweet' })
                                    if (retweetDeleted) return res.status(200).send({ TweetEliminado: retweetDeleted })

                                })
                            }
                        })
                    } else {
                        return res.status(404).send({ message: 'No se encontro el usuario' })
                    }
                })
            } else {
                return res.status(404).send({ message: 'No se encontro el tweet' })
            }
        })
    }

}