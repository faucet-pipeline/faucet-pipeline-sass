let mkdirp = require('mkdirp')
let buildManifestWriter = require('./build-manifest-writer')
let buildBundler = require('./build-bundler')
let buildConfig = require('./build-config')
let watcher = require('./watcher')
let buildReporter = require('./build-reporter')

module.exports = (rootDir, cliParams) => {
  let config = buildConfig(rootDir, cliParams)

  mkdirp(config.targetDir, err => {
    if (err) {
      console.error(err)
      return
    }

    let bundleAll = buildBundleAll(config)

    // Run once for all files
    bundleAll()

    if (cliParams.watch) {
      // TODO: Debounce
      watcher(rootDir)
        .on('edit', bundleAll)
    }
  })
}

function buildBundleAll (config) {
  let bundlers = config.bundles.map(bundleConfig => buildBundler(bundleConfig))
  let writeManifest = buildManifestWriter(config.manifest)
  let report = buildReporter()

  return (file) => {
    Promise.all(
      bundlers.map(bundler => bundler(file))
    ).then(
      writeManifest
    ).then(
      report
    ).catch(err => {
      console.error(err)
    })
  }
}
