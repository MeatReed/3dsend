<template>
  <v-container fluid>
    <v-row v-if="$fetchState.pending">
      <v-col class="text-center">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="indigo"
        />
      </v-col>
    </v-row>
    <v-row v-if="!$fetchState.pending" class="pa-5">
      <h2>{{ item.app.name }}</h2>
    </v-row>
    <v-row v-if="!$fetchState.pending" justify="center">
      <v-col
        v-if="item.assets.find((cias) => cias.file_name === item.app.name_file)"
      >
        <v-card tile>
          <v-card-title>
            Change the QRCode
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
              label="QRCode Size"
            />
            <qrcode-vue
              :value="
                item.assets.find(
                  (cias) => cias.file_name === item.app.name_file
                ).file_download
              "
              class="qrcode text-center ma-2"
              :size="QRCodeSize"
              :level="modelQRCodeLevel"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title class="headline"
            >{{ item.app.name }}({{ item.app.tid }})</v-card-title
          >
          <v-card-text
            >Description: {{ item.app.description }}<br />Category:
            {{ item.app.category }}<br />Author: {{ item.app.author
            }}<br />Version: {{ item.app.version }}<br />Github:
            {{ item.app.github }}<br />Download: {{ item.app.download
            }}<br />Released at:
            {{
              new Date(item.app.released_at)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ')
            }}
          </v-card-text>
          <v-card-actions>
            <v-btn text :href="item.app.github" target="_blank" color="indigo">
              Github Repository
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card id="assetsCard">
          <v-card-title class="headline">Assets</v-card-title>
          <v-card-text>
            <v-btn
              v-for="(asset, index) of item.assets"
              :key="index"
              class="ma-2"
              :href="asset.file_download"
            >
              {{ asset.file_name }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue,
  },
  async fetch() {
    const appResponse = await this.$axios.$get(
      `http://macrodb.tk/api/apps/id/${this.$route.params.id}`
    )
    this.item = appResponse
  },
  data: () => ({
    item: null,
    itemsQRCode: ['L', 'M', 'Q', 'H'],
    modelQRCodeLevel: 'M',
    QRCodeSize: 300,
  }),
}
</script>

<style scopped>
#assetsCard {
  margin-top: 4px;
  text-align: center;
}
</style>
