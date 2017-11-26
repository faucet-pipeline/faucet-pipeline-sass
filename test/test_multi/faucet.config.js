"use strict";

module.exports = {
	sass: [{
		source: "./src/foo.scss",
		target: "./dist/foo.css"
	}, {
		source: "./src/bar.scss",
		target: "./dist/bar.css"
	}],
	manifest: {
		file: "./dist/manifest.json",
		value: f => `/assets/${f}`
	}
};
