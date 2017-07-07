/**
 * A reporter
 *
 * Reports the results of the run
 */
module.exports = () => {
  return (results) => {
    let filteredResults = results.filter(result => result.changed)

    if (filteredResults.length > 0) {
      console.log(`Wrote these files: ${filteredResults.map(result => result.output).join(', ')}`)
    }
  }
}
