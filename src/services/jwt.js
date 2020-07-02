'use strict'

//Creacion del token y contenido

const jwt = require('jwt-simple')
const moment = require('moment')

const secret = 'password'

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        userName: user.userName,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }
    return jwt.encode(payload, secret)
}
