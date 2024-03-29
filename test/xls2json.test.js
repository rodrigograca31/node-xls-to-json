const xls2json = require("../");
const fs = require("fs");
const assert = require("assert");

describe("xls to json", function () {
	it("should convert xls to json", function (done) {
		xls2json(
			{
				input: "./sample/sample-xls.xls",
				output: null,
			},
			function (err, result) {
				assert.strictEqual(err, null);
				assert.notStrictEqual(result, null);
				assert.strictEqual(typeof result, typeof {});
				done();
			}
		);
	});

	it("should convert xls to json file", function (done) {
		xls2json(
			{
				input: "./sample/sample-xls.xls",
				output: "./sample/test.json",
			},
			function (err, result) {
				assert.strictEqual(err, null);
				assert.notStrictEqual(result, null);
				assert.strictEqual(typeof result, typeof {});
				done();
			}
		);
	});

	describe("check if test.json exists", function () {
		it("test.json should exist", function () {
			const exist = fs.existsSync("./sample/test.json");
			assert(exist);
		});
	});

	it("should trim", function (done) {
		xls2json(
			{
				input: "./sample/testtrim.xls",
			},
			function (err, result) {
				assert.strictEqual(err, null);
				assert.notStrictEqual(result, null);
				assert.strictEqual(typeof result, typeof {});

				//test any space
				const re = /\s/;
				assert(!re.test(result[0].name));
				done();
			}
		);
	});

	it("should omit headers", function (done) {
		xls2json(
			{
				input: "./sample/skiprows.xls",
				rowsToSkip: 4,
			},
			function (err, result) {
				assert.strictEqual(err, null);
				assert.notStrictEqual(result, null);
				assert.strictEqual(typeof result, typeof {});

				// test headers
				assert.notStrictEqual(result[0], null);
				assert.notStrictEqual(result[0], undefined);
				assert.strictEqual(result[0].id, "1");
				assert.deepStrictEqual(result[0], {
					id: "1",
					first_name: "Christian",
					last_name: "Lude",
					email: "clude0@example.com",
				});
				done();
			}
		);
	});

	it("should call callback", function (done) {
		xls2json(
			{
				input: "./sample/sample-xls.xls",
				output: null,
			},
			function (err, result) {
				done();
			}
		);
	});

	const correctJSON = [
		{ id: "1", name: "Rodrigo", email: "rodrigo@example.com" },
		{ id: "2", name: "Joe", email: "joe@example.com" },
		{ id: "3", name: "Eric", email: "eric@example.com" },
	];

	it("writes to file correctly", function (done) {
		xls2json(
			{
				input: "./sample/formats/example.xlsx",
				output: "./sample/formats/write.json",
			},
			function (err, result) {
				fs.readFile(
					"./sample/formats/write.json",
					"utf-8",
					function (err, data) {
						if (err) throw err;
						assert.deepStrictEqual(JSON.parse(data), correctJSON);
						done();
					}
				);
			}
		);
	});

	it("should filter empty key/header", function (done) {
		xls2json(
			{
				input: "./sample/no_header.xlsx",
				allowEmptyKey: false,
			},
			function (err, result) {
				if (err) throw err;

				// makes sure it still looks like the example JSON even though its using a different file with extra information but no header/key for that information
				assert.deepStrictEqual(result, correctJSON);
				done();
			}
		);
	});
	describe("supports multiple file formats", function () {
		it("supports .ods", function (done) {
			xls2json(
				{
					input: "./sample/formats/example.ods",
					// output: "./sample/formats/example.json",
				},
				function (err, result) {
					assert.strictEqual(err, null);
					assert.deepStrictEqual(result, correctJSON);
					done();
				}
			);
		});

		it("supports .xls", function (done) {
			xls2json(
				{
					input: "./sample/formats/example.xls",
					// output: "./sample/formats/example.json",
				},
				function (err, result) {
					assert.strictEqual(err, null);
					assert.deepStrictEqual(result, correctJSON);
					done();
				}
			);
		});

		it("supports .xlsx", function (done) {
			xls2json(
				{
					input: "./sample/formats/example.xlsx",
					// output: "./sample/formats/example.json",
				},
				function (err, result) {
					assert.strictEqual(err, null);
					assert.deepStrictEqual(result, correctJSON);
					done();
				}
			);
		});
	});
});

// TODO: test sheet config
