"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css",
		typo: "something that doesn't exist"
	}],
	plugins: {
		sass: {
			plugin: path.resolve("../.."),
			bucket: "styles"
		}
	}
};
