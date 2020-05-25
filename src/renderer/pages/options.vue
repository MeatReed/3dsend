<template>
  <v-container>
    <v-row v-if="alertMessage">
      <v-col>
        <v-alert type="error" dismissible>
          {{ alertMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1>Options</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Apparence</h3>
        <br />
        <v-switch v-model="modelSwitchDarkMode" label="Mode sombre" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import storage from 'electron-json-storage'
import internalIp from 'internal-ip'

export default {
  data: () => ({
    alertMessage: null,
    modelSwitchDarkMode: null
  }),
  created() {
    const context = this
    storage.get('dark', async function(error, data) {
      if (error) throw error
      context.modelSwitchDarkMode = data.dark
    })
  },
  watch: {
    async modelSwitchDarkMode(value) {
      this.$vuetify.theme.dark = value
      await storage.set('dark', { dark: value })
    }
  }
}
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
</style>
