<template>
  <v-container>
    <v-row>
      <v-col>
        <v-file-input
          v-model="modelCiaChoose"
          placeholder="Choisir un fichier .cia"
          label="Payload"
          accept=".cia"
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
    disabledInputFile: false
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
  async created() {
    const cias = await storage.get('cias')
    if (!cias) {
      await storage.set('cias', [])
    }
  },
  methods: {
    async createQRCode() {
      this.QRCodeLoading = true
      this.disabledInputFile = true
      this.urlFile = null
      const ipV4 = await internalIp.v4()
      const QRCodeResponse = await this.$axios.$post(
        `http://${ipV4}:9850/api/generateURL`,
        {
          filePath: this.fileSelected.path,
          fileName: this.fileSelected.name
        }
      )
      this.QRCodeLoading = false
      this.disabledInputFile = false
      this.urlFile = QRCodeResponse.url
    }
  }
}
</script>

<style>
.centered {
  text-align: center;
}
</style>
