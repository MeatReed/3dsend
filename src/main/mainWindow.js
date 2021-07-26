import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  height: 720,
  width: 1280,
  frame: false,
  resizable: true,
  webPreferences: {
    enableRemoteModule: true
  }
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
