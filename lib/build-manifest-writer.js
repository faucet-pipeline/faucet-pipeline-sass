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

    manifest = results.reduce((acc, result) => {
      acc[result.input] = path.join(manifestConfig.baseURI, result.output)
      return acc
    }, manifest)

    fs.writeFile(
      manifestConfig.file,
      JSON.stringify(manifest),
      (err) => {
        if (err) {
          console.error(`Could not write the manifest file: ${err}`)
          return
        }

        console.log(`Wrote these files: ${results.map(result => result.output).join(', ')}`)
      }
    )
  }
}
