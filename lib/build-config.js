let path = require('path')

/**
 * Create the configuration object
 *
 * Combines the CLI parameters with the config file
 * TODO: Check if the config is well formed
 */
module.exports = (rootDir, { config, fingerprint, minify }) => {
  let configFile = path.resolve(rootDir, config)
  config = require(configFile).css

  // from now on everything is relative to the config file
  rootDir = path.dirname(configFile)

  let targetDir = path.resolve(rootDir, config.targetDir)
  let bundles = translateBundlerConfigs(config.bundles, { targetDir, rootDir, fingerprint, minify, prefixes: config.prefixes })
  let manifest = translateManifestConfig(config.manifest, { rootDir })

  return {
    targetDir,
    bundles,
    manifest
  }
}

function translateBundlerConfigs (bundleConfigs, { targetDir, rootDir, fingerprint, minify, prefixes }) {
  return bundleConfigs.map((bundleConfig) => {
    let inputFileName = path.resolve(rootDir, bundleConfig.entryPoint)
    let outputFileBasename = path.basename(inputFileName, '.scss')
    let outputStyle = minify ? 'compressed' : 'nested'

    return {
      inputFileName,
      outputFileBasename,
      rootDir,
      outputStyle,
      fingerprint,
      targetDir,
      prefixes
    }
  })
}

function translateManifestConfig (manifestConfig, { rootDir }) {
  return {
    file: path.resolve(rootDir, manifestConfig.file),
    baseURI: manifestConfig.baseURI
  }
}
