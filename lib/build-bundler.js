let path = require("path");
let sass = require("node-sass");
let { createFile, generateFingerprint } = require("faucet-pipeline-util");
let postcss = require("postcss");
let autoprefixer = require("autoprefixer");
const SassString = require("node-sass").types.String;

// Create a bundler for a specific bundle
module.exports = opts => {
	let previouslyIncludedFiles;

	let renderSass = buildSassRenderer(opts);
	let autoprefix = buildAutoprefixer(opts);
	let writeFile = buildFileWriter(opts);

	return (files, lookupAsset) => {
		// If this is the first run or the changed file is one of the
		// previously included ones, run the compiler
		if(previouslyIncluded(files, previouslyIncludedFiles)) {
			return renderSass(lookupAsset).
				then(autoprefix).
				then(writeFile).
				then(result => {
					previouslyIncludedFiles = result.includedFiles;

					return {
						changed: true,
						output: result.output,
						target: opts.target
					};
				});
		} else {
			return new Promise(resolve => {
				resolve({
					changed: false
				});
			});
		}
	};
};

function buildSassRenderer({ inputFileName, outputStyle, includePaths }) {
	return lookupAsset => {
		let sassOptions = {
			file: inputFileName,
			outputStyle: outputStyle,
			includePaths,
			functions: {
				"asset-url($assetName)": assetName => {
					// TODO: Create nice error output incl. a css file
					let mappedAssetName = lookupAsset(assetName.getValue());
					return new SassString(`url("${mappedAssetName}")`);
				}
			}
		};

		return new Promise((resolve, reject) => {
			sass.render(sassOptions, (err, result) => {
				if(err) {
					// TODO: Create nice error output incl. a css file
					// https://github.com/sass/node-sass#error-object
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	};
}

function buildAutoprefixer({ prefixes }) {
	let processor = postcss([ autoprefixer(prefixes) ]);

	return input => {
		return processor.process(input.css).then(result => {
			result.warnings().forEach(warn => {
				// TODO: Create nice error output incl. a css file
				console.warn(warn.toString());
			});

			return {
				css: result.css,
				stats: input.stats
			};
		});
	};
}

function buildFileWriter(opts) {
	let { fingerprint, configDir, inputFileName } =
		opts;

	return input => {
		let outputFilename = opts.outputFilename;

		if(fingerprint) {
			outputFilename = generateFingerprint(outputFilename, input.css);
		}

		return createFile(outputFilename, input.css).then(_ => {
			return {
				input: path.relative(configDir, inputFileName),
				output: path.relative(configDir, outputFilename),
				includedFiles: input.stats.includedFiles
			};
		});
	};
}

function previouslyIncluded(files, previouslyIncludedFiles) {
	return previouslyIncludedFiles === undefined ||
		files.some(file => {
			return previouslyIncludedFiles.find(candidate => candidate === file);
		});
}
