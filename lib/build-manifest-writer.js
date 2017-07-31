let { createFile } = require("faucet-pipeline-util");
let { basename } = require("path");

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
		acc[result.target] = baseURI(result.output, basename(result.output));
		return acc;
	}, manifest);
}

function writeManifest(results, manifest, manifestConfig) {
	return createFile(manifestConfig.file, `${JSON.stringify(manifest)}\n`).
		then(_ => results);
}
