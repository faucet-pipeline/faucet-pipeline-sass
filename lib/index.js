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

    let bundlers = config.bundles.map(bundleConfig => bundle(bundleConfig))
    let writeManifest = buildManifestWriter(config.manifest)

    start(bundlers, writeManifest)
  })
}

function start (bundlers, writeManifest) {
  Promise.all(
    bundlers.map(bundler => bundler())
  ).then(
    writeManifest
  ).catch(err => {
    console.error(err)
  })
}
