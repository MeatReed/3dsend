/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */
module.exports = {
  components: true,
  mode: 'spa', // or 'universal'
  head: {
    title: '3dsend',
    meta: [{ charset: 'utf-8' }]
  },
  loading: false,
  plugins: [{ ssr: true, src: '@/plugins/icons.js' }],
  buildModules: ['@aceforth/nuxt-optimized-images', '@nuxt/components'],
  modules: ['@nuxtjs/vuetify', '@nuxtjs/axios'],
  optimizedImages: {
    optimizeImages: true
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
}
