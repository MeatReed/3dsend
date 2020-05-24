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
    alertMessage: null
  }),
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
  created() {
    storage.get('cias', async function(error, data) {
      if (error) throw error
      if (!data) {
        await storage.set('cias', [])
      }
    })
  },
  methods: {
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
      }
      const QRCodeResponse = await this.$axios.$post(
        `http://${ipV4}:9850/api/generateURL`,
        {
          filePath: this.fileSelected.path,
          fileName: this.fileSelected.name
        }
      )
      this.QRCodeLoading = false
      this.disabledInputFile = false
      this.disabledBtnQRCode = false
      this.urlFile = QRCodeResponse.url
    }
  }
}
</script>

<style scoped></style>
