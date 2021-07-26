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
    storage.get('config', function(error, data) {
      if (error) throw error
      context.$vuetify.theme.dark = data.dark
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