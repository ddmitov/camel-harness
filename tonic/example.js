const camelHarness = require("camel-harness");

let perlTest = {};
perlTest.script = "use English; print $PERL_VERSION;";

perlTest.errorFunction = function (error) {
  if (error.code === "ENOENT") {
    console.log("Perl interpreter was not found.");
  }
};

camelHarness.startScript(perlTest);
