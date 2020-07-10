const fs = require("fs");
const xlsx = require("xlsx");
const csv = require("csv");

module.exports = XLS_json;

function XLS_json(config, callback) {
	if (!config.input) {
		callback(
			new Error("node-xls-json: You did not provide an input file."),
			null
		);
	}
}

function CV(config, callback) {
	const wb = this.load_xls(config.input);
	const ws = this.ws(wb, config.sheet);
	const csv = this.csv(ws);
	this.cvjson(csv, config.output, callback, config.rowsToSkip || 0);
}

CV.prototype.load_xls = function (input) {
	return xlsx.readFile(input);
};

CV.prototype.ws = function (wb, target_sheet) {
	ws = wb.Sheets[target_sheet ? target_sheet : wb.SheetNames[0]];
	return ws;
};

CV.prototype.csv = function (ws) {
	return (csv_file = xlsx.utils.make_csv(ws));
};

CV.prototype.cvjson = function (csv, output, callback, rowsToSkip) {
	var record = [];
	var header = [];

	csv
		.transform(
			csv.parse(csv),

			function (row) {
				row.unshift(row.pop());
				return row;
			}
		)
		.on("record", function (row, index) {
			if (index === rowsToSkip) {
				header = row;
			} else if (index > rowsToSkip) {
				var obj = {};
				header.forEach(function (column, index) {
					obj[column.trim()] = row[index].trim();
				});
				record.push(obj);
			}
		})
		.on("end", function (count) {
			// when writing to a file, use the 'close' event
			// the 'end' event may fire before the file has been written
			if (output !== null) {
				var stream = fs.createWriteStream(output, { flags: "w" });
				stream.write(JSON.stringify(record));
				callback(null, record);
			} else {
				callback(null, record);
			}
		})
		.on("error", function (error) {
			callback(error, null);
		});
};

// TODO: Convert it into a Class
// TODO: Convert to TypeScript
