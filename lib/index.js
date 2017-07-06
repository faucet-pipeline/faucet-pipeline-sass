let mkdirp = require('mkdirp')
let buildManifestWriter = require('./build-manifest-writer')
let bundle = require('./bundle')
let buildConfig = require('./build-config')

// TODO: watch
module.exports = (rootDir, cliParams) => {
  let config = buildConfig(rootDir, cliParams)

  mkdirp(config.targetDir, err => {
    if (err) {
      console.error(err)
      return
    }

    let writeManifest = buildManifestWriter(config.manifestConfig)

    start(config.bundleConfigs, writeManifest)
  })
}

function start (bundleConfigs, writeManifest) {
  Promise.all(
    bundleConfigs.map(bundleConfig => bundle(bundleConfig))
  ).then(
    // TODO: The `result` also contains includedFiles for the watcher
    writeManifest
  ).catch(err => {
    console.error(err)
  })
}
