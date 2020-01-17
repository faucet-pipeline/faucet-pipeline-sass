"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/foo.scss",
		target: "./dist/foo.css"
	}, {
		source: "./src/bar.scss",
		target: "./dist/bar.css"
	}],
	manifest: {
		target: "./dist/manifest.json",
		value: f => `/assets/${f}`
	},
	plugins: [path.resolve(__dirname, "../..")]
};
