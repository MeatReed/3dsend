<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) of ciasGithub"
        :key="index"
        :todo="item"
        color="primary"
      >
        <v-card width="350" outlined>
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <div>
            <v-card-subtitle>Auteur : {{ item.author }}</v-card-subtitle>
          </div>
          <qrcode-vue
            v-if="
              ciasResponse.find((cias) => cias.release.name === item.ciaName)
            "
            :value="
              `https://github.com/${item.author}/${
                item.repo
              }/releases/download/${
                ciasResponse.find((cias) => cias.release.name === item.ciaName)
                  .tag
              }/${item.ciaName}`
            "
            class="qrcode text-center"
            :size="250"
          />
          <v-card-actions>
            <v-btn text @click="generateQrCode(item)" color="primary">
              Générer
            </v-btn>
            <v-btn
              v-if="
                ciasResponse.find((cias) => cias.release.name === item.ciaName)
              "
              text
              :href="
                `https://github.com/${item.author}/${
                  item.repo
                }/releases/download/${
                  ciasResponse.find(
                    (cias) => cias.release.name === item.ciaName
                  ).tag
                }/${item.ciaName}`
              "
              color="primary"
            >
              Télécharger
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" :color="snackbarColor" right top>
        {{ snackbarText }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue
  },
  data: () => ({
    snackbar: false,
    snackbarColor: 'success',
    snackbarText: null,
    ciasGithub: [
      {
        author: 'Steveice10',
        name: 'FBI',
        repo: 'FBI',
        ciaName: 'FBI.cia'
      },
      {
        author: 'Core-2-Extreme',
        name: '3DS Battery Checker',
        repo: '3DS-Battery-Checker',
        ciaName: '3DS_Battery_Checker.cia'
      },
      {
        author: 'joel16',
        name: '3DSident',
        repo: '3DShell',
        ciaName: '3DShell.cia'
      },
      {
        author: 'joel16',
        name: '3DSident-GUI',
        repo: '3DSident',
        ciaName: '3DSident-GUI.cia'
      },
      {
        author: 'astronautlevel2',
        name: 'Anemone3DS',
        repo: 'Anemone3DS',
        ciaName: 'Anemone3DS.cia'
      },
      {
        author: 'FlagBrew',
        name: 'Checkpoint',
        repo: 'Checkpoint',
        ciaName: 'Checkpoint.cia'
      },
      {
        author: 'd0k3',
        name: 'CTRXplorer',
        repo: 'CTRXplorer',
        ciaName: 'CTRXplorer.cia'
      },
      {
        author: 'noirscape',
        name: 'Dead Simple EULA Set',
        repo: 'dses',
        ciaName: 'DSES.cia'
      },
      {
        author: 'CorySanin',
        name: 'Fast PlayCoin',
        repo: 'FastPlayCoin',
        ciaName: 'FastPlayCoin.cia'
      },
      {
        author: 'J-D-K',
        name: "JK's Save Manager",
        repo: 'JKSM',
        ciaName: 'JKSM.cia'
      },
      {
        author: 'Universal-Team',
        name: 'LeafEdit',
        repo: 'LeafEdit',
        ciaName: 'LeafEdit.cia'
      },
      {
        author: 'Swiftloke',
        name: 'ModMoon',
        repo: 'ModMoon',
        ciaName: 'ModMoon.cia'
      },
      {
        author: 'RMcTn',
        name: 'Notepad3DS',
        repo: 'Notepad3DS',
        ciaName: 'Notepad3DS.cia'
      },
      {
        author: 'FlagBrew',
        name: 'PKSM',
        repo: 'PKSM',
        ciaName: 'PKSM.cia'
      },
      {
        author: 'elhobbs',
        name: 'prboom3ds',
        repo: 'prboom3ds',
        ciaName: 'prboom3ds.cia'
      },
      {
        author: 'RedInquisitive',
        name: 'Super Haxagon',
        repo: 'Super-Haxagon',
        ciaName: 'SuperHaxagon.cia'
      },
      {
        author: 'UltiNaruto',
        name: 'Tetris3DS',
        repo: 'Tetris3DS',
        ciaName: 'Tetris3DS.cia'
      },
      {
        author: 'DanTheMan827 ',
        name: 'tikSweep',
        repo: 'tikSweep',
        ciaName: 'tikSweep.cia'
      },
      {
        author: 'RocketRobz ',
        name: 'TWiLightMenu-Updater',
        repo: 'TWiLightMenu-Updater',
        ciaName: 'TWiLightMenu-Updater.cia'
      },
      {
        author: 'TuxSH ',
        name: 'TWLSaveTool',
        repo: 'TWLSaveTool',
        ciaName: 'TWLSaveTool.cia'
      },
      {
        author: 'Universal-Team ',
        name: 'Universal Updater',
        repo: 'Universal-Updater',
        ciaName: 'Universal-Updater.cia'
      }
    ],
    ciasResponse: []
  }),
  methods: {
    generateQrCode(item) {
      if (
        this.ciasResponse.find((cias) => cias.release.name === item.ciaName)
      ) {
        this.snackbarText = `${item.name} est déjà généré !`
        this.snackbarColor = 'error'
        this.snackbar = true
        return
      }
      this.$axios
        .$get(
          `https://api.github.com/repos/${item.author}/${item.repo}/releases`
        )
        .then((releaseResponse) => {
          let assets
          releaseResponse.find(async (release) => {
            if (!release.assets[0]) return
            assets = release.assets
          })
          this.ciasResponse.push({
            tag: releaseResponse[0].tag_name,
            release: assets.find((asset) => asset.name === item.ciaName)
          })
        })
        .catch((error) => {
          this.snackbarText = error
          this.snackbarColor = 'error'
          this.snackbar = true
          return
        })
    }
  }
}
</script>

<style>
.qrcode canvas {
  border: 15px solid #ffffff;
}
</style>
