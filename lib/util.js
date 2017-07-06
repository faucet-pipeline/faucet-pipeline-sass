let crypto = require('crypto')

exports.generateHash = str => {
  let hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}
