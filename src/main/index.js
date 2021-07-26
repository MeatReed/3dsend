import { app } from 'electron'
import storage from 'electron-json-storage'

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

storage.get('cias', function(error, data) {
  if (error) throw error
  if (!data[0]) {
    storage.set('cias', [])
  }
})
storage.get('config', function(error, data) {
  if (error) throw error
  if (!data.dark && !data.port && !data.historyGenerate) {
    storage.set('config', {
      dark: true,
      port: 9850,
      historyGenerate: true
    })
  }
})

// Load server API
require('../server')

// Load here all startup windows
require('./mainWindow')
