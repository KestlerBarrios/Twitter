'use strict'

const express = require('express')

const userController = require('../controllers/userController')
const md_auth = require('../middlewares/authenticated')

var api = express.Router()

api.post('/commands', md_auth.ensureAuth, userController)

module.exports = api