let buildBundler = require("./build-bundler");

module.exports = (pluginConfig, assetManager, options) => {
	let { browsers, compact, sourcemaps, watcher } = options;
	let config = buildConfig(pluginConfig, assetManager, {
		browsers, compact, sourcemaps
	});
	let bundleAll = buildBundleAll(config);

	// Run once for all files
	bundleAll();

	if(watcher) {
		watcher.on("edit", bundleAll);
	}
};

function buildConfig(pluginConfig, assetManager, { browsers, compact, sourcemaps }) {
	return pluginConfig.map(bundleConfig => {
		let inputFileName = assetManager.resolvePath(bundleConfig.source);
		let target = assetManager.resolvePath(bundleConfig.target, {
			enforceRelative: true
		});

		let outputStyle = compact ? "compact" : "nested";
		let includePaths = [ assetManager.packagesDir ];

		let selectedBrowsers;
		let { browserslist } = bundleConfig;
		if(browserslist === false) {
			selectedBrowsers = null;
		} else if(browserslist) {
			selectedBrowsers = browsers[browserslist];
		} else {
			selectedBrowsers = browsers.defaults;
		}

		return {
			inputFileName,
			includePaths,
			browsers: selectedBrowsers,
			outputStyle,
			assetManager,
			fingerprint: bundleConfig.fingerprint,
			sourcemaps,
			target
		};
	});
}

function buildBundleAll(config) {
	let bundlers = config.map(bundleConfig => buildBundler(bundleConfig));

	return files => bundlers.forEach(bundler => bundler(files));
}
