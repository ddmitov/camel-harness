const camelHarness = require("camel-harness");

let perlTest = {};
perlTest.script = "/test/test.pl";

perlTest.errorFunction = function (error) {
  if (error.code === "ENOENT") {
    console.log("Perl interpreter was not found.");
  }
};

camelHarness.startScript(perlTest);
