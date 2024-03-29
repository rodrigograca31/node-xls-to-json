const fs = require("fs");
const xlsx = require("xlsx");
const parse = require("csv-parse").parse;

function XLS_json(config, callback) {
	if (!config.input) {
		callback(
			new Error("node-xls-json: You did not provide an input file."),
			null
		);
	}
	new CV(config, callback);
}

function CV(config, callback) {
	const wb = this.load_xls(config.input);
	const ws = this.ws(wb, config.sheet);
	const csv = this.csv(ws);
	this.CSVToJSON(
		csv,
		config.output,
		callback,
		config.rowsToSkip || 0,
		config.allowEmptyKey
	);
}

CV.prototype.load_xls = function (input) {
	return xlsx.readFile(input);
};

CV.prototype.ws = function (wb, target_sheet) {
	ws = wb.Sheets[target_sheet ? target_sheet : wb.SheetNames[0]];
	return ws;
};

CV.prototype.csv = function (ws) {
	return (csv_file = xlsx.utils.sheet_to_csv(ws));
};

CV.prototype.CSVToJSON = function (
	csv,
	output,
	callback,
	rowsToSkip,
	allowEmptyKey = true
) {
	let records = [];
	let header = [];
	const parser = parse(csv);

	parser
		.on("readable", function () {
			let record = [];
			let index = 0;

			while ((record = parser.read())) {
				if (index === rowsToSkip) {
					header = record;
				} else if (index > rowsToSkip) {
					var obj = {};
					header.forEach(function (column, index) {
						if (!allowEmptyKey && !column.trim()) {
							return;
						}
						obj[column.trim()] = record[index].trim();
					});
					records.push(obj);
				}
				index++;
			}
		})
		.on("end", function (count) {
			if (output) {
				// write asynchronously and call the callback after so that theres no racing conditions on the tests
				fs.writeFile(
					output,
					JSON.stringify(records),
					{
						encoding: "utf8",
						flag: "w",
					},
					(err) => {
						if (err) {
							callback(err, null);
						} else {
							callback(null, records);
						}
					}
				);
			} else {
				callback(null, records);
			}
		})
		.on("error", function (error) {
			callback(error, null);
		});
};

// TODO: Convert it into a Class
// TODO: Convert to TypeScript
// TODO: Filter columns option (avoid filtering inside each row in order to increase performance)
// TODO: Parse integers option. e.g.: turn "id": "1" to "id": 1, code: Number.isInteger(parseInt("4"))

module.exports = XLS_json;
