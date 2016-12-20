// camel-harness test

// Load the camel-harness module:
var harness = require('camel-harness');

// Determine the operating system:
var osObject = require('os');
var platform = osObject.platform();

// Initialize 'path' object:
var pathObject;
if (platform !== "win32") {
  pathObject = require('path').posix;
} else {
  pathObject = require('path').win32;
}

// Locate the Perl test script:
var thisScriptPath = process.cwd();
var perlTestScript =
    pathObject.join(thisScriptPath, "camel-harness-test.pl");

// Start the Perl test script:
harness.camelHarness("perl", perlTestScript, "testScriptStdout",
  null, null, null, null, null);

// Handle the output from the Perl test script:
global.testScriptStdout = function(stdout) {
  console.log('camel-harness test: ' + stdout);
};
