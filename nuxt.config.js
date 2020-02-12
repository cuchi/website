
export default {
  head: {
    titleTemplate: '%s - cuchi.me',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Hi there! this page is where I share my thoughs and knowledge about software development.' }
    ]
  },
  css: [
    '@/assets/css/spectre-custom.scss'
  ],
  serverMiddleware: [
    { path: '/api/github-events', handler: '~/api/github-events.js' },
    { path: '/api/wakatime-activity', handler: '~/api/wakatime-activity.js' }
  ]
}
