const should = require("should");
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
				should.not.exist(err);
				result.should.be.an.instanceOf(Object);
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
				should.not.exist(err);
				result.should.be.an.instanceOf(Object);
				done();
			}
		);
	});

	it("should read file in test.json", function () {
		const exist = fs.existsSync("./sample/test.json");
		exist.should.be.true();
	});

	it("should trim", function (done) {
		xls2json(
			{
				input: "./sample/testtrim.xls",
				output: "./sample/test.json",
			},
			function (err, result) {
				should.not.exist(err);
				result.should.be.an.instanceOf(Object);

				//test any space
				const re = /\s/;
				re.test(result[0].name).should.be.false();
				done();
			}
		);
	});

	it("should omit headers", function (done) {
		xls2json(
			{
				input: "./sample/skiprows.xls",
				output: "./sample/skiprows.json",
				rowsToSkip: 4,
			},
			function (err, result) {
				should.not.exist(err);
				result.should.be.an.instanceOf(Object);

				// test headers
				should.exist(result[0]);

				should.equal(result[0].id, "1");

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
				fs.readFile("./sample/formats/write.json", "utf-8", function (
					err,
					data
				) {
					if (err) throw err;

					assert.deepStrictEqual(JSON.parse(data), correctJSON);
					done();
				});
			}
		);
	});
	describe("supports multiple file formats", function () {
		it("supports .ods", function (done) {
			xls2json(
				{
					input: "./sample/formats/example.ods",
					output: "./sample/formats/example.json",
				},
				function (err, result) {
					should.not.exist(err);
					assert.deepStrictEqual(result, correctJSON);
					done();
				}
			);
		});

		it("supports .xls", function (done) {
			xls2json(
				{
					input: "./sample/formats/example.xls",
					output: "./sample/formats/example.json",
				},
				function (err, result) {
					should.not.exist(err);
					assert.deepStrictEqual(result, correctJSON);
					done();
				}
			);
		});

		it("supports .xlsx", function (done) {
			xls2json(
				{
					input: "./sample/formats/example.xlsx",
					output: "./sample/formats/example.json",
				},
				function (err, result) {
					should.not.exist(err);
					assert.deepStrictEqual(result, correctJSON);
					done();
				}
			);
		});
	});
});
