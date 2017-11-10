let fs = require("fs");
let retryTimings = [10, 50, 100, 250, 500, 1000];

// Build an asset map reader
//
// An asset map reader looks up assets in a manifest file
module.exports = assetMaps => {
	return () => {
		return Promise.all(assetMaps.map(retry(readJSON, retryTimings))
		).then(maps => Object.assign({}, ...maps)
		).then(map => {
			return asset => map[asset];
		});
	};
};

function readJSON(assetMap) {
	return new Promise((resolve, reject) => {
		fs.readFile(assetMap, (err, data) => {
			if(err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

// Retries a function that returns a promise
// The first argument is the function
// The second argument is an array of ms to wait in between attempts
// Returns a function that takes the same arguments as the provided function
function retry(fn, retries) {
	return (...params) => fn(...params).catch(err => {
		if(retries.length === 0) {
			throw err;
		}
		let backoff = retries.shift();
		return wait(backoff).then(_ => retry(fn, retries)(...params));
	});
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
