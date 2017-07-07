let path = require('path')
let fs = require('fs')

/**
 * Create a writer for a manifest
 *
 * The writer writes the manifest, always extending the previous manifest
 * so that it also support partial builds in a watch process
 */
module.exports = (manifestConfig) => {
  let manifest = {}

  return (results) => {
    results = results.filter(result => result.changed)

    if (results.length > 0) {
      manifest = updateManifest(results, manifest, manifestConfig)

      writeManifest(manifestConfig, manifest)
        .then(_ => {
          console.log(`Wrote these files: ${results.map(result => result.output).join(', ')}`)
        }).catch(err => {
          console.error(`Could not write the manifest file: ${err}`)
        })
    }
  }
}

function updateManifest (results, manifest, { baseURI }) {
  return results.reduce((acc, result) => {
    acc[result.input] = path.join(baseURI, result.output)
    return acc
  }, manifest)
}

function writeManifest (manifestConfig, manifest) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      manifestConfig.file,
      JSON.stringify(manifest),
      err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}
