var camelHarness = require('camel-harness');

var perlScript = new Object();
perlScript.interpreter = "perl";
perlScript.scriptFullPath = "/test/test.pl";

perlScript.stdoutFunction = function(stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScript);
