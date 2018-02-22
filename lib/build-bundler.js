let path = require("path");
let sass = require("node-sass");
let postcss = require("postcss");
let autoprefixer = require("autoprefixer");
let SassString = require("node-sass").types.String;
let SassError = require("node-sass").types.Error;

// Create a bundler for a specific bundle
module.exports = config => {
	let previouslyIncludedFiles;

	let renderSass = buildSassRenderer(config);
	let autoprefix = buildAutoprefixer(config);
	let assetManager = config.assetManager;

	return filepaths => {
		// If this is the first run or the changed file is one of the
		// previously included ones, run the compiler
		if(previouslyIncluded(filepaths, previouslyIncludedFiles)) {
			renderSass().
				then(autoprefix).
				then(result => {
					previouslyIncludedFiles = result.stats.includedFiles.
						map(filepath => path.normalize(filepath));

					assetManager.writeFile(config.target, result.css);
				}).
				catch(error => {
					assetManager.writeFile(config.target, errorOutput(error.message), {
						error: error
					});
				});
		}
	};
};

function buildSassRenderer({ inputFileName, outputStyle, includePaths, assetManager }) {
	let sassOptions = {
		file: inputFileName,
		outputStyle: outputStyle,
		includePaths,
		functions: {
			"asset-url($assetName)": (assetName, done) => {
				assetManager.manifest.resolve(assetName.getValue()).
					then(mappedAssetName => {
						done(new SassString(`url("${mappedAssetName}")`));
					}).catch(err => {
						done(new SassError(err.message));
					});
			}
		}
	};

	return _ => renderSass(sassOptions);
}

function buildAutoprefixer({ browsers, inputFileName }) {
	if(!browsers) {
		return result => result;
	}

	if(browsers.length) {
		console.error("compiling Sass for", browsers.join(", "));
	}
	let processor = postcss([
		autoprefixer({ browsers })
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
				stats: input.stats
			};
		});
	};
}

function previouslyIncluded(filepaths, previouslyIncludedFiles) {
	return previouslyIncludedFiles === undefined ||
		filepaths.some(filepath => {
			return previouslyIncludedFiles.
				find(candidate => candidate === path.normalize(filepath));
		});
}

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

function errorOutput(message) {
	return `body:before {
	content: "\\26a0  CSS Error: ${message.replace(/"/g, "'")}";
	font-weight: bold;
	display: block;
	border: 5px solid red;
	padding: 5px;
}\n`;
}
