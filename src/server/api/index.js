const express = require('express')

var router = express.Router()

// Add cias Routes
var cias = require('./controllers/cias')

router.use(cias)

module.exports = router