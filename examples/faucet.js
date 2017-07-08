module.exports = {
  css: {
    targetDir: './output',
    manifest: {
      file: './css.json',
      baseURI: '/assets'
    },
    assets: [
      './images.json'
    ],
    prefixes: {
      browsers: [
        'last 2 versions',
        'Chrome 21'
      ]
    },
    bundles: [
      {
        entryPoint: './example.scss'
      },
      {
        entryPoint: './example2.scss'
      }
    ]
  }
}
