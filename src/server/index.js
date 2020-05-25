const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const storage = require('electron-json-storage')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use('/api', require('./api'))

storage.get('config', async function(error, data) {
  console.log(data)
  if (error) throw error
  if (!data.port) {
    await storage.set('config', {
      dark: data.dark ? data.dark : true,
      port: 9850
    })
    app.listen(9850, (err) => {
      if (err) throw err
    })
  } else {
    app.listen(data.port, (err) => {
      if (err) throw err
    })
  }
})
