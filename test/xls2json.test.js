const should = require("should");
const xls2json = require("../");
const fs = require("fs");
const assert = require("assert");

describe("xls to json", function () {
	it("should convert xls to json", function () {
		xls2json(
			{
				input: "./sample/sample-xls.xls",
				output: null,
			},
			function (err, result) {
				should.not.exist(err);
				result.should.be.an.instanceOf(Object);
			}
		);
	});

	it("should convert xls to json file", function () {
		xls2json(
			{
				input: "./sample/sample-xls.xls",
				output: "./sample/test.json",
			},
			function (err, result) {
				should.not.exist(err);
				result.should.be.an.instanceOf(Object);
			}
		);
	});

	it("should read file in test.json", function () {
		const exist = fs.existsSync("./sample/test.json");
		exist.should.be.true();
	});

	it("should trim", function () {
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
			}
		);
	});

	it("should omit headers", function () {
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
			}
		);
	});
});
