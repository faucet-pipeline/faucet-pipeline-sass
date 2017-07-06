let path = require('path')
let sass = require('node-sass')
let fs = require('fs')
let { generateHash } = require('./util')

/**
 * Create a bundler for a specific bundler
 */
module.exports = ({ inputFileName, outputFileBasename, rootDir, outputStyle, fingerprint, targetDir }) => {
  return new Promise((resolve, reject) => {
    sass.render({
      file: inputFileName,
      outputStyle: outputStyle
      // TODO: includePaths
      // TODO: functions
    }, (err, result) => {
      if (err) {
        // TODO: Create nice error output incl. a css file
        // https://github.com/sass/node-sass#error-object
        reject(new Error(`Compile Failed: ${err}`))
        return
      }

      let outputFileName
      if (fingerprint) {
        let hash = generateHash(result.css)
        outputFileName = `${outputFileBasename}-${hash}.css`
      } else {
        outputFileName = `${outputFileBasename}.css`
      }

      fs.writeFile(path.resolve(targetDir, outputFileName), result.css, (err) => {
        if (err) {
          reject(new Error(`Writing File failed: ${err}`))
          return
        }

        resolve({
          input: path.relative(rootDir, inputFileName),
          output: outputFileName,
          includedFiles: result.stats.includedFiles
        })
      })
    })
  })
}
