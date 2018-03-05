"use strict";
let path = require("path");

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
		target: "./dist/manifest.json",
		value: f => `/assets/${f}`
	},
	plugins: {
		sass: path.resolve("../..")
	}
};
