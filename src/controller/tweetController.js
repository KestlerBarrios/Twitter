'use strict'

const Tweet = require('../models/Tweet')

exports.ADD_TWEET = function(req, res, arrayC){
    var tweet = new Tweet()
    console.log(arrayC);
    
    if (arrayC[1]) {
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

exports.DELETE_TWEET = function(idTwwet){

}

exports.EDIT_TWEET = function(idTweet, newTweet){

}

exports.VIEW_TWEETS = function(username){

}

