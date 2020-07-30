<template>
  <v-row>
    <v-col v-if="$fetchState.pending" class="centered">
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        color="primary"
      />
    </v-col>
    <v-col v-else-if="$fetchState.error" class="centered">
      <h1>Pas de connexion internet.</h1>
      <v-btn @click="$fetch">Réessayez</v-btn>
    </v-col>
    <v-col v-else v-for="(item, index) of apps" :key="index" color="indigo">
        <v-card
          width="250"
          class="mx-auto"
          tile
          nuxt
          :to="'/macrodb/' + item.app.id"
        >
          <v-card-title>
            {{ item.app.name }}
          </v-card-title>
          <div>
            <v-card-subtitle
              >Description: {{ item.app.description ? item.description : 'none'
              }}<br />TID: {{ item.app.tid ? item.app.tid : 'unknown'
              }}<br />Last Updated:
              {{
                item.app.released_at
                  ? new Date(item.app.released_at)
                      .toISOString()
                      .slice(0, 19)
                      .replace('T', ' ')
                  : 'unknown'
              }}
            </v-card-subtitle>
          </div>
          <v-divider></v-divider>
          <qrcode-vue
            v-if="
              item.assets.find((cias) => cias.file_name === item.app.name_file)
            "
            :value="
              item.assets.find((cias) => cias.file_name === item.app.name_file)
                .file_download
            "
            class="qrcode text-center ma-2"
            :size="200"
            level="M"
          />
          <v-divider></v-divider>
          <v-card-actions>
            <v-chip> Latest: {{ item.app.version }} </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
  </v-row>
</template>

<script>
import { remote } from 'electron'
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue
  },
  data: () => ({
    alertMessage: null,
    apps: null,
    navigator: navigator.onLine ? 'online' : 'offline'
  }),
  async fetch() {
    this.navigator = navigator.onLine ? 'online' : 'offline'
    const appsResponse = await this.$axios.$get(
      'http://macrodb.tk/api/apps/all'
    )
    this.apps = appsResponse
  }
}
</script>
