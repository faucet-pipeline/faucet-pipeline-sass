"use strict";

module.exports = {
	sass: [{
		entryPoint: "src/foo.scss",
		target: "dist/foo.css"
	}, {
		entryPoint: "src/bar.scss",
		target: "dist/bar.css"
	}],
	manifest: {
		file: "./dist/manifest.json",
		baseURI: "/assets"
	}
};
