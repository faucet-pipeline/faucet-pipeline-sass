let mkdirp = require('mkdirp')
let buildManifestWriter = require('./build-manifest-writer')
let buildBundler = require('./build-bundler')
let buildConfig = require('./build-config')
let buildReporter = require('./build-reporter')
let buildAssetMapReader = require('./build-asset-map-reader')

module.exports = (rawConfig, { configDir }, { watcher, fingerprint, compact }) => {
  let config = buildConfig(rawConfig, configDir, fingerprint, compact)

  mkdirp(config.targetDir, err => {
    if (err) {
      console.error(err)
      return
    }

    let bundleAll = buildBundleAll(config)

    // Run once for all files
    bundleAll()

    if (watcher) {
      watcher.on('edit', bundleAll)
    }
  })
}

function buildBundleAll (config) {
  let readAssetMap = buildAssetMapReader(config.assets)
  let bundlers = config.bundles.map(bundleConfig => buildBundler(bundleConfig))
  let writeManifest = buildManifestWriter(config.manifest)
  let report = buildReporter()

  return (file) => {
    readAssetMap().then(lookupAsset => {
      return Promise.all(
        bundlers.map(bundler => bundler(file, lookupAsset))
      )
    }).then(
      writeManifest
    ).then(
      report
    ).catch(err => {
      console.error(err)
    })
  }
}
