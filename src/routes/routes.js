'use strict'

const express = require('express')

const Controllers = require('../controller/Controllers')
const md_auth = require('../middlewares/authenticated')

var api = express.Router()

api.post('/commands', md_auth.ensureAuth, Controllers.commands)

module.exports = api