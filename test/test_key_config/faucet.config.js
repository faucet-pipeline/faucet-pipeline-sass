"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	manifest: {
		target: "./dist/manifest.json",
		key: (f, targetDir) => path.relative(targetDir, f)
	},
	plugins: [path.resolve(__dirname, "../..")]
};
