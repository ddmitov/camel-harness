// camel-harness test

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

// Locate and load the camel-harness package:
var camelHarnessDirectory = pathObject.resolve(__dirname, '..');
var camelHarnessPackage =
    pathObject.join(camelHarnessDirectory, "camel-harness.js");
var harness = require(camelHarnessPackage);

// Locate the Perl test script:
var perlTestScript =
    pathObject.join(__dirname, "camel-harness-test.pl");

// Start the Perl test script:
harness.camelHarness("perl", perlTestScript, "testScriptStdout",
  null, null, null, null, null);

// Handle the output from the Perl test script:
global.testScriptStdout = function(stdout) {
  console.log('camel-harness test: ' + stdout);
};
