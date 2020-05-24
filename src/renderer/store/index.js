export const actions = {
  generateURL({}, { filePath, fileName, ipV4 }) {
    return this.$axios.$post(`http://${ipV4}:9850/api/generateURL`, {
      filePath,
      fileName
    })
  }
}
