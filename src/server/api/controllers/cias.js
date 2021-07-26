const { Router } = require('express')
const router = Router()
const storage = require('electron-json-storage')
const slugify = require('slugify')
const fs = require('fs')
const filesize = require('filesize')

router.post('/generateURL', function(req, res) {
  const file = req.body.file
  if (!fs.existsSync(file.path)) {
    return res.status(400).json({
      error: 'Une erreur est survenue : Le fichier est introuvable !'
    })
  } else {
    const info = {
      name: file.name,
      nameSlug: slugify(file.name),
      path: file.path
    }
    const extArr = ['.cia']
    if (!file.name.includes(extArr)) {
      return res.status(400).json({
        error: "Une erreur est survenue : Le fichier n'est pas un .cia !"
      })
    }
    storage.getMany([ 'config', 'cias' ], function(error, data) {
      if (error) throw error
      if (!data.config.historyGenerate) return
      if (!data.cias[0]) {
        storage.set('cias', [])
        data.cias = []
      }
      const value = data.cias.find((value) => value.nameSlug === info.nameSlug)
      if (!value) {
        let nowData = data.cias
        nowData.push(info)
        storage.set('cias', data.cias)
      }
    })
    storage.set('cia', info)
    res.json({
      info,
      size: fs.statSync(info.path).size,
      port: req.body.port
    })
  }
})

router.get('/install/:slugname', function(req, res, next) {
  const SlugName = req.params.slugname

  if (!SlugName) {
    return res.status(400).json({
      error: 'Une erreur est survenue.'
    })
  } else {
    storage.get('cias', function(error, data) {
      if (error) throw error
      if (!data[0]) {
        storage.set('cias', [])
        data = []
      }
      const value = data.find((value) => value.nameSlug === SlugName)
      if (!fs.existsSync(value.path)) {
        return res.status(400).json({
          error: 'Une erreur est survenue : Le fichier est introuvable !'
        })
      } else {
        res.sendFile(value.path, {
          headers: {
            'Content-Disposition': 'attachment; filename=' + value.name
          }
        })
      }
    })
  }
})

module.exports = router