let path = require('path')

/**
 * Create the configuration object
 *
 * Combines the CLI parameters with the config file
 * TODO: Check if the config is well formed
 */
module.exports = (config, configDir, fingerprint, compact) => {
  let targetDir = path.resolve(configDir, config.targetDir)
  let bundles = translateBundlerConfigs(config.bundles, { targetDir, configDir, fingerprint, compact, prefixes: config.prefixes })
  let manifest = translateManifestConfig(config.manifest, { configDir })
  let assets = translateAssetConfig(config.assets, { configDir })

  return {
    targetDir,
    bundles,
    manifest,
    assets
  }
}

function translateBundlerConfigs (bundleConfigs, { targetDir, configDir, fingerprint, compact, prefixes }) {
  return bundleConfigs.map((bundleConfig) => {
    let inputFileName = path.resolve(configDir, bundleConfig.entryPoint)
    let outputFileBasename = path.basename(inputFileName, '.scss')
    let outputStyle = compact ? 'compressed' : 'nested'
    let includePaths = [ path.resolve(configDir, 'node_modules') ]

    return {
      inputFileName,
      includePaths,
      outputFileBasename,
      configDir,
      outputStyle,
      fingerprint,
      targetDir,
      prefixes
    }
  })
}

function translateManifestConfig (manifestConfig, { configDir }) {
  return {
    file: path.resolve(configDir, manifestConfig.file),
    baseURI: manifestConfig.baseURI
  }
}

function translateAssetConfig (assets, { configDir }) {
  return assets.map(asset => path.resolve(configDir, asset))
}
