let { uriJoin } = require("faucet-pipeline-util");
let path = require("path");
let fs = require("fs");

// Create a writer for a manifest
//
// The writer writes the manifest, always extending the previous manifest
// so that it also support partial builds in a watch process
module.exports = manifestConfig => {
	let manifest = {};

	return results => {
		let filteredResults = results.filter(result => result.changed);

		if(filteredResults.length > 0) {
			manifest = updateManifest(filteredResults, manifest, manifestConfig);

			return writeManifest(filteredResults, manifest, manifestConfig);
		} else {
			return new Promise(resolve => resolve(results));
		}
	};
};

function updateManifest(results, manifest, { baseURI }) {
	return results.reduce((acc, result) => {
		acc[result.target] = uriJoin(baseURI, result.output);
		return acc;
	}, manifest);
}

function writeManifest(results, manifest, manifestConfig) {
	return new Promise((resolve, reject) => {
		fs.writeFile(manifestConfig.file,
			JSON.stringify(manifest),
			err => {
				if(err) {
					reject(err);
				} else {
					resolve(results);
				}
			}
		);
	});
}
