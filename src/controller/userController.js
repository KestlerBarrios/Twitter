'use strict'

const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

const User = require('../models/User')

exports.registerUser = function(req, res) {
    var user = new User()
    var params = req.body

    if(params.name && params.userName && password.password){
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