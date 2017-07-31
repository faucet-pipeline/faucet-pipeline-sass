"use strict";

module.exports = {
	sass: {
		manifest: {
			file: "./dist/manifest.json",
			baseURI: "/assets"
		},
		assets: [],
		prefixes: {},
		bundles: [{
			entryPoint: "src/index.scss",
			target: "dist/bundle.css"
		}]
	}
};
