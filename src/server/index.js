const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const storage = require('electron-json-storage')
const fs = require('fs')
const path = require('path')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use('/api', require('./api'))

app.get('/', function(req, res, next) {
  storage.get('cia', function(error, data) {
    const pathFile = path.join(data.path)
    if (error) throw error
    if (!fs.existsSync(pathFile)) {
      return res.status(400).json({
        error: 'Une erreur est survenue : Le fichier est introuvable !'
      })
    } else {
      if (pathFile) {
        res.sendFile(pathFile, {
          headers: {
            'Content-Disposition': 'attachment; filename=' + data.name
          }
        })
      } else {
        return res.status(400).json({
          error: 'Une erreur est survenue.'
        })
      }
    }
  })
})

storage.get('config', async function(error, data) {
  if (error) throw error
  if (!data.port) {
    await storage.set('config', {
      dark: data.dark ? data.dark : true,
      port: 9850,
      historyGenerate: data.historyGenerate ? data.historyGenerate : true
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
