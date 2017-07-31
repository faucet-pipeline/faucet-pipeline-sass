"use strict";

module.exports = {
	sass: {
		manifest: {
			file: "./dist/manifest.json",
			baseURI: (bundlePath, baseName) =>
				`/assets/${baseName}`
		},
		bundles: [{
			entryPoint: "src/index.scss",
			target: "dist/bundle.css"
		}]
	}
};
