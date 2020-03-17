let { abort } = require("faucet-pipeline-core/lib/util");
let path = require("path");
let makeAutoprefixer = require("./make-autoprefixer");
let makeSassRenderer = require("./make-sass-renderer");

module.exports = {
	key: "sass",
	bucket: "styles",
	plugin: faucetSass
};

function faucetSass(config, assetManager, { browsers, compact, sourcemaps } = {}) {
	let bundlers = config.map(bundleConfig =>
		makeBundler(bundleConfig, assetManager, { browsers, compact, sourcemaps }));

	return filepaths => Promise.all(bundlers.map(bundle => bundle(filepaths)));
}

function makeBundler(config, assetManager, { browsers, compact, sourcemaps } = {}) {
	let { browserslist, fingerprint } = config;

	if(!config.source || !config.target) {
		abort("ERROR: Sass configuration requires both target and source");
	}

	let source = assetManager.resolvePath(config.source);
	let target = assetManager.resolvePath(config.target, { enforceRelative: true });

	if(browserslist === false) {
		browsers = null;
	} else if(browserslist) {
		browsers = browsers[browserslist];
	} else {
		browsers = browsers.defaults;
	}

	let renderSass = makeSassRenderer(source, target, assetManager, sourcemaps, compact);
	let autoprefix = makeAutoprefixer(source, assetManager, sourcemaps, browsers);

	let previouslyIncludedFiles;

	return filepaths => {
		// If this is the first run or the changed file is one of the
		// previously included ones, run the compiler
		if(previouslyIncluded(filepaths, previouslyIncludedFiles)) {
			return renderSass().
				then(autoprefix).
				then(result => {
					previouslyIncludedFiles = result.stats.includedFiles.
						map(filepath => path.normalize(filepath));

					let options = {};
					if(fingerprint !== undefined) {
						options.fingerprint = fingerprint;
					}
					return assetManager.writeFile(target, result.css, options);
				}).
				catch(error => {
					let options = { error };
					if(fingerprint !== undefined) {
						options.fingerprint = fingerprint;
					}
					assetManager.writeFile(target, errorOutput(error.message),
							options);
				});
		}
	};
}

function previouslyIncluded(filepaths, previouslyIncludedFiles) {
	return previouslyIncludedFiles === undefined ||
		filepaths.some(filepath => {
			return previouslyIncludedFiles.
				find(candidate => candidate === path.normalize(filepath));
		});
}

function errorOutput(message) {
	return `body:before {
	content: "\\26a0  CSS Error: ${message.replace(/"/g, "'").replace(/\s+/g, " ")}";
	font-weight: bold;
	display: block;
	border: 5px solid red;
	padding: 5px;
}\n`;
}
