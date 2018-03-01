"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	manifest: {
		file: "./dist/manifest.json",
		value: f => `/assets/${path.relative("./dist", f)}`
	},
	plugins: {
		sass: path.resolve("../..")
	}
};
