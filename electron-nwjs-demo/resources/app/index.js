// camel-harness demo for Electron and NW.js

// Load the camel-harness module:
var harness = require('./camel-harness/camel-harness.js');

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

// Get the full path of the directory where Electron or NW.js binary is located:
var binaryPath = process.execPath;
var binaryDirectory = pathObject.dirname(binaryPath);

// Get the full path of the application root directory:
var applicationDirectory = pathObject.join(binaryDirectory, "resources", "app");

// Determine Perl interpreter:
var perlInterpreter;
if (platform !== "win32") {
  perlInterpreter = "perl";
} else {
  // Find a portable Windows Perl interpreter (if any):
  var portablePerl =
      pathObject.join(binaryDirectory, "perl", "bin", "perl.exe");

  // If portable Perl interpreter is not found,
  // use the first Perl interpreter on PATH:
  var filesystemObject = require('fs');
  filesystemObject.access(portablePerl, function(error) {
    if (error && error.code === 'ENOENT') {
      perlInterpreter = "perl";
    } else {
      perlInterpreter = portablePerl;
    }
  });
}

// Perl script handling functions:
function startPerlVersionScript() {
  var scriptFullPath =
      pathObject.join(applicationDirectory, "perl", "version.pl");
  harness.camelHarness(perlInterpreter, scriptFullPath, "versionScriptStdout",
    null, null, null, null, null);
}

global.versionScriptStdout = function(stdout) {
  document.getElementById("version-script").innerHTML = stdout;
}

function startLongRunningPerlScriptOne() {
  var scriptFullPath =
      pathObject.join(applicationDirectory, "perl", "counter.pl");
  harness.camelHarness(perlInterpreter, scriptFullPath,
    "longRunningPerlScriptOneStdout", null, null, null, null, null);
}

global.longRunningPerlScriptOneStdout = function(stdout) {
  document.getElementById("long-running-script-one").innerHTML = stdout;
}

function startLongRunningPerlScriptTwo() {
  var scriptFullPath =
      pathObject.join(applicationDirectory, "perl", "counter.pl");
  harness.camelHarness(perlInterpreter, scriptFullPath,
    "longRunningPerlScriptTwoStdout", null, null, null, null, null);
}

global.longRunningPerlScriptTwoStdout = function(stdout) {
  document.getElementById("long-running-script-two").innerHTML = stdout;
}
