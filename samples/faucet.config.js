module.exports = {
	sass: {
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
				target: "output/example.css"
			},
			{
				entryPoint: "./example2.scss",
				target: "output/subfolder/example2.css"
			}
		]
	}
};
