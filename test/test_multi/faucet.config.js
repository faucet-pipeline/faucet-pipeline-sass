"use strict";

module.exports = {
	sass: {
		manifest: {
			file: "./dist/manifest.json",
			baseURI: "/assets"
		},
		bundles: [{
			entryPoint: "src/foo.scss",
			target: "dist/foo.css"
		}, {
			entryPoint: "src/bar.scss",
			target: "dist/bar.css"
		}]
	}
};
