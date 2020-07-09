'use strict'

const Tweet = require('../models/Tweet')
const { text } = require('body-parser')

exports.ADD_TWEET = function (req, res, arrayC) {
    var tweet = new Tweet()
    arrayC.shift()
    var textTweet = arrayC.join(' ')

    if (tweetId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para añadir un Tweet' })
    }
    if (textTweet) {
        tweet.text = textTweet
        tweet.save((err, tweetSave) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el Tweet.' })
            if (tweetSave) {
                res.status(200).send({ Tweet: tweetSave })
            } else {
                res.status(404).send({ message: 'No se ha podido agregar el Tweet' })
            }
        })

    }

}

exports.DELETE_TWEET = function (req, res, arrayC) {

    if (tweetId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para Eliminar el Tweet' })
    }
    const tweetId = arrayC[1]
    Tweet.findByIdAndDelete(tweetId, (err, tweetDeleted) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ message: 'Tweet eliminado', tweetEliminado: tweetDeleted })
    })


}

exports.EDIT_TWEET = function (req, res, arrayC) {
    const tweetId = arrayC[1]
    arrayC.shift()
    arrayC.shift()
    var newTweet = arrayC.join(" ")

    if (tweetId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para Editar el Tweet' })
    }
    Tweet.findByIdAndUpdate(tweetId, newTweet, { new: true }, (err, tweetUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!tweetUpdated) return res.status(404).send({ message: 'No se ha podido editar el Tweet' })
        return res.status(200).send({ tweet: tweetUpdated })

    })
}

exports.VIEW_TWEETS = function (req, res, arrayC) {

}