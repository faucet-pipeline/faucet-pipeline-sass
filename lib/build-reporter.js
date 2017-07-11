// A reporter
//
// Reports the results of the run
module.exports = () => {
	return results => {
		let filteredResults = results.filter(result => result.changed);

		if(filteredResults.length > 0) {
			let report = filteredResults.map(result => result.output).join(", ");
			console.log(`Wrote these files: ${report}`); // eslint-disable-line no-console
		}
	};
};
