'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

const User = require('../models/User')
const tweetController = require('../controller/tweetController')
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
            FOLLOW(req, res)
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
        case "view_tweet":
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
    if (username && password) {
        user.userName = username
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
        console.log(user);
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                console.log(password);
                console.log(user.password);
                
                
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

function editUser(req, res) {

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para actualizar el Usuario' })
    } else if (users && users.length >= 1) {
        return res.status(500).send({ message: 'El Usuario ya existe.' })
    } else {

        User.findByIdAndUpdate(userId, params, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!userUpdated) return res.status(404).send({ message: 'No se ha podido editar el Usuario' })
            return res.status(200).send({ admin: userUpdated })
        })

    }
}

function deleteUser(req, res) {
    const userId = req.params.id
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para eliminar el Usuario' })
    }

    User.findByIdAndDelete(userId, (err, userDeleted) => {
        if (err) return res.status(500).send({ message: 'Error al borrar el Usuario' })
        return res.status(200).send({ message: 'Usuario Eliminado', user: userDeleted })
    })
}

function PROFILE(req, res) {
    User.findOne({ userName: arrayC[1] }).exec((err, profile) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ perfil: profile })
    })
}

function FOLLOW(username) {

}

function UNFOLLOW(username) {

}