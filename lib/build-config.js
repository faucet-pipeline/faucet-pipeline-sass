let path = require("path");
let { uriJoin } = require("faucet-pipeline-util");

// Create the configuration object
//
// Combines the CLI parameters with the config file
// TODO: Check if the config is well formed
module.exports = (config, configDir, fingerprint, compact) => {
	return {
		bundles: translateBundlerConfigs(config.bundles, {
			configDir, fingerprint, compact, prefixes: config.prefixes
		}),
		manifest: translateManifestConfig(config.manifest, { configDir }),
		assets: translateAssetConfig(config.assets || [], { configDir }),
		report: { configDir }
	};
};

function translateBundlerConfigs(bundleConfigs, options) {
	let { configDir, fingerprint, compact, prefixes } = options;

	return bundleConfigs.map(bundleConfig => {
		let inputFileName = path.resolve(configDir, bundleConfig.entryPoint);
		let outputStyle = compact ? "compressed" : "nested";
		let includePaths = [ path.resolve(configDir, "node_modules") ];
		let target = bundleConfig.target;
		let outputFilename = path.resolve(configDir, target);

		return {
			inputFileName,
			includePaths,
			outputFilename,
			configDir,
			outputStyle,
			fingerprint,
			target,
			prefixes
		};
	});
}

function translateManifestConfig(manifestConfig, { configDir }) {
	let baseURI;

	if(manifestConfig.baseURI.call) {
		baseURI = manifestConfig.baseURI;
	} else {
		baseURI = bundlePath => uriJoin(manifestConfig.baseURI, bundlePath);
	}

	return {
		file: path.resolve(configDir, manifestConfig.file),
		baseURI: baseURI
	};
}

function translateAssetConfig(assets, { configDir }) {
	return assets.map(asset => path.resolve(configDir, asset));
}
