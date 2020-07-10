# node-xls-json

[![Build Status](https://travis-ci.org/rodrigograca31/node-xls-to-json.svg?branch=master)](https://travis-ci.org/rodrigograca31/node-xls-to-json) [![npm version](https://badge.fury.io/js/xls-to-json.svg)](https://www.npmjs.com/package/xls-to-json)

Converting xls file to json files using nodejs

## Install

```bash
npm install xls-to-json
```

## Usage

```javascript
node_xj = require("xls-to-json");
node_xj(
	{
		input: "sample.xls", // input xls
		output: "output.json", // output json
		sheet: "sheetname", // specific sheetname
		rowsToSkip: 5, // number of rows to skip at the top of the sheet; defaults to 0
	},
	function (err, result) {
		if (err) {
			console.error(err);
		} else {
			console.log(result);
		}
	}
);
```

In config object, you have to enter an input path. But If you don't want to output any file you can set to `null`.

## License

MIT [@chilijung](http://github.com/chilijung)
