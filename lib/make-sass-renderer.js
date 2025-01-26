let sass = require("sass");

module.exports = function(inputFileName, target, assetManager, sourcemaps, compact) {
	let sassOptions = {
		style: compact ? "compressed" : "expanded",
		loadPaths: [assetManager.packagesDir],
		sourceMap: sourcemaps,
		functions: {
			"asset-url($assetName)": args => {
				let name = args[0].text;
				let mappedAssetName = assetManager.manifest.get(name);
				if(!mappedAssetName) {
					throw new Error(`${name} could not be found`);
				}

				return new sass.SassString(`url("${mappedAssetName}")`, {
					quotes: false
				});
			}
		}
	};

	return _ => renderSass(inputFileName, sassOptions);
};

// promisified version of sass.render
function renderSass(inputFileName, options) {
	return new Promise((resolve, reject) => {
		try {
			// using synchronous rendering because it is faster
			let result = sass.compile(inputFileName, options);
			if(result.sourceMap) {
				result.css = embedSourcemap(result);
			}
			// every file shall end with a newline. sass doesn't seem to care
			result.css = `${result.css}\n`;
			resolve(result);
		} catch(err) {
			reject(err);
		}
	});
}

// the new API can't embed sourcemaps
// https://github.com/sass/dart-sass/issues/1594#issuecomment-1013208452
function embedSourcemap(result) {
	const sm = JSON.stringify(result.sourceMap);
	const smBase64 = Buffer.from(sm, "utf8").toString("base64");
	const smComment = `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${smBase64}*/`; /* eslint-disable-line max-len */
	return `${result.css}\n${smComment}`;
}
