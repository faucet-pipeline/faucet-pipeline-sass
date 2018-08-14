"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	manifest: {
		target: "./dist/manifest.json",
		value: f => `/assets/${path.relative("./dist", f)}`
	},
	plugins: {
		sass: {
			plugin: path.resolve("../.."),
			bucket: "styles"
		}
	}
};
