<template>
  <v-container>
    <h1>Information</h1>
    <v-row id="menuIcons">
      <v-col cols="4">
        <v-avatar tile size="250">
          <v-img :src="require('../assets/avatar.png')" />
        </v-avatar>
      </v-col>
      <v-col cols="8">
        <v-card outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                Information
              </div>
              <v-list-item-title class="headline mb-1">
                MeatReed
              </v-list-item-title>
              <v-list-item-subtitle>
                Application: 1.1.0
              </v-list-item-subtitle>
              <v-list-item-subtitle> Nuxt.js: {{ nuxt }} </v-list-item-subtitle>
              <v-list-item-subtitle>Vue.js: {{ vue }}</v-list-item-subtitle>
              <v-list-item-subtitle>
                Electron: {{ electron }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>Node: {{ node }}</v-list-item-subtitle>
              <v-list-item-subtitle>
                Chrome: {{ chrome }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Platform: {{ platform }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn
              text
              color="primary"
              @click="
                openLink(
                  'https://www.youtube.com/channel/UCxcgIQ08IewI19Q_eiJxKRA'
                )
              "
            >
              <v-icon>mdi-youtube</v-icon>Youtube
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="openLink('https://discord.gg/9q7E6df')"
            >
              <v-icon>mdi-discord</v-icon>Discord
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="openLink('https://github.com/MeatReed')"
            >
              <v-icon>mdi-github</v-icon>Github
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="openLink('https://github.com/MeatReed/nsmultitools')"
            >
              <v-icon>mdi-application</v-icon>NSMultiTools
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
  data() {
    return {
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      node: process.versions.node,
      platform: require('os').platform(),
      vue: require('vue/package.json').version,
      nuxt: require('nuxt/package.json').version
    }
  },
  methods: {
    openLink(link) {
      remote.shell.openExternal(link)
    }
  }
}
</script>

<style scoped></style>
