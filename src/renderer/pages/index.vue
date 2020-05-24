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
        <v-file-input
          v-model="modelCiaChoose"
          placeholder="Choisir un fichier .cia, .nsp, .xci, .nsz ou .xcz"
          label="Fichier .cia, .nsp, .xci, .nsz ou .xcz"
          accept=".cia, .nsp, .xci, .nsz, .xcz"
          prepend-icon="mdi-paperclip"
          :disabled="disabledInputFile"
        >
          <template v-slot:selection="{ text }">
            <v-chip small label>
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="centered">
        <v-btn small :disabled="disabledBtnQRCode" @click="createQRCode"
          >Créer un QRCode</v-btn
        >
        <v-btn small @click="dialogHistoryFiles = true"
          >Historique des QRCodes générés</v-btn
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
      <v-col v-else class="centered">
        <qrcode-vue v-if="urlFile" :value="urlFile" size="300" level="Q" />
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialogHistoryFiles"
      width="600"
    >
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
                <v-list-item-title
                  v-text="`Nom : ${item.name}`"
                />
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
          <v-btn
            text
            @click="dialogHistoryFiles = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import storage from 'electron-json-storage'
import internalIp from 'internal-ip'
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue
  },
  data: () => ({
    modelCiaChoose: null,
    fileSelected: null,
    disabledBtnQRCode: true,
    urlFile: null,
    QRCodeLoading: false,
    disabledInputFile: false,
    dialogHistoryFiles: false,
    alertMessage: null,
    ciasStorage: []
  }),
  fetch() {
    const context = this
    storage.get('cias', async function(error, data) {
      if (error) throw error
      if (!data[0]) {
        await storage.set('cias', [])
      } else {
        context.ciasStorage = data.reverse()
      }
    })
  },
  watch: {
    modelCiaChoose(file) {
      this.fileSelected = file
      this.urlFile = null
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
      this.urlFile = null
      this.dialogHistoryFiles = false
      this.createQRCode()
    },
    async createQRCode() {
      this.QRCodeLoading = true
      this.disabledInputFile = true
      this.disabledBtnQRCode = true
      this.urlFile = null
      const ipV4 = await internalIp.v4()
      if (!ipV4) {
        this.alertMessage = "Vous n'êtes pas connecté à un réseau !"
        this.QRCodeLoading = false
        this.disabledInputFile = false
        return
      } else {
        this.$store
          .dispatch('generateURL', {
            filePath: this.fileSelected.path,
            fileName: this.fileSelected.name,
            ipV4
          })
          .then((response) => {
            this.QRCodeLoading = false
            this.disabledInputFile = false
            this.disabledBtnQRCode = false
            this.urlFile = response.url
            this.$fetch()
          })
          .catch((err) => {
            this.alertMessage = err.response.data.error
            this.QRCodeLoading = false
            this.disabledInputFile = false
            this.disabledBtnQRCode = false
            this.urlFile = null
          })
      }
    }
  }
}
</script>

<style scoped></style>
