module.exports = {
	sass: {
		targetDir: "./output",
		manifest: {
			file: "./css.json",
			baseURI: "/assets"
		},
		assets: [
			"./images.json"
		],
		prefixes: {
			browsers: [
				"last 2 versions",
				"Chrome 21"
			]
		},
		bundles: [
			{
				entryPoint: "./example.scss",
				target: "example.css"
			},
			{
				entryPoint: "./example2.scss",
				target: "subfolder/example2.css"
			}
		]
	}
};
