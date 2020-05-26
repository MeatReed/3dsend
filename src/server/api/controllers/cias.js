const { Router } = require('express')
const router = Router()
const storage = require('electron-json-storage')
const slugify = require('slugify')
const fs = require('fs')
const filesize = require('filesize')

router.post('/generateURL', async function(req, res) {
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
    storage.get('config', async function(error, config) {
      storage.get('cias', async function(error, data) {
        if (error) throw error
        if (!config.historyGenerate) return
        const value = data.find((value) => value.nameSlug === info.nameSlug)
        if (!value) {
          let nowData = data
          nowData.push(info)
          await storage.set('cias', data)
        }
      })
    })
    res.json({
      info,
      size: filesize(fs.statSync(info.path).size),
      port: req.body.port
    })
  }
})

router.get('/install/:slugname', function(req, res, next) {
  const SlugName = req.params.slugname

  if (!SlugName) {
    return res.status(400).json({
      error: 'Une erreur est survenue'
    })
  } else {
    storage.get('cias', function(error, data) {
      if (error) throw error
      const value = data.find((value) => value.nameSlug === SlugName)
      if (!fs.existsSync(value.path)) {
        return res.status(400).json({
          error: 'Une erreur est survenue : Le fichier est introuvable !'
        })
      } else {
        res.sendFile(value.path)
      }
    })
  }
})

module.exports = router
