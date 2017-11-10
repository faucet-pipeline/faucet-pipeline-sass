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
		assets: translateAssetConfig(config.assets || [], { configDir })
	};
};

function translateBundlerConfigs(bundleConfigs, options) {
	let { configDir, fingerprint, compact, prefixes } = options;

	if(prefixes) {
		throw new Error("The `prefixes` option has been removed.\n" +
			"Please create a .browserlistrc file instead:\n" +
			"https://github.com/ai/browserslist#config-file");
	}

	return bundleConfigs.map(bundleConfig => {
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
		let outputFilename = path.resolve(configDir, target);

		return {
			inputFileName,
			includePaths,
			outputFilename,
			configDir,
			outputStyle,
			fingerprint,
			target
		};
	});
}

function translateManifestConfig(manifestConfig, { configDir }) {
	if(manifestConfig === false) {
		return false;
	}

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
