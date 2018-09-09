let sass = require("node-sass");
let SassString = require("node-sass").types.String;
let SassError = require("node-sass").types.Error;

module.exports = function(inputFileName, assetManager, sourcemaps, compact) {
	let sassOptions = {
		file: inputFileName,
		outputStyle: compact ? "compressed" : "expanded",
		includePaths: [ assetManager.packagesDir ],
		sourceMapEmbed: sourcemaps,
		functions: {
			"asset-url($assetName)": assetName => {
				let mappedAssetName = assetManager.manifest.get(assetName.getValue());

				if(mappedAssetName) {
					return new SassString(`url("${mappedAssetName}")`);
				} else {
					return new SassError(`${assetName.getValue()} could not be found`);
				}
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
				resolve(result);
			}
		});
	});
}
