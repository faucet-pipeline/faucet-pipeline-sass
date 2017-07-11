let path = require('path')
let sass = require('node-sass')
let fs = require('fs')
let { generateFingerprint } = require('faucet-pipeline-cli/util')
let postcss = require('postcss')
let autoprefixer = require('autoprefixer')
const SassString = require('node-sass').types.String

/**
 * Create a bundler for a specific bundle
 */
module.exports = (opts) => {
  let previouslyIncludedFiles

  let renderSass = buildSassRenderer(opts)
  let autoprefix = buildAutoprefixer(opts)
  let writeFile = buildFileWriter(opts)

  return (file, lookupAsset) => {
    // If this is the first run or the changed file is one of the previously included ones, run the compiler
    if (previouslyIncludedFiles === undefined || previouslyIncludedFiles.find(candidate => candidate === file)) {
      return renderSass(lookupAsset)
        .then(autoprefix)
        .then(writeFile)
        .then(result => {
          previouslyIncludedFiles = result.includedFiles

          return {
            changed: true,
            input: result.input,
            output: result.output
          }
        })
    } else {
      return new Promise(resolve => {
        resolve({
          changed: false
        })
      })
    }
  }
}

function buildSassRenderer ({ inputFileName, outputStyle, includePaths }) {
  return (lookupAsset) => {
    let sassOptions = {
      file: inputFileName,
      outputStyle: outputStyle,
      includePaths,
      functions: {
        'asset-url($assetName)': (assetName) => {
          // TODO: Create nice error output incl. a css file
          let mappedAssetName = lookupAsset(assetName.getValue())
          return new SassString(`url("${mappedAssetName}")`)
        }
      }
    }

    return new Promise((resolve, reject) => {
      sass.render(sassOptions, (err, result) => {
        if (err) {
          // TODO: Create nice error output incl. a css file
          // https://github.com/sass/node-sass#error-object
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

function buildAutoprefixer ({ prefixes }) {
  let processor = postcss([ autoprefixer(prefixes) ])

  return (input) => {
    return processor.process(input.css).then(result => {
      result.warnings().forEach(warn => {
        // TODO: Create nice error output incl. a css file
        console.warn(warn.toString())
      })

      return {
        css: result.css,
        stats: input.stats
      }
    })
  }
}

function buildFileWriter ({ fingerprint, outputFileBasename, targetDir, configDir, inputFileName }) {
  return (input) => {
    return new Promise((resolve, reject) => {
      let outputFileName

      if (fingerprint) {
        outputFileName = generateFingerprint(`${outputFileBasename}.css`, input.css)
      } else {
        outputFileName = `${outputFileBasename}.css`
      }

      fs.writeFile(path.resolve(targetDir, outputFileName), input.css, (err) => {
        if (err) {
          reject(new Error(`Writing File failed: ${err}`))
          return
        }

        resolve({
          input: path.relative(configDir, inputFileName),
          output: outputFileName,
          includedFiles: input.stats.includedFiles
        })
      })
    })
  }
}
