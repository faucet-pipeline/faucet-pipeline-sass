// A reporter
//
// Reports the results of the run
module.exports = _ => {
	return results => {
		results.forEach(res => {
			if(res.changed) {
				console.log(`✓ ${res.output}`); // eslint-disable-line no-console
			}
		});
	};
};
