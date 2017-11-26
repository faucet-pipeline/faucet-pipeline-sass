// monkey-patches faucet-pipeline to `require` local repository as faucet-pipeline-js
"use strict";

let hook = require("node-hook");
let path = require("path");

let faucetSass = path.resolve(__dirname, "..");
let faucetStatic = path.resolve(
		__dirname,
		"..",
		"node_modules",
		"faucet-pipeline-static");

hook.hook(".js", (src, name) => {
	if(/\/faucet-pipeline\/lib\/index.js$/.test(name)) {
		return src.
			replace("faucet-pipeline-sass", faucetSass).
			replace("faucet-pipeline-static", faucetStatic);
	}

	return src;
});
