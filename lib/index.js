let mkdirp = require('mkdirp')
let buildManifestWriter = require('./build-manifest-writer')
let bundle = require('./bundle')
let buildConfig = require('./build-config')
let watcher = require('./watcher')

module.exports = (rootDir, cliParams) => {
  let config = buildConfig(rootDir, cliParams)

  mkdirp(config.targetDir, err => {
    if (err) {
      console.error(err)
      return
    }

    let bundleAll = createBundleAll(config)

    // Run once for all files
    bundleAll()

    if (cliParams.watch) {
      // TODO: Debounce
      watcher(rootDir)
        .on('edit', bundleAll)
    }
  })
}

function createBundleAll (config) {
  let bundlers = config.bundles.map(bundleConfig => bundle(bundleConfig))
  let writeManifest = buildManifestWriter(config.manifest)

  return (file) => {
    Promise.all(
      bundlers.map(bundler => bundler(file))
    ).then(
      writeManifest
    ).catch(err => {
      console.error(err)
    })
  }
}
