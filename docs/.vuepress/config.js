const theme = require('./theme')
module.exports = {
  title: 'PAPICO 블로그',
  description: '기술 블로그',
  theme,
  themeConfig: {
    nav: [{
        text: 'Posts',
        link: '/'
      },
      // {
      //   text: 'About',
      //   link: '/about.html'
      // },
    ],
    logo: '/logo.jpg',
    github: 'https://github.com/ocipap',
    activeHeaderLinks: true
  },
  head: [
    ['link', {
      rel: 'icon',
      href: '/logo.jpeg'
    }],
  ],
  plugins: [
    ['@vuepress/back-to-top'],
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-142977322-1'
      }
    ]
  ],
  markdown: {
    toc: { includeLevel: [ 2 ] },
  }
}