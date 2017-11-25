let buildBundler = require("./build-bundler");
let buildConfig = require("./build-config");

module.exports = (rawConfig, configDir, { watcher, manifest, compact }) => {
	let config = buildConfig(rawConfig, configDir, compact, manifest);
	let bundleAll = buildBundleAll(config);

	// Run once for all files
	bundleAll();

	if(watcher) {
		watcher.on("edit", bundleAll);
	}
};

function buildBundleAll(config) {
	let bundlers = config.map(bundleConfig => buildBundler(bundleConfig));

	return files => bundlers.forEach(bundler => bundler(files));
}
