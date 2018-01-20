"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	manifest: {
		file: "./dist/manifest.json",
		value: f => `/assets/${f}`
	},
	plugins: {
		"sass": path.resolve("../..")
	}
};
