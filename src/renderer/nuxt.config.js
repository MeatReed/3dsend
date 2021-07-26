/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  ssr: false,
  target: 'static',
  head: {
    title: '3dsend',
    meta: [
      { charset: "utf-8" }
    ]
  },
  loading: false,
  plugins: [
    {
      ssr: true, src: '@/plugins/icons.js'
    },
  ],
  components: true,
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios'
  ],
  axios: {
    proxy: true
  },

  vuetify: {
    theme: {
      dark: true,
      themes: {
        light: {
          primary: '#b1072e'
        },
        dark: {
          primary: '#b1072e'
        }
      }
    }
  }
};
