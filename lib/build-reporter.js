let path = require("path");

// A reporter
//
// Reports the results of the run
module.exports = config => {
	let format = output => `✓ ${path.join(config.configDir, output)}`;

	return results => {
		results.forEach(res => {
			if(res.changed) {
				console.log(format(res.output)); // eslint-disable-line no-console
			}
		});
	};
};
