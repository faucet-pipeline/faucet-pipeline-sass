"use strict";

module.exports = {
	sass: {
		manifest: {
			file: "./dist/manifest.json",
			baseURI: "/assets"
		},
		assets: [
			"./images.json"
		],
		bundles: [{
			entryPoint: "src/index.scss",
			target: "dist/bundle.css"
		}]
	}
};
