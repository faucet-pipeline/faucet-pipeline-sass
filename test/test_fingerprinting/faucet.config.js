"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/fingerprint/bundle.css"
	}, {
		source: "./src/index.scss",
		target: "./dist/no-fingerprint/bundle.css",
		fingerprint: false
	}],
	manifest: {
		target: "./dist/manifest.json",
		value: f => `/assets/${f}`
	},
	plugins: {
		sass: {
			plugin: path.resolve("../.."),
			bucket: "styles"
		}
	}
};
