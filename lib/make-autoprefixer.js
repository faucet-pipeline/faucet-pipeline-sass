let path = require("path");
let postcss = require("postcss");
let autoprefixer = require("autoprefixer");
let { repr } = require("faucet-pipeline-core/lib/util");

module.exports = function(inputFileName, assetManager, sourcemaps, browsers) {
	if(!browsers || browsers.length === 0) {
		return result => result;
	}

	let filepath = path.relative(assetManager.referenceDir, inputFileName);
	console.error(`compiling Sass ${repr(filepath, false)} for ${browsers.join(", ")}`);

	let processor = postcss([
		autoprefixer({ overrideBrowserslist: browsers, map: sourcemaps })
	]);

	let options = {
		from: inputFileName
	};

	return input => {
		return processor.process(input.css, options).then(result => {
			let warnings = result.warnings();

			if(warnings.length > 0) {
				let errorMessage = warnings.
					map(warning => warning.toString()).
					join("\n");
				throw new Error(errorMessage);
			}

			return {
				css: result.css,
				loadedUrls: input.loadedUrls
			};
		});
	};
};
