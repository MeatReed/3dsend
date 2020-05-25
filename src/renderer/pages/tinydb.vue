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
      <v-col v-if="$fetchState.pending" class="centered">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        />
      </v-col>
      <v-col
        v-for="(item, index) of apps"
        :key="index"
        :todo="item"
        v-if="item.cia[0] && !$fetchState.pending"
        color="primary"
      >
        <v-card max-width="350" outlined>
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <div>
            <v-card-subtitle
              >Auteur : {{ item.author }}<br />Version :
              {{ getVersion(item) }}</v-card-subtitle
            >
          </div>
          <v-img
            class="white--text align-end"
            height="250"
            contain
            :src="getQRCode(item)"
          />
          <v-card-actions>
            <v-btn text @click="download(item)" color="primary">
              Télécharger
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { remote } from 'electron'

export default {
  data: () => ({
    alertMessage: null,
    apps: null
  }),
  async fetch() {
    const appsResponse = await this.$axios.$get(
      'https://tinydb.eiphax.tech/api/apps'
    )
    this.apps = appsResponse
  },
  methods: {
    getQRCode: function(item) {
      if (item.cia[0] === undefined) return
      return `https://tinydb.eiphax.tech/qr/${item.id}/${
        item.cia[item.cia.length - 1].id
      }/QR.png`
    },
    getVersion: function(item) {
      if (item.cia[0] === undefined) return
      return item.cia[item.cia.length - 1].version
    },
    download: function(item) {
      if (item.cia[0] === undefined) return
      remote.shell.openExternal(item.cia[item.cia.length - 1].download_url)
      return
    }
  }
}
</script>

<style scoped></style>
