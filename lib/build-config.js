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
  let assets = translateAssetConfig(config.assets, { rootDir })

  return {
    targetDir,
    bundles,
    manifest,
    assets
  }
}

function translateBundlerConfigs (bundleConfigs, { targetDir, rootDir, fingerprint, minify, prefixes }) {
  return bundleConfigs.map((bundleConfig) => {
    let inputFileName = path.resolve(rootDir, bundleConfig.entryPoint)
    let outputFileBasename = path.basename(inputFileName, '.scss')
    let outputStyle = minify ? 'compressed' : 'nested'
    let includePaths = [ path.resolve(rootDir, 'node_modules') ]

    return {
      inputFileName,
      includePaths,
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

function translateAssetConfig (assets, { rootDir }) {
  return assets.map(asset => path.resolve(rootDir, asset))
}
