module.exports = {
  css: {
    targetDir: './output',
    manifest: {
      file: './css.json',
      baseURI: '/assets'
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
