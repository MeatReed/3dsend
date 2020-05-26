export const actions = {
  generateURL({}, { file, ipV4 }) {
    return this.$axios.$post(`http://${ipV4}:9850/api/generateURL`, {
      file
    })
  }
}
