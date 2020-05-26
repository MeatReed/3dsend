import storage from 'electron-json-storage'

export const actions = {
  generateURL({}, { file, ipV4, port }) {
    const context = this
    return context.$axios.$post(`http://${ipV4}:${port}/api/generateURL`, {
      file,
      port
    })
  }
}
