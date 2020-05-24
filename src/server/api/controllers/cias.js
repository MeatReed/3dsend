const { Router } = require('express')
const router = Router()
const storage = require('electron-json-storage')
const internalIp = require('internal-ip')
const slugify = require('slugify')
const fs = require('fs')

router.post('/generateURL', async function(req, res) {
  const fileLocation = req.body.filePath
  const fileName = req.body.fileName
  const ipV4 = await internalIp.v4()
  if (!fs.existsSync(fileLocation)) {
    return res.status(400).json({
      error: 'Une erreur est survenue : Le fichier est introuvable !'
    })
  } else {
    const info = {
      name: fileName,
      nameSlug: slugify(fileName),
      path: fileLocation,
      url: `http://${ipV4}:9850/api/install/` + slugify(fileName)
    }
    storage.get('cias', async function(error, data) {
      if (error) throw error
      const value = data.find((value) => value.nameSlug === info.nameSlug)
      if (!value) {
        let nowData = data
        nowData.push(info)
        await storage.set('cias', data)
      }
    })
    res.json(info)
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
