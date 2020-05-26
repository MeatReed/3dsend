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
        <h1>Paramètres</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Apparence</h3>
        <br />
        <v-switch v-model="modelSwitchDarkMode" label="Mode sombre" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Serveur</h3>
        <br />
        <v-text-field
          v-model="modelInputPort"
          :rules="[(v) => !!v || 'Vous devez mettre un port obligatoirement !']"
          label="Port"
          name="port"
          type="number"
        />
        <v-btn small color="primary" @click="savePortChange">Sauvegarder</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Historique des générations</h3>
        <br />
        <v-switch v-model="modelSwitchHistoryQRCode" label="Activer/désactiver l'historique" />
      </v-col>
    </v-row>
    <v-dialog v-model="dialogRestart" max-width="400">
      <v-card>
        <v-card-title class="headline">Attention !</v-card-title>

        <v-card-text>
          {{ messageRestart }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialogRestart = false">
            Pas maintenant
          </v-btn>

          <v-btn text @click="relaunch">
            Redémarrer 3DSend
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import storage from 'electron-json-storage'
import internalIp from 'internal-ip'
import tcpPortUsed from 'tcp-port-used'
import { remote } from 'electron'

export default {
  data: () => ({
    alertMessage: null,
    modelSwitchDarkMode: null,
    modelSwitchHistoryQRCode: null,
    modelInputPort: null,
    config: null,
    dialogRestart: false,
    messageRestart: null
  }),
  created() {
    const context = this
    storage.get('config', async function(error, data) {
      if (error) throw error
      context.config = data
      context.modelSwitchDarkMode = data.dark ? data.dark : true
      context.modelSwitchHistoryQRCode = data.historyGenerate ? data.historyGenerate : true
      context.modelInputPort = data.port ? data.port : 9850
    })
  },
  watch: {
    async modelSwitchDarkMode(value) {
      this.$vuetify.theme.dark = value
      storage.get('config', async function(error, data) {
        await storage.set('config', {
          dark: value,
          port: data.port ? data.port : 9850,
          historyGenerate: data.historyGenerate ? data.historyGenerate : true
        })
      })
    },
    async modelSwitchHistoryQRCode(value) {
      const context = this
      storage.get('config', async function(error, data) {
        await storage.set('config', {
          dark: data.dark ? data.dark : true,
          port: data.port ? data.port : 9850,
          historyGenerate: value
        })
      })
    }
  },
  methods: {
    async savePortChange() {
      const ipV4 = await internalIp.v4()
      const context = this
      tcpPortUsed.check(parseInt(this.modelInputPort), ipV4).then(
        async function(inUse) {
          if (inUse) {
            context.alertMessage =
              'Le port ' + context.modelInputPort + ' est déjà utilisé !'
          } else {
            await storage.set('config', {
              dark: context.modelSwitchDarkMode,
              port: context.modelInputPort,
              historyGenerate: context.modelSwitchHistoryQRCode
            })
            context.messageRestart =
              '3DSend a besoin de redémarrer pour changer le port !'
            context.dialogRestart = true
          }
        },
        function(err) {
          context.alertMessage = err
        }
      )
    },
    async relaunch() {
      remote.app.relaunch()
      remote.getCurrentWindow().close()
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
