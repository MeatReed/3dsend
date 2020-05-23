const express = require('express')

// Add cias Routes
var router = express.Router()

var cias = require('./controllers/cias')

router.use(cias)

module.exports = router
