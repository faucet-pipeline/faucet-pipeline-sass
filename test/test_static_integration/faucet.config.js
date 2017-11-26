"use strict";

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	static: [{
		source: "./src/spacer.gif",
		target: "./dist/spacer.gif"
	}],
	manifest: {
		file: "./dist/manifest.json",
		value: f => `/assets/${f}`
	}
};
