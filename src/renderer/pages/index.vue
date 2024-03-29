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
        <h1>Générer un QRCode</h1>
        <v-file-input
          v-model="modelCiaChoose"
          placeholder="Choisir un fichier .cia"
          label="Fichier .cia"
          accept=".cia"
          prepend-icon="mdi-paperclip"
          :disabled="disabledInputFile"
          color="primary"
        >
          <template v-slot:selection="{ text }">
            <v-chip small label color="primary">
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="centered">
        <v-btn
          small
          color="primary"
          :disabled="disabledBtnQRCode"
          @click="createQRCode"
          >Créer un QRCode</v-btn
        >
        <v-btn small color="primary" @click="dialogHistoryFiles = true"
          >Historique des QRCodes générés</v-btn
        >
        <v-btn small color="primary" @click="dialogQRCode = true"
          >Options de QRCode</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="QRCodeLoading" class="centered">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        />
      </v-col>
      <v-col
        v-else-if="fileReceived && !QRCodeLoading"
        class="centered colQRCode"
      >
        <h2>{{ fileReceived.info.name }}</h2>
        <p class="text--disabled">{{ fileReceived.info.path }}</p>
        <p class="text--disabled">{{ fileReceived.size }}</p>
        <a @click="openLink(QRCodeURL)"
          ><qrcode-vue
            :value="QRCodeURL"
            class="qrcode"
            :size="QRCodeSize"
            :background="QRCodeBackgroundColor"
            :foreground="QRCodeForegroundColor"
            :level="modelQRCodeLevel"
        /></a>
        <p class="text--disabled">Lien #1 : {{ QRCodeURL }}</p>
        <p class="text--disabled">Lien #2 : {{ localUrl }}</p>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogHistoryFiles" width="600">
      <v-card>
        <v-card-title>
          Historique des QRCodes générés
        </v-card-title>
        <v-progress-circular
          v-if="$fetchState.pending"
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        />
        <v-list dense v-else>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, i) in ciasStorage"
              :key="i"
              @click="recreateQRCode(item.path, item.name)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="`Nom : ${item.name}`" />
                <v-list-item-subtitle>{{ item.path }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card-text v-if="!ciasStorage[0]">
          Aucun QRCode généré !
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="deleteHistory()">
            Supprimer l'historique
          </v-btn>
          <v-btn text color="primary" @click="dialogHistoryFiles = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogQRCode" width="600">
      <v-card>
        <v-card-title>
          Modifier le QRCode
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="modelQRCodeLevel"
            label="QRCode Level"
            :items="itemsQRCode"
            dense
            outlined
          />
          <v-slider
            v-model="QRCodeSize"
            min="100"
            max="500"
            label="Taille du QRCode"
          />
          <label>QRCode foreground</label>
          <v-color-picker
            class="noBorder"
            hide-mode-switch
            hide-inputs
            v-model="QRCodeForegroundColor"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogQRCode = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { remote } from 'electron'
import storage from 'electron-json-storage'
import QrcodeVue from 'qrcode.vue'
import { networkInterfaces } from 'os';

export default {
  components: {
    QrcodeVue
  },
  data: () => ({
    modelCiaChoose: null,
    fileSelected: null,
    disabledBtnQRCode: true,
    fileReceived: null,
    QRCodeLoading: false,
    QRCodeURL: null,
    disabledInputFile: false,
    dialogHistoryFiles: false,
    dialogQRCode: false,
    alertMessage: null,
    ciasStorage: [],
    itemsQRCode: ['L', 'M', 'Q', 'H'],
    modelQRCodeLevel: 'Q',
    QRCodeSize: 300,
    QRCodeBackgroundColor: '#ffffff',
    QRCodeForegroundColor: '#000000',
    localUrl: null
  }),
  fetch() {
    const context = this
    storage.get('cias', function(error, data) {
      if (error) throw error
      context.ciasStorage = data.reverse()
    })
  },
  watch: {
    modelCiaChoose(file) {
      this.fileSelected = {
        path: file.path,
        name: file.name
      }
      this.QRCodeURL = null
      this.fileReceived = null
      if (file) {
        this.disabledBtnQRCode = false
      } else {
        this.disabledBtnQRCode = true
      }
    }
  },
  methods: {
    recreateQRCode(path, name) {
      const file = {
        path,
        name
      }
      this.fileSelected = file
      this.fileReceived = null
      this.dialogHistoryFiles = false
      this.createQRCode()
    },
    createQRCode() {
      this.QRCodeLoading = true
      this.disabledInputFile = true
      this.disabledBtnQRCode = true
      this.fileReceived = null
      this.QRCodeURL = null
      const ipV4 = Object.values(networkInterfaces()).flat().find(i => i.family == 'IPv4' && !i.internal).address;
      if (!ipV4) {
        this.alertMessage = "Vous n'êtes pas connecté à un réseau local !"
        this.QRCodeLoading = false
        this.disabledInputFile = false
        return
      } else {
        const context = this
        storage.get('config', function(error, data) {
          context.$store
            .dispatch('generateURL', {
              file: context.fileSelected,
              ipV4,
              port: data.port
            })
            .then((response) => {
              context.QRCodeLoading = false
              context.disabledInputFile = false
              context.disabledBtnQRCode = false
              context.fileReceived = response
              context.QRCodeURL = `http://${ipV4}:${response.port}/api/install/${response.info.nameSlug}`
              context.localUrl = `http://${ipV4}:${response.port}/`
              context.$fetch()
            })
            .catch((err) => {
              context.alertMessage = err.response.data.error
              context.QRCodeLoading = false
              context.disabledInputFile = false
              context.disabledBtnQRCode = false
              context.fileReceived = null
            })
        })
      }
    },
    deleteHistory() {
      storage.set('cias', [])
      this.ciasStorage = []
      this.$fetch()
    },
    openLink(link) {
      remote.shell.openExternal(link)
    }
  }
}
</script>

<style>
.qrcode canvas {
  border: 15px solid #ffffff;
}

.v-application p {
  margin-bottom: 0px;
}
</style>