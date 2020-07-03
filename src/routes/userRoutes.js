'use strict'

const express = require('express')

const userController = require('../controller/userController')
const md_auth = require('../middlewares/authenticated')

var api = express.Router()

api.post('/commands', userController.editUser)

module.exports = api