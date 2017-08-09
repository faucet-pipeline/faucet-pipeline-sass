"use strict";

module.exports = {
	sass: {
		manifest: false,
		bundles: [{
			entryPoint: "src/index.scss",
			target: "dist/bundle.css"
		}]
	}
};
