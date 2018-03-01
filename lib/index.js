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
	browsers = browsers.defaults;

	return pluginConfig.map(bundleConfig => {
		let inputFileName = assetManager.resolvePath(bundleConfig.source);
		let target = assetManager.resolvePath(bundleConfig.target, {
			enforceRelative: true
		});

		let outputStyle = compact ? "compact" : "nested";
		let includePaths = [ assetManager.packagesDir ];

		return {
			inputFileName,
			includePaths,
			browsers,
			outputStyle,
			assetManager,
			target
		};
	});
}

function buildBundleAll(config) {
	let bundlers = config.map(bundleConfig => buildBundler(bundleConfig));

	return files => bundlers.forEach(bundler => bundler(files));
}
