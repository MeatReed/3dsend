const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use('/api', require('./api'))

app.listen(9850, (err) => {
  if (err) throw err
})
