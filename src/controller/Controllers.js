'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

const User = require('../models/User')
var arrayCommands = []

exports.commands = function (req, res) {
    var params = req.body
    arrayCommands = params.commands.split(" ")
    switch (arrayCommands[0]) {
        case "register":
            REGISTER(req, res)
            break;
        case "login":
            LOGIN(req,res)
            break;
        case "edituser":
            editUser(req,res)
            break;
        case "deleteuser":
            deleteUser(req,res)
            break;
        case "profile":
            profile(req,res)
            break;
        case "follow":
            FOLLOW(req,res)
            break;
        case "unfollow":
            UNFOLLOW(req,res)
            break;
        default:
            res.status(404).send({message: "Codigo invalido"})
            break;
    }
}

function REGISTER(req, res) {
    var username = arrayCommands[1]
    var password = arrayCommands[3]
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
    var username = arrayCommands[1]
    var password = arrayCommands[2]
    User.findOne({ userName: username }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (arrayCommands[3]) {
                        return res.status(200).send({ token: jwt.createToken(user) })
                    } else {
                        user.password = undefined
                        return res.status(200).send({ user : user })
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
    const userId = req.params.id
    const params = req.body

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para actualizar el Usuario' })
    }

    User.findByIdAndUpdate(userId, params, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!userUpdated) return res.status(404).send({ message: 'No se ha podido editar el Usuario' })
        return res.status(200).send({ admin: userUpdated })
    })

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
    var params = req.body
    User.findOne({ userName: params.username }).exec((err, profile) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ perfil: profile })
    })
}

function FOLLOW(username) {

}

function UNFOLLOW(username) {

}