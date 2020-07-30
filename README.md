# 3dsend

> Interface graphique sous Windows et Linux permettant d'installer des cias facilement ! :D

## 3DSend c'est quoi ?
3DSend est un utilitaire multi-plateformes Windows et Linux permettant d'installer des cias stockés sur un PC directement sur une 3DS en passant par FBI ou tout autre application pouvant installer des cias grâce à un lien ou un QR code.

Les fonctionnalités principales de l'application sont les suivantes:
- L'installation de CIAs depuis un PC sur le même réseau local.
- Une intégration de MacroDB.
- Un historique pour permettre de choisir des QR codes parmi les anciens générés.
- Un choix du port de serveur pour les personnes avec une configuration réseau particulière.

Les points forts de 3DSend :
- De meilleures performances par rapport aux concurrents (un chargement de l'application optimisé).
- Fonctionne également sans un accès à internet, seul un réseau local est nécessaire (à part pour Github).
- Fonctionne sous Windows et Linux.

### Démonstration
![3dsend_demo](https://i.imgur.com/aeOsOlS.gif)

### Installation
Windows : https://github.com/MeatReed/3dsend/releases/download/1.4.1/3DSend_windows.exe
Lancez juste `3DSend_windows.exe` et 3DSend s'installera automatiquement.

Linux : https://github.com/MeatReed/3dsend/releases/download/1.4.1/3DSend_linux.deb
`apt install 3DSend_linux.deb`

### Credits

* [electron](https://www.electronjs.org/)
* [electron-nuxt](https://github.com/michalzaq12/electron-nuxt)

Discord: `TIーム#3693`
[Youtube](https://www.youtube.com/channel/UCxcgIQ08IewI19Q_eiJxKRA)

#### Build Setup

``` bash
# install dependencies
yarn install

# serve app with hot reload
yarn run dev

# build electron application for production
yarn run build


# lint all JS/Vue component files in `src/`
yarn run lint

```

---

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) v1.6.0 using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).
