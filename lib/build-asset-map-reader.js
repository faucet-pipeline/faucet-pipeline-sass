let fs = require('fs')

/**
 * Build an asset map reader
 *
 * An asset map reader looks up assets in a manifest file
 */
module.exports = (assetMaps) => {
  return () => {
    return Promise.all(
      assetMaps.map(assetMap => {
        return new Promise((resolve, reject) => {
          fs.readFile(assetMap, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(JSON.parse(data))
            }
          })
        })
      })
    ).then(
      maps => Object.assign({}, ...maps)
    ).then(map => {
      return asset => {
        return map[asset]
      }
    })
  }
}
