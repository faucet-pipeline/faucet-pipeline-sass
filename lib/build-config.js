let path = require("path");

// Create the configuration object
//
// Combines the CLI parameters with the config file
// TODO: Check if the config is well formed
module.exports = (config, targetDir, configDir, fingerprint, compact) => {
	return {
		bundles: translateBundlerConfigs(config.bundles, {
			targetDir, configDir, fingerprint, compact, prefixes: config.prefixes
		}),
		manifest: translateManifestConfig(config.manifest, { configDir }),
		assets: translateAssetConfig(config.assets, { configDir })
	};
};

function translateBundlerConfigs(bundleConfigs, options) {
	let { targetDir, configDir, fingerprint, compact, prefixes } = options;

	return bundleConfigs.map(bundleConfig => {
		let inputFileName = path.resolve(configDir, bundleConfig.entryPoint);
		let outputFilename = `${path.basename(inputFileName, ".scss")}.css`;
		let outputStyle = compact ? "compressed" : "nested";
		let includePaths = [ path.resolve(configDir, "node_modules") ];

		return {
			inputFileName,
			includePaths,
			outputFilename,
			configDir,
			outputStyle,
			fingerprint,
			targetDir,
			prefixes
		};
	});
}

function translateManifestConfig(manifestConfig, { configDir }) {
	return {
		file: path.resolve(configDir, manifestConfig.file),
		baseURI: manifestConfig.baseURI
	};
}

function translateAssetConfig(assets, { configDir }) {
	return assets.map(asset => path.resolve(configDir, asset));
}
