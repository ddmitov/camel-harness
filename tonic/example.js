const camelHarness = require("camel-harness");

let perlTest = {};
perlTest.interpreterSwitches = [];
perlTest.interpreterSwitches.push("-e");

perlTest.script = "use English; print \"Perl $PERL_VERSION\";";

perlTest.stdoutFunction = function (stdout) {
  console.log(stdout);
};

perlTest.errorFunction = function (error) {
  if (error.code === "ENOENT") {
    console.log("Perl interpreter was not found.");
  }
};

camelHarness.startScript(perlTest);
