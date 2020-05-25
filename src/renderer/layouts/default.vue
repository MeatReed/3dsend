<template>
  <v-app id="3dsend">
    <appheader />
    <v-content>
      <nuxt keep-alive />
    </v-content>
  </v-app>
</template>

<script>
import storage from 'electron-json-storage'

export default {
  created() {
    const context = this
    storage.get('dark', async function(error, data) {
      if (error) throw error
      if (!data) {
        await storage.set('dark', { dark: true })
        context.$vuetify.theme.dark = true
      } else {
        context.$vuetify.theme.dark = data.dark
      }
    })
  }
}
</script>

<style>
body {
  margin: 0 !important;
}

.centered {
  text-align: center;
}
</style>
