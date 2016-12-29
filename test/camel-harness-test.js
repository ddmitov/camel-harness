// camel-harness test

// Determine the operating system and initialize 'path' object:
var os = require('os');
var platform = os.platform();

var path;
if (platform !== "win32") {
  path = require('path').posix;
} else {
  path = require('path').win32;
}

// Locate and load the camel-harness package:
var camelHarnessDirectory = path.resolve(__dirname, '..');
var camelHarnessFullPath = path.join(camelHarnessDirectory, "camel-harness.js");
var camelHarness = require(camelHarnessFullPath);

// Locate the Perl test script:
var perlTestScriptFullPath = path.join(__dirname, "camel-harness-test.pl");

// Initialize Perl script object:
var perlTestScript = new Object();
perlTestScript.interpreter = "perl";
perlTestScript.scriptFullPath = perlTestScriptFullPath;

perlTestScript.stdoutFunction = function(stdout) {
  console.log('camel-harness test: OK - using ' + stdout);
};

// Start the Perl test script:
camelHarness.startScript(perlTestScript);
