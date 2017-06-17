const camelHarness = require('camel-harness');

var perlScriptObject = {};
perlScriptObject.interpreter = 'perl';
perlScriptObject.scriptFullPath = '/test/test.pl';

perlScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScriptObject);
