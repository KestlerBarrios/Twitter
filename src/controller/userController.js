'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

const User = require('../models/User')

exports.registerUser = function (req, res) {
    var user = new User()
    var params = req.body

    if (params.name && params.userName && password.password) {
        user.name = params.name
        user.userName = params.userName
        User.find({ $or: { user: user.user } }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion.' })
            if (users && users.length >= 1) {
                return res.status(500).send({ message: 'El Usuario ya existe.' })
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash
                    user.save((err, userSave) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el Administrador.' })
                        if (userSave) {
                            res.status(200).send({ admin: userSave })
                        } else {
                            res.status(404).send({ message: `No se ha podido registrar ${params.nombre} ` })
                        }
                    })
                })
            }
        })
    }


}

exports.login = function (req, res) {
    const params = req.body
    User.findOne({ userName: params.userName }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (user) {
            bcrypt.compare(params.password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({ token: jwt.createToken(user) })
                    } else {
                        admin.password = undefined
                        return res.status(200).send({ hotel: user })
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

exports.editUser = function (req, res) {
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

exports.deleteUser = function (req, res) {
    const userId = req.params.id
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No posee los permisos para eliminar el Usuario' })
    }

    User.findByIdAndDelete(userId, (err, userDeleted)=>{
        if (err) return res.status(500).send({ message: 'Error al borrar el Usuario' })
        return res.status(200).send({ message: 'Usuario Eliminado', user: userDeleted })
    })
}