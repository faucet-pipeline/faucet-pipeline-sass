let buildBundler = require("./build-bundler");

module.exports = (pluginConfig, assetManager, { watcher, browsers, compact }) => {
	let config = buildConfig(pluginConfig, assetManager, { browsers, compact });
	let bundleAll = buildBundleAll(config);

	// Run once for all files
	bundleAll();

	if(watcher) {
		watcher.on("edit", bundleAll);
	}
};

function buildConfig(pluginConfig, assetManager, { watcher, browsers, compact }) {
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
			target
		};
	});
}

function buildBundleAll(config) {
	let bundlers = config.map(bundleConfig => buildBundler(bundleConfig));

	return files => bundlers.forEach(bundler => bundler(files));
}
