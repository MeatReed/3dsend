<template>
  <v-app id="3dsend">
    <appheader />
    <v-main>
      <nuxt keep-alive />
    </v-main>
  </v-app>
</template>

<script>
import storage from 'electron-json-storage'

export default {
  created() {
    const context = this
    storage.get('config', async function(error, data) {
      if (error) throw error
      if (!data.dark) {
        await storage.set('config', {
          dark: true,
          port: data.port ? data.port : 9850,
          historyGenerate: data.historyGenerate ? data.historyGenerate : true
        })
        context.$vuetify.theme.dark = true
      } else {
        context.$vuetify.theme.dark = data.dark
      }
    })
  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

body {
  margin: 0 !important;
}

.centered {
  text-align: center;
}
</style>
