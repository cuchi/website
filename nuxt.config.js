import hljs from 'highlight.js'

export default {
  modules: [
    '@nuxtjs/markdownit'
  ],
  head: {
    titleTemplate: '%s - cuchi.me',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Hi there! this page is where I share my thoughs and knowledge about software development.' }
    ]
  },
  css: [
    '@/assets/css/spectre-custom.scss',
    'highlight.js/styles/github.css'
  ],
  serverMiddleware: [
    { path: '/api/github-events', handler: '~/api/github-events.js' },
    { path: '/api/wakatime-activity', handler: '~/api/wakatime-activity.js' }
  ],
  env: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://cuchi.me'
      : 'http://localhost:3000'
  },

  markdownit: {
    injected: true,
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch {}                                                                                        
        return ''
      }
    }
  },
}
