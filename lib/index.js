let mkdirp = require('mkdirp')
let buildManifestWriter = require('./build-manifest-writer')
let bundle = require('./bundle')
let buildConfig = require('./build-config')
let watcher = require('./watcher')

// TODO: watch
module.exports = (rootDir, cliParams) => {
  let config = buildConfig(rootDir, cliParams)

  mkdirp(config.targetDir, err => {
    if (err) {
      console.error(err)
      return
    }

    let bundlers = config.bundles.map(bundleConfig => bundle(bundleConfig))
    let writeManifest = buildManifestWriter(config.manifest)

    start(bundlers, writeManifest)

    // TODO: Debounce
    watcher(rootDir)
      .on('edit', (file) => {
        start(bundlers, writeManifest, file)
      })
  })
}

function start (bundlers, writeManifest, file) {
  Promise.all(
    bundlers.map(bundler => bundler(file))
  ).then(
    writeManifest
  ).catch(err => {
    console.error(err)
  })
}
