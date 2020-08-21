'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

const User = require('../models/User')
const tweetController = require('../controller/tweetController')
const Followed = require('../models/Followed')
const Followers = require('../models/Followers')
var arrayC = []

exports.commands = function (req, res) {
    var params = req.body
    arrayC = params.commands.split(" ")
    switch (arrayC[0]) {
        case "register":
            REGISTER(req, res)
            break;
        case "login":
            LOGIN(req, res)
            break;
        case "edituser":
            editUser(req, res)
            break;
        case "deleteuser":
            deleteUser(req, res)
            break;
        case "profile":
            PROFILE(req, res)
            break;
        case "follow":
            FOLLOW(req, res, arrayC)
            break;
        case "unfollow":
            UNFOLLOW(req, res)
            break;
        case "add_tweet":
            tweetController.ADD_TWEET(req, res, arrayC)
            break;
        case "delete_tweet":
            tweetController.DELETE_TWEET(req, res, arrayC)
            break;
        case "edit_tweet":
            tweetController.EDIT_TWEET(req, res, arrayC)
            break;
        case "view_tweets":
            tweetController.VIEW_TWEETS(req, res, arrayC)
            break;
        default:
            res.status(404).send({ message: "Codigo invalido" })
            break;
    }
}

function REGISTER(req, res) {
    var username = arrayC[1]
    var password = arrayC[3]
    var user = new User()
    var followed = new Followed()
    var followers = new Followers()
    if (username && password) {
        user.userName = username
        followed.userName = username
        followers.userName = username

        User.find({ userName: username }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion.' })
            if (users && users.length >= 1) {
                return res.status(500).send({ message: 'El Usuario ya existe.' })
            } else {
                bcrypt.hash(password, null, null, (err, hash) => {
                    user.password = hash
                    user.save((err, userSave) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el Usuario.' })
                        if (userSave) {
                            followed.save((err, followedSave) => {
                                if (err) return res.status(500).send({ message: 'Error al guardar el los Seguidos.' })
                                if (!followedSave) res.status(404).send({ message: `No se han podido registrar los seguidos de ${username} ` })
                            })
                            followers.save((err, followersSave) => {
                                if (err) return res.status(500).send({ message: 'Error al guardar los Seguidores.' })
                                if (!followersSave) res.status(404).send({ message: `No se han podido registrar los seguidores de ${username} ` })
                            })
                            res.status(200).send({ usuario: userSave })
                        } else {
                            res.status(404).send({ message: `No se ha podido registrar ${username} ` })
                        }
                    })
                })
            }
        })
    }


}

function LOGIN(req, res) {
    var username = arrayC[1]
    var password = arrayC[2]
    User.findOne({ userName: username }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' })
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                console.log(user);
                if (check) {
                    if (arrayC[3]) {
                        return res.status(200).send({ token: jwt.createToken(user) })
                    } else {
                        user.password = undefined
                        return res.status(200).send({ user: user })
                    }
                } else {
                    res.status(404).send({ message: 'El usuario no se ha podido identificar.' })
                }
            })
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido logear' })
        }
    })
}

function PROFILE(req, res) {
    User.findOne({ userName: arrayC[1] }).exec((err, profile) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ perfil: profile })
    })
}

function FOLLOW(req, res, arrayC) {
    var userName = req.user.userName
    var user = arrayC[1]

    if (user) {
        User.findOne({ userName: userName }, (err, userFollowed) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!userFollowed) return res.status(404).send({ message: 'El Usuario no Existe' })
            if (userFollowed) {
                if (userFollowed.userName == user) {
                    return res.status(200).send({ message: 'No te puedes seguir a ti mismo' })

                } else {
                    Followed.findOne({ username: userName, 'followed.user': user }, (err, userFollowed) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' })
                        if (!userFollowed) {
                            Followed.findOneAndUpdate({ userName: userName }, { $push: { followed: { followedUser: user } } }, { new: true }, (err, followedUpdate) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                if (!followedUpdate) return res.status(404).send({ message: 'Usuario no encontrado' })
                                if (followedUpdate) {
                                    User.findOneAndUpdate({ userName: userName }, { $inc: { "following": 1 } }, { new: true }, (err, followedSum) => {
                                        if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                        if (!followedSum) return res.status(404).send({ message: 'No se pudo sumar el usuario' })
                                        if (followedSum) {
                                            Followers.findOneAndUpdate({ userName: user }, { $push: { followers: { followersUser: userName } } }, { new: true }, (err, followerUpdate) => {
                                                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                                if (!followerUpdate) return res.status(404).send({ message: 'No se pudo sumar el usuario' })
                                                if (followerUpdate) {
                                                    User.findOneAndUpdate({ userName: userName }, { $inc: { "followers": 1 } }, { new: true }, (err, followerSum) => {
                                                        if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                                        if (!followerSum) return res.status(404).send({ message: 'No se pudo sumar el seguidor' })
                                                        if (followerSum) return res.status(200).send({ followed: followedUpdate })
                                                    })
                                                }

                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            return res.status(404).send({ message: 'Ya sigues a este usuario' })
                        }

                    })
                }
            }

        })

    }


}

function UNFOLLOW(username) {
    var userName = req.user.userName
    var user = arrayC[1]

    if (user) {
        User.findOne({ userName: userName }, (err, userFollowed) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!userFollowed) return res.status(404).send({ message: 'El Usuario no Existe' })
            if (userFollowed) {
                if (userFollowed.userName == user) {
                    return res.status(200).send({ message: 'No te puedes seguir a ti mismo' })

                } else {
                    Followed.findOne({ username: userName, 'followed.user': user }, (err, userFollowed) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' })
                        if (!userFollowed) {
                            Followed.findOneAndUpdate({ userName: userName }, { $pull: { followed: { followedUser: user } } }, { new: true }, (err, followedUpdate) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                if (!followedUpdate) return res.status(404).send({ message: 'Usuario no encontrado' })
                                if (followedUpdate) {
                                    User.findOneAndUpdate({ userName: userName }, { $inc: { "following": -1 } }, { new: true }, (err, followedSum) => {
                                        if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                        if (!followedSum) return res.status(404).send({ message: 'No se pudo sumar el usuario' })
                                        if (followedSum) {
                                            Followers.findOneAndUpdate({ userName: user }, { $pull: { followers: { followersUser: userName } } }, { new: true }, (err, followerUpdate) => {
                                                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                                if (!followerUpdate) return res.status(404).send({ message: 'No se pudo sumar el usuario' })
                                                if (followerUpdate) {
                                                    User.findOneAndUpdate({ userName: userName }, { $inc: { "followers": -1 } }, { new: true }, (err, followerSum) => {
                                                        if (err) return res.status(500).send({ message: 'Error en la peticion' })
                                                        if (!followerSum) return res.status(404).send({ message: 'No se pudo sumar el seguidor' })
                                                        if (followerSum) return res.status(200).send({ followed: followedUpdate })
                                                    })
                                                }

                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            return res.status(404).send({ message: 'Ya sigues a este usuario' })
                        }
                    })
                }
            }
        })
    }
}