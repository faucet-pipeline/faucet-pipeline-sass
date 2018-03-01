"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	manifest: {
		file: "./dist/manifest.json",
		key: (f, targetDir) => path.relative(targetDir, f)
	},
	plugins: {
		sass: path.resolve("../..")
	}
};
