let sass = require("sass");

module.exports = function(inputFileName, target, assetManager, sourcemaps, compact) {
	let sassOptions = {
		file: inputFileName,
		outputStyle: compact ? "compressed" : "expanded",
		includePaths: [ assetManager.packagesDir ],
		sourceMap: sourcemaps,
		sourceMapEmbed: sourcemaps,
		outFile: target,
		functions: {
			"asset-url($assetName)": assetName => {
				let name = assetName.getValue();
				let mappedAssetName = assetManager.manifest.get(name);

				/* eslint-disable indent */
				return mappedAssetName ?
						new sass.types.String(`url("${mappedAssetName}")`) :
						new sass.types.Error(`${name} could not be found`);
				/* eslint-enable indent */
			}
		}
	};

	return _ => renderSass(sassOptions);
};

// promisified version of sass.render
function renderSass(options) {
	return new Promise((resolve, reject) => {
		sass.render(options, (err, result) => {
			if(err) {
				reject(err);
			} else {
				result.css = fixEOF(result.css);
				resolve(result);
			}
		});
	});
}

// every file shall end with a newline. sass doesn't seem to care.
function fixEOF(buf) {
	return Buffer.concat([buf, Buffer.from("\n")]);
}
