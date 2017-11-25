"use strict";

module.exports = {
	sass: [{
		entryPoint: "src/index.scss",
		target: "dist/bundle.css"
	}],
	manifest: {
		file: "./dist/manifest.json",
		baseURI: "/assets"
	}
};
