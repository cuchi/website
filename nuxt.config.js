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
    { path: '/api/wakatime-activity', handler: '~/api/wakatime-activity.js' },
    { path: '/api/posts', handler: '~/api/posts.js' },
    { path: '/api/career', handler: '~/api/career.js' },
    { path: '/rss.xml', handler: '~/api/rss.js' },
  ],
  env: {
    BASE_URL: process.env.BASE_URL || (process.env.NODE_ENV === 'production'
      ? 'https://cuchi.me'
      : 'http://localhost:3000'),
    SITE_NAME: 'Paulo Henrique Cuchi',
  },
  markdownit: {
    injected: true,
    highlight: function (str, lang) {
      const hljs = require('highlight.js')
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch { }
        return ''
      }
    }
  },
}
