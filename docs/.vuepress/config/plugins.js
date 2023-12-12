require('dotenv').config();
module.exports = [
  ['@vuepress/pwa', {
    serviceWorker: true,
    updatePopup: {
      '/': {
        message: "New content is available.",
        buttonText: "Refresh"
      },
      '/zh/': {
        message: "发现新内容可用",
        buttonText: "刷新"
      }
    }
  }],
  ['@vssue/vuepress-plugin-vssue', {
    platform: 'github-v4',
    owner: 'litongjava',
    repo: 'jfinal-doc',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    autoCreateIssue: true,
  }],
  ['@vuepress/back-to-top'],
  [
    '@vuepress/google-analytics',
    {
      'ga': process.env.GA,
    }
  ],
  ['@vuepress/medium-zoom'],
  ['fulltext-search'],
  ['vuepress-plugin-code-copy',{
	  staticIcon:true,
  }]
]