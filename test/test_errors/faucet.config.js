"use strict";
let path = require("path");

module.exports = {
	sass: [{
		source: "./src/index.scss",
		target: "./dist/bundle.css"
	}],
	plugins: [path.resolve(__dirname, "../..")]
};
