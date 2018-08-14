let buildBundler = require("./build-bundler");
let { abort, repr } = require("faucet-pipeline-core/lib/util");

module.exports = (pluginConfig, assetManager, options) => {
	let { browsers, compact, sourcemaps } = options;
	let config = buildConfig(pluginConfig, assetManager, {
		browsers, compact, sourcemaps
	});
	return buildBundleAll(config);
};

function buildConfig(pluginConfig, assetManager, { browsers, compact, sourcemaps }) {
	return pluginConfig.map(({ source, target, browserslist, fingerprint }) => {
		if(!source || !target) {
			let setting = source ? "target" : "source";
			abort(`ERROR: missing ${repr(setting, false)} configuration in Sass bundle`);
		}

		let inputFileName = assetManager.resolvePath(source);
		target = assetManager.resolvePath(target, { enforceRelative: true });

		let outputStyle = compact ? "compact" : "nested";
		let includePaths = [ assetManager.packagesDir ];

		let selectedBrowsers;
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
			fingerprint,
			sourcemaps,
			target
		};
	});
}

function buildBundleAll(config) {
	let bundlers = config.map(bundleConfig => buildBundler(bundleConfig));

	return files => bundlers.forEach(bundler => bundler(files));
}
