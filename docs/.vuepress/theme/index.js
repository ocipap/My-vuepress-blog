const path = require('path')

console.log(path)
module.exports = {
  name : 'vuepress-theme-papico',
  plugins: [
    '@vuepress/blog',
    '@vuepress/pagination',
    [
      '@vuepress/search', {
      searchMaxSuggestions: 10
    }],
    ['@vuepress/active-header-links'],
    [
      '@vuepress/register-components', {
      componentsDir: [
        path.resolve(__dirname, 'components')
      ]
    }]
  ]
}