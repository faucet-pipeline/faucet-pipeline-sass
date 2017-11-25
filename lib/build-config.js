let path = require("path");
let browserslist = require("browserslist");

module.exports = (config, configDir, compact, manifest) => {
	return config.map(bundleConfig => {
		let inputFileName = path.resolve(configDir, bundleConfig.entryPoint);
		let outputStyle = compact ? "compressed" : "nested";
		// Use the node dependency resolution algorithm to figure out the
		// includePaths – only available in Node 8.9 and up
		let includePaths;
		if(require.resolve.paths) {
			includePaths = require.resolve.paths("something");
		} else {
			includePaths = [ path.resolve(configDir, "node_modules") ];
			console.warn("You are using Node.js < 8.9. We can " +
				"therefore only offer a fallback implementation for importing " +
				"Sass files from npm packages");
		}
		let target = bundleConfig.target;
		let browsers = browserslist.findConfig(configDir);

		return {
			inputFileName,
			includePaths,
			browsers,
			configDir,
			outputStyle,
			manifest,
			target
		};
	});
};
