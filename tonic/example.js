const camelHarness = require("camel-harness");

let perlScriptObject = {};
perlScriptObject.scriptFullPath = "/test/test.pl";

perlScriptObject.stdoutFunction = function (stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScriptObject);
