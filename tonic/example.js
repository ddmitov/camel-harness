'use strict';

const CAMEL_HARNESS = require('camel-harness');

let perlScriptObject = {};
perlScriptObject.interpreter = 'perl';
perlScriptObject.scriptFullPath = '/test/test.pl';

perlScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

CAMEL_HARNESS.startScript(perlScriptObject);
